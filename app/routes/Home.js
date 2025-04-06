'use strict'

const express = require('express'),
	router = express.Router(),
	{ Auth } = require('../middlewares/Auth'),
	{ User } = require('../models/UserModel');

router.get('/', Auth.isUser, (req, res) => {
		let context = {
			title: 'Home',
			page: 'Dashboard',
			user: req.user
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
		page: 'Profile',
        user: req.user
    };
    res.render('home/profile', context);
});

router.post('/profile/update', (req, res) => {
	let { id, full_name, mobile, email, department, position } = req.body;
	User.getone('id', id, (err, row) => {
		if(email != row.email) {
			User.getone('email', email, (err, userRow) => {
				if (userRow) {
					req.flash('warning', 'email already exists');
					return res.redirect('/profile');
				}
			});
		}
		let userData = {
			id: id,
			full_name: full_name,
			mobile: mobile,
			email: email,
			department: department,
			position: position
		};
		// Message.activateAccount(email, userData.token);
		User.put(userData, () => {
			req.flash('success', 'user data has successfully updated');
			return res.redirect('/profile');
		});
	})
});

module.exports = router;