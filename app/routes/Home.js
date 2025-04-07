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

router.post('/profile/update', async (req, res) => {
    try {
        const { id, full_name, mobile, email, department, position } = req.body;

        // Fetch the user by ID
        const row = await User.getone('id', id);
        if (!row) {
            req.flash('error', 'User not found');
            return res.redirect('/profile');
        }

        // Check if the email has changed and if the new email already exists
        if (email !== row.email) {
            const userRow = await User.getone('email', email);
            if (userRow) {
                req.flash('warning', 'Email already exists');
                return res.redirect('/profile');
            }
        }

        // Prepare the updated user data
        const userData = {
            id: id,
            full_name: full_name,
            mobile: mobile,
            email: email,
            department: department,
            position: position
        };

        // Update the user data in the database
        await User.put(userData);

        // Success message and redirect
        req.flash('success', 'User data has been successfully updated');
        return res.redirect('/profile');
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error updating profile:', error);
        req.flash('error', 'An unexpected error occurred. Please try again.');
        return res.redirect('/profile');
    }
});

module.exports = router;