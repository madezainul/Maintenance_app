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
    let { date, shift, equipment_name, equipment_id, problem_description, solution_part_replaced, start_time, stop_time, total_time_spent, technician_name, supervisor, category } = req.body;
    let reportData = {
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
    ReportDetail.add(reportData, () => {
                req.flash('success', 'report berhasil ditambahkan, silahkan cek email untuk aktivasi akun');
                res.redirect('/report/report_detail');
            });
    // User.check(username, email, (err, userRow) => {
    //     console.log(userRow);
    //     if (userRow) {
    //         req.flash('warning', 'username atau email sudah ada');
    //         return res.redirect('/user');
    //     }
    //     let userData = {
    //         username: username,
    //         email: email,
    //         role: role,
    //         password: encrypt(password),
    //         token: crypto.randomBytes(32).toString('hex'),
    //         token_expires_at: moment().add(1, 'd').format('YYYY-MM-DD hh:mm:ss'),

    //         // remove this if the email verification feature was acivated
    //         verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
    //     };
    //     // Message.activateAccount(email, userData.token);
    //     User.add(userData, () => {
    //         req.flash('success', 'user berhasil ditambahkan, silahkan cek email untuk aktivasi akun');
    //         res.redirect('/user');
    //     });
    // });
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

// Routes untuk handle report_detail
// router.get('/report_detail', async (req, res) => {
//     ReportDetail.all((err, rows) => {
//         if (err) {
//             return res.status(500).send('Error getting report');
//         }
//         res.render('report/report_detail', { reports: rows });
//     });
// });



//Routes untuk handle report_page
router.get('/report_page', async (req, res) => {
    res.render('report/report_page', { title: 'Report Page' });
});

module.exports = router;