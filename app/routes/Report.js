'use strict'

const express = require('express');
const router = express.Router();
const { ReportDetails } = require('../models/ReportDetails');


// Routes untuk handle report_add
router.get('/report_add', async (req, res) => {
    res.render('report/report_add', { title: 'Create Report' });
});

// Routes untuk handle report_detail
router.get('/report_detail', async (req, res) => {
    ReportDetails.all((err, rows) => {
        if (err) {
            return res.status(500).send('Error getting report');
        }
        res.render('report/report_detail', { reports: rows });
    });
});

module.exports = router;