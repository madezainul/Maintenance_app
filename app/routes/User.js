'use strict';

const express = require('express'),
    crypto = require('crypto'),
    moment = require('moment'),
    { Form } = require('../middlewares/Form'),
    { User } = require('../models/UserModel'),
    { Message } = require('../utils/Message'),
    { Auth } = require('../middlewares/Auth'),
    router = express.Router(),
    encrypt = password => crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');

// Get all users
router.get('/', Auth.isAdmin, async (req, res) => {
    try {
        const rows = await User.all();
        let context = {
            title: 'User Management',
            page: 'Users',
            user: req.user,
            users: rows.map(row => ({
                ...row,
                verified_at: moment(row.verified_at).format('YYYY-MM-DD hh:mm:ss'),
                created_at: moment(row.created_at).format('YYYY-MM-DD hh:mm:ss'),
                updated_at: moment(row.updated_at).format('YYYY-MM-DD hh:mm:ss')
            }))
        };
        res.render('user/index', context);
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'Failed to fetch users');
        res.redirect('/user');
    }
});

// Create a new user
router.post('/create', Form.createUser, Auth.isAdmin, async (req, res) => {
    try {
        let { employee_id, username, email, password, role } = req.body;

        // Check if username or email already exists
        const existingUser = await User.check(username, email, employee_id);
        if (existingUser) {
            req.flash('warning', 'Username or email or employee id already exists');
            return res.redirect('/user');
        }

        // Prepare user data
        const userData = {
            employee_id: employee_id,
            username: username,
            email: email,
            role: role,
            password: encrypt(password),
            token: crypto.randomBytes(32).toString('hex'),
            token_expires_at: moment().add(1, 'd').format('YYYY-MM-DD hh:mm:ss'),

            // Remove this if email verification is activated
            verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
        };

        // Add the user to the database
        await User.add(userData);
        req.flash('success', 'User has successfully been created');
        res.redirect('/user');
    } catch (error) {
        console.error('Error creating user:', error);
        req.flash('error', 'Failed to create user');
        res.redirect('/user');
    }
});

// Update an existing user
router.post('/update', Form.updateUser, Auth.isAdmin, async (req, res) => {
    try {
        let { id, employee_id, username, email, role, activated } = req.body;

        // Fetch the user by ID
        const existingUser = await User.getone('id', id);
        if (!existingUser) {
            req.flash('error', 'User not found');
            return res.redirect('/user');
        }

        // Check if email or username already exists for another user
        if (employee_id !== existingUser.employee_id) {
            const employeeIdExists = await User.getone('employee_id', employee_id);
            if (employeeIdExists) {
                req.flash('warning', 'employee id already exists');
                return res.redirect('/user');
            }
        }
        if (email !== existingUser.email) {
            const emailExists = await User.getone('email', email);
            if (emailExists) {
                req.flash('warning', 'Email already exists');
                return res.redirect('/user');
            }
        }
        if (username !== existingUser.username) {
            const usernameExists = await User.getone('username', username);
            if (usernameExists) {
                req.flash('warning', 'Username already exists');
                return res.redirect('/user');
            }
        }

        // Prepare updated user data
        const userData = {
            id: id,
            employee_id: employee_id,
            username: username,
            email: email,
            role: role,
            activated: activated,
            token: crypto.randomBytes(32).toString('hex'),
            token_expires_at: moment().add(1, 'd').format('YYYY-MM-DD hh:mm:ss'),

            // Remove this if email verification is activated
            verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
        };

        // Update the user in the database
        await User.put(userData);
        req.flash('success', 'User data has successfully been updated');
        res.redirect('/user');
    } catch (error) {
        console.error('Error updating user:', error);
        req.flash('error', 'Failed to update user');
        res.redirect('/user');
    }
});

// Delete a user
router.get('/delete/:id', Auth.isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the user by ID
        const userRow = await User.getone('id', userId);
        if (!userRow) {
            req.flash('error', 'User not found');
            return res.redirect('/user');
        }

        // Delete the user from the database
        await User.del(userId);
        req.flash('success', 'User has successfully been deleted');
        res.redirect('/user');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash('error', 'Failed to delete user');
        res.redirect('/user');
    }
});

module.exports = router;