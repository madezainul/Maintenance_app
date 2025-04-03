'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');
const { ReportDetail } = require('../models/ReportDetailModel');

// Route to handle adding a new report
router.get('/report_add', async (req, res) => {
    res.render('report/report_add', { title: 'Create Report' });
});

router.post('/create', async (req, res) => {
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
        res.redirect('/report/report_add');
    }
});

router.post('/update', async (req, res) => {
    try {
        let { id, date, shift, equipment_name, equipment_id, problem_description, solution_part_replaced, status, start_time, stop_time, total_time_spent, technician_name, supervisor, category } = req.body;

        // Fetch the existing report by ID
        const existingReport = await ReportDetail.getone('id', id);
        if (!existingReport) {
            req.flash('warning', 'The requested report was not found.');
            return res.redirect('/report/report_detail');
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
        res.redirect('/report/report_detail');
    }
});

router.get('/delete/:id', async (req, res) => {
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
        res.redirect('/report/report_detail');
    } catch (err) {
        console.error('Error deleting report:', err);
        req.flash('warning', 'An issue occurred while deleting the report. Please try again.');
        res.redirect('/report/report_detail');
    }
});

router.get('/report_detail', async (req, res) => {
    try {
        // Fetch all reports from the database
        const rows = await ReportDetail.all();

        // Format the data for rendering
        let context = {
            title: 'Report Details',
            reports: rows.map(row => ({
                ...row,
                date: moment(row.date).format('YYYY-MM-DD'),
                // Uncomment if needed:
                // start_time: moment(row.start_time).format('hh:mm:ss'),
                // stop_time: moment(row.stop_time).format('hh:mm:ss')
            }))
        };

        // Render the report detail page
        res.render('report/report_detail', context);
    } catch (err) {
        console.error('Error fetching all reports:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Dynamic route to fetch reports by year and month
router.get('/report_detail/:year/:month', async (req, res) => {
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
        res.render('report/report_detail', context);
    } catch (err) {
        console.error('Error fetching reports by year/month:', err);
        res.status(500).send('Internal Server Error');
    }
});

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Route to handle the report page
router.get('/report_page', async (req, res) => {
    try {
        // Fetch unique year-month data from the database
        const rows = await ReportDetail.getUniqueYearMonth();

        // Format the data for rendering
        let context = {
            title: 'Report Details',
            reports: rows.map(item => ({
                ...item,
                month_name: monthNames[item.month - 1] // Convert month number to name
            }))
        };

        // Render the report page
        res.render('report/report_page', context);
    } catch (err) {
        console.error('Error fetching unique year-month data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;