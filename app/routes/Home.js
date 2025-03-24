'use strict'

const express = require('express'),
	moment = require('moment'),
	router = express.Router(),
	{ ReportHeader } = require('../models/ReportHeaderModel'),
	// { ReportDetails } = require('../models/ReportDetails'),
	{ Auth } = require('../middlewares/Auth');

router.get('/', async (req, res) => {
	ReportHeader.all((err, rows) => {
		rows.forEach(row => {
			row.date = moment(row.date).format('YYYY-MM-DD'); // Format the date as YYYY-MM-DD
		});
		let context = {
			title: 'Home',
			reports: rows,
		};
		res.render('home/index', context);
	});
});

router.get('/report', async (req, res) => {
	ReportHeader.all((err, rows) => {
		rows.forEach(row => {
			row.date = moment(row.date).format('YYYY-MM-DD'); // Format the date as YYYY-MM-DD
		});
		let context = {
			title: 'Home',
			reports: rows.map(row => {
				return {
					...row,
					created_at: moment(row.created_at).format('YYYY-MM-DD hh:mm:ss')
				}
			})
		};
		res.render('home/report', context);
	});
});

// router.post('/report/create', (req, res) => {
// 	const { date, shift, supervisor, technician_name } = req.body;

// 	// Prepare report data
// 	const reportData = {
// 		date: date,
// 		shift: shift.toUpperCase(), // Ensure consistency (A, B, C)
// 		supervisor: supervisor,
// 		technician_name: technician_name,
// 		created_at: moment().format('YYYY-MM-DD HH:mm:ss') // Automatically set the creation time
// 	};

// 	// Check if a report with the same date and shift already exists (optional)
// 	ReportHeader.check(reportData.date, reportData.shift, (err, existingReport) => {
// 		if (err) {
// 			console.error(err);
// 			req.flash('warning', 'An error occurred while checking the report.');
// 			return res.redirect('/report');
// 		}

// 		if (existingReport) {
// 			req.flash('warning', 'A report for this date and shift already exists.');
// 			return res.redirect('/report');
// 		}

// 		// Add the report to the database
// 		ReportHeader.add(reportData, (err) => {
// 			if (err) {
// 				console.error(err);
// 				req.flash('warning', 'An error occurred while adding the report.');
// 				return res.redirect('/report');
// 			}

// 			req.flash('success', 'Report successfully added.');
// 			res.redirect('/report');
// 		});
// 	});
// });


// router.post('/report/update', (req, res) => {
// 	const { id, date, shift, supervisor, technician_name } = req.body;
// 	ReportHeader.getone('id', id, (err, row) => {
// 		let reportData = {
// 			id: id,
// 			date: date,
// 			shift: shift.toUpperCase(), // Ensure consistency (A, B, C)
// 			supervisor: supervisor,
// 			technician_name: technician_name,
// 		};
// 		ReportHeader.put(reportData, () => {
// 			req.flash('success', 'data report berhasil diubah');
// 			return res.redirect('/report');
// 		});
// 	})
// });

// router.get('/report/delete/:id', (req, res) => {
// 	ReportHeader.getone('id', req.params.id, (err, userRow) => {
// 		ReportHeader.del(req.params.id, () => {
// 			req.flash('success', 'data report berhasil dihapus');
// 			res.redirect('/report');
// 		});
// 	});
// });

// router.get('/report/:id', (req, res) => {
// 	ReportDetails.getall('report_header_id', req.params.id, (err, reports) => {
// 		let context = {
// 			title: 'Report Detail',
// 			reports: reports
// 		};
// 		res.render('report/report_detail', context);
// 	});
// });

router.get('/help', Auth.isUser, async (req, res) => {
	let context = {
		title: 'Bantuan',
	};
	res.render('home/help', context);
});

module.exports = router;