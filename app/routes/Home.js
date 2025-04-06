'use strict'

const express = require('express'),
	router = express.Router(),
	{ Auth } = require('../middlewares/Auth');

router.get('/', Auth.isUser, (req, res) => {
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