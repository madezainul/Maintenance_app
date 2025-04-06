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

router.get('/profile', Auth.isUser, (req, res) => {
    let context = {
        title: 'User Profile',
        user: req.user
    };
    res.render('home/profile', context);
});

module.exports = router;