'use strict'

const express = require('express');
const router = express.Router();
const moment = require('moment');
const { ReportDetail } = require('../models/ReportDetailModel');


// Routes untuk handle report_add
router.get('/report_add', async (req, res) => {
    res.render('report/report_add', { title: 'Create Report' });
});

router.post('/create', (req, res) => {
    console.log(req.body);
    let { date, shift, equipment_name, equipment_id, problem_description, solution_part_replaced, status, start_time, stop_time, total_time_spent, technician_name, supervisor, category } = req.body;
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
    }
    ReportDetail.add(reportData, () => {
                req.flash('success', 'report berhasil ditambahkan, silahkan cek email untuk aktivasi akun');
                res.redirect(`/report/report_detail/${moment(date).format('YYYY')}/${moment(date).format('M')}`);
            });
});

router.post('/update', (req, res) => {
    let { id, date, shift, equipment_name, equipment_id, problem_description, solution_part_replaced, start_time, stop_time, total_time_spent, technician_name, supervisor, category } = req.body;
    ReportDetail.getone('id', id, (err, row) => {
        
        console.log("id = ", id)
        let reportData = {
            id: id,
            date: date,
            shift: shift,
            equipment_name: equipment_name,
            equipment_id: equipment_id,
            problem_description: problem_description,
            solution_part_replaced: solution_part_replaced,
            start_time: start_time,
            stop_time: stop_time,
            total_time_spent: total_time_spent,
            technician_name: technician_name,
            supervisor: supervisor,
            category: category
        }
        // Message.activateAccount(email, userData.token);
        ReportDetail.put(reportData, () => {
            req.flash('success', 'data report berhasil diubah, silahkan cek email untuk aktivasi akun anda');
            res.redirect(`/report/report_detail/${moment(date).format('YYYY')}/${moment(date).format('M')}`);
        });
    })
});

router.get('/delete/:id', (req, res) => {
    ReportDetail.getone('id', req.params.id, (err, userRow) => {
        ReportDetail.del(req.params.id, () => {
            req.flash('success', 'data report berhasil dihapus');
            res.redirect('/report/report_detail');
        });
    });
});

router.get('/report_detail', async (req, res) => {
    ReportDetail.all((err, rows) => {
        let context = {
            title: 'Report Details',
            reports: rows.map(row => {
                return {
                    ...row, 
                    date: moment(row.date).format('YYYY-MM-DD'),
                    // start_time: moment(row.start_time).format('hh:mm:ss'),
                    // stop_time: moment(row.stop_time).format('hh:mm:ss')
                }
            })
        };
        res.render('report/report_detail', context);
    });
});

// Routes dynamic
router.get('/report_detail/:year/:month', async (req, res) => {
    ReportDetail.getdate(req.params.year, req.params.month, (err, rows) => {
        let context = {
            title: 'Report Details',
            reports: rows.map(row => {
                return {
                    ...row, 
                    date: moment(row.date).format('YYYY-MM-DD')
                }
            })
        };
        res.render('report/report_detail', context);
    });
});

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

//Routes untuk handle report_page
router.get('/report_page', async (req, res) => {
    try {
        // Fetch unique year-month data from the database
        const rows = await ReportDetail.getUniqueYearMonth();
        console.log(rows);

        // Format the data for rendering
        let context = {
            title: 'Report Details',
            reports: rows.map(item => ({
                ...item,
                month_name: monthNames[item.month - 1] // Convert month number to name
            }))
        };
        //  Coba-coba

        // Render the report page with the formatted data
        res.render('report/report_page', context);
    } catch (err) {
        console.error('Error fetching report details:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;