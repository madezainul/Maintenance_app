'use strict'

const express = require('express');
const router = express.Router();
const moment = require('moment');
const { ReportDetails } = require('../models/ReportDetails');


// Routes untuk handle report_add
router.get('/report_add', async (req, res) => {
    res.render('report/report_add', { title: 'Create Report' });
});

// Routes untuk handle report_detail
// router.get('/report_detail', async (req, res) => {
//     ReportDetails.all((err, rows) => {
//         if (err) {
//             return res.status(500).send('Error getting report');
//         }
//         res.render('report/report_detail', { reports: rows });
//     });
// });
router.get('/report_detail', async (req, res) => {
    ReportDetails.all((err, rows) => {
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


//Routes untuk handle report_page
router.get('/report_page', async (req, res) => {
    res.render('report/report_page', { title: 'Report Page' });
});

router.get('/report_page/:year/:month', async (req, res) => {
    let context = {
        year: req.params.year,
        month: req.params.month
    }
    res.render("report/apaajah", context);
    // ReportDetails.findById(req.params.id, (err, row) => {
    //     if (err) {
    //         return res.status(500).send('Error getting report');
    //     }
    //     res.render('report/report_page', { report: row });
    // });

});

module.exports = router;