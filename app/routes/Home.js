'use strict'

const express = require('express'),
	moment = require('moment'),
	router = express.Router(),
	// { ReportHeader } = require('../models/ReportHeaderModel'),
	{ ReportDetail } = require('../models/ReportDetailModel'),
	{ Auth } = require('../middlewares/Auth');

// router.get('/', async (req, res) => {
// 	ReportDetail.all((err, rows) => {
// 		let context = {
// 			title: 'Report Details',
// 			reports: rows.map(row => {
// 				return {
// 					...row, 
// 					date: moment(row.date).format('YYYY MMMM'),
// 					year: moment(row.date).format('YYYY'),
// 					month: moment(row.date).format('MMMM')
// 				}
// 			})
// 		};
// 		res.render('home/index', context);
// 	});
// });
router.get('/', async (req, res) => {
		let context = {
			title: 'Home',
		};
		res.render('home/index', context);
	});


router.get('/help', Auth.isUser, async (req, res) => {
	let context = {
		title: 'Help',
	};
	res.render('home/help', context);
});

module.exports = router;