'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');
const { ReportDetail } = require('../models/ReportDetailModel');
const { Auth } = require('../middlewares/Auth');
const xlsx = require('xlsx');
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Route to handle the report page
router.get('/', Auth.isUser, async (req, res) => {
    try {
        // Fetch unique year-month data from the database
        const rows = await ReportDetail.getUniqueYearMonth();

        // Format the data for rendering
        let context = {
            title: 'Report Lists',
            reports: rows.map(item => ({
                ...item,
                month_name: monthNames[item.month - 1] // Convert month number to name
            }))
        };

        // Render the report page
        res.render('report/index', context);
    } catch (err) {
        console.error('Error fetching unique year-month data:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:year/:month', Auth.isUser, async (req, res) => {
    try {
        const { year, month } = req.params;

        // Fetch reports for the specified year and month
        const rows = await ReportDetail.getdate(year, month);

        // Format the data for rendering
        let context = {
            title: 'Report Details',
            reports: rows.map(row => ({
                ...row,
                date: moment(row.date).format('YYYY-MM-DD')
            }))
        };

        // Render the report detail page
        res.render('report/detail', context);
    } catch (err) {
        console.error('Error fetching reports by year/month:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/create', Auth.isUser, async (req, res) => {
    try {
        console.log(req.body);
        let { date, shift, equipment_name, equipment_id, problem_description, solution_part_replaced, status, start_time, stop_time, total_time_spent, technician_name, supervisor, category } = req.body;

        // Prepare the report data
        let reportData = {
            date: date,
            shift: shift,
            equipment_name: equipment_name,
            equipment_id: equipment_id,
            problem_description: problem_description,
            solution_part_replaced: solution_part_replaced,
            status: status,
            start_time: start_time,
            stop_time: stop_time,
            total_time_spent: total_time_spent,
            technician_name: technician_name,
            supervisor: supervisor,
            category: category
        };

        // Add the report to the database
        await ReportDetail.add(reportData);

        // Set success message and redirect
        req.flash('success', 'The report has been successfully added.');
        res.redirect(`/report/report_detail/${moment(date).format('YYYY')}/${moment(date).format('M')}`);
    } catch (err) {
        console.error('Error creating report:', err);
        req.flash('warning', 'An issue occurred while adding the report. Please try again.');
        res.redirect(`/report/report_page`);
    }
});

router.post('/update', Auth.isUser, async (req, res) => {
    try {
        let { id, date, shift, equipment_name, equipment_id, problem_description, solution_part_replaced, status, start_time, stop_time, total_time_spent, technician_name, supervisor, category } = req.body;

        // Fetch the existing report by ID
        const existingReport = await ReportDetail.getone('id', id);
        if (!existingReport) {
            req.flash('warning', 'The requested report was not found.');
            return res.redirect('/report/report_page');
        }

        // Prepare the updated report data
        let reportData = {
            id: id,
            date: date,
            shift: shift,
            equipment_name: equipment_name,
            equipment_id: equipment_id,
            problem_description: problem_description,
            solution_part_replaced: solution_part_replaced,
            status: status,
            start_time: start_time,
            stop_time: stop_time,
            total_time_spent: total_time_spent,
            technician_name: technician_name,
            supervisor: supervisor,
            category: category
        };

        // Update the report in the database
        await ReportDetail.put(reportData);

        // Set success message and redirect
        req.flash('success', 'The report has been successfully updated.');
        res.redirect(`/report/report_detail/${moment(date).format('YYYY')}/${moment(date).format('M')}`);
    } catch (err) {
        console.error('Error updating report:', err);
        req.flash('warning', 'An issue occurred while updating the report. Please try again.');
        res.redirect(`/report/report_detail/${moment(date).format('YYYY')}/${moment(date).format('M')}`);
    }
});

router.get('/delete/:id', Auth.isUser, async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch the report by ID before deleting
        const report = await ReportDetail.getone('id', id);
        if (!report) {
            req.flash('warning', 'The requested report was not found.');
            return res.redirect('/report/report_detail');
        }

        // Delete the report from the database
        await ReportDetail.del(id);

        // Set success message and redirect
        req.flash('success', 'The report has been successfully deleted.');
        res.redirect(`/report/report_detail/${moment(report.date).format('YYYY')}/${moment(report.date).format('M')}`);
    } catch (err) {
        console.error('Error deleting report:', err);
        req.flash('warning', 'An issue occurred while deleting the report. Please try again.');
        res.redirect(`/report/report_detail/${moment(report.date).format('YYYY')}/${moment(report.date).format('M')}`);
    }
});

// Route to export reports for a specific year and month to XLSX
router.get('/export/:year/:month', Auth.isUser, async (req, res) => {
    try {
        const { year, month } = req.params;

        // Fetch reports for the specified year and month
        const rows = await ReportDetail.getdate(year, month);

        if (!rows || rows.length === 0) {
            return res.status(404).send('No data available for the specified year and month.');
        }

        // Format the data for the Excel sheet
        const formattedData = rows.map(row => ({
            Date: moment(row.date).format('YYYY-MM-DD'),
            Shift: row.shift,
            Equipment_Name: row.equipment_name,
            Equipment_ID: row.equipment_id,
            Problem_Description: row.problem_description,
            Solution_Part_Replaced: row.solution_part_replaced,
            Status: row.status,
            Start_Time: row.start_time,
            Stop_Time: row.stop_time,
            Total_Time_Spent: row.total_time_spent,
            Technician_Name: row.technician_name,
            Supervisor: row.supervisor,
            Category: row.category
        }));

        // Create a worksheet
        const worksheet = xlsx.utils.json_to_sheet(formattedData);

        // Create a workbook and append the worksheet
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Generate a buffer for the Excel file
        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reports_${year}-${month}.xlsx`);

        // Send the Excel file as a response
        res.send(excelBuffer);
    } catch (err) {
        console.error('Error exporting reports to XLSX:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;