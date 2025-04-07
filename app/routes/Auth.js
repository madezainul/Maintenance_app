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

// Signin Page
router.get('/signin', async (req, res) => {
    let context = {
        title: 'Login',
    };
    res.render('auth/signin', context);
});

// Signin POST
router.post('/signin', Form.signin, async (req, res) => {
    try {
        const { identity, password } = req.body;

        // Verify user by identity (username or email)
        const userRow = await User.verify(identity);
        if (!userRow) {
            req.flash('warning', 'Username or email not found');
            return res.redirect('/auth/signin');
        }

        // Check if account is activated
        if (!userRow.activated) {
            req.flash('warning', 'Account is not activated, please contact the Admin to activate your account');
            return res.redirect('/auth/signin');
        }

        // Check password
        if (encrypt(password) !== userRow.password) {
            req.flash('warning', 'Wrong password');
            return res.redirect('/auth/signin');
        }

        // Set session and redirect
        req.session.id = userRow.id;
        res.redirect('/');
    } catch (error) {
        console.error('Error during signin:', error);
        req.flash('error', 'An error occurred during login');
        res.redirect('/auth/signin');
    }
});

// Signup Page
router.get('/signup', async (req, res) => {
    let context = {
        title: 'Register',
    };
    res.render('auth/signup', context);
});

// Signup POST
router.post('/signup', Form.signup, async (req, res) => {
    try {
        const { employee_id, username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.check(username, email, employee_id);
        if (existingUser) {
            req.flash('warning', 'Employee ID, username, or email already exists');
            return res.redirect('/auth/signup');
        }

        // Prepare user data
        const userData = {
            employee_id: employee_id,
            username: username,
            email: email,
            role: 'USER',
            password: encrypt(password),
            token: crypto.randomBytes(32).toString('hex'),
            token_expires_at: moment().add(1, 'd').format('YYYY-MM-DD hh:mm:ss'),

            // Remove this if email verification feature is activated
            verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
        };

        // Send activation email and add user to the database
        Message.activateAccount(email, userData.token);
        await User.add(userData);

        req.flash('success', 'User is successfully registered, please check your email to activate your account');
        res.redirect('/auth/signin');
    } catch (error) {
        console.error('Error during signup:', error);
        req.flash('error', 'An error occurred during registration');
        res.redirect('/auth/signup');
    }
});

// Signout
router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/auth/signin');
});

// Activate Account
router.get('/activate/:email/:token', async (req, res) => {
    try {
        const { email, token } = req.params;

        // Fetch user by email
        const userRow = await User.getone('email', email);
        if (!userRow) {
            req.flash('warning', 'Email is not registered');
            return res.redirect('/auth/signin');
        }

        // Validate token
        if (token !== userRow.token) {
            req.flash('warning', 'Invalid token');
            return res.redirect('/auth/signin');
        }

        // Update user data to activate account
        const userData = {
            id: userRow.id,
            token: null,
            verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
        };
        await User.put(userData);

        req.flash('success', 'Account activation successful');
        res.redirect('/auth/signin');
    } catch (error) {
        console.error('Error during account activation:', error);
        req.flash('error', 'An error occurred during account activation');
        res.redirect('/auth/signin');
    }
});

// Forget Password Page
router.get('/forgetpass', async (req, res) => {
    let context = {
        title: 'Forget Password',
    };
    res.render('auth/forgetpass', context);
});

// Forget Password POST
router.post('/forgetpass', Form.forgetPass, async (req, res) => {
    try {
        const { email } = req.body;

        // Fetch user by email
        const userRow = await User.getone('email', email);
        if (!userRow) {
            req.flash('warning', 'Email is not registered');
            return res.redirect('/auth/signin');
        }

        // Check if account is activated
        if (!userRow.verified_at) {
            req.flash('warning', 'Account is not activated, please check your email to activate your account');
            return res.redirect('/auth/signin');
        }

        // Generate a new token for password reset
        const userData = {
            id: userRow.id,
            token: crypto.randomBytes(32).toString('hex')
        };
        Message.forgetPassword(email, userData.token);
        await User.put(userData);

        req.flash('success', 'Password reset request sent, please check your email to reset your password');
        res.redirect('/auth/signin');
    } catch (error) {
        console.error('Error during forget password:', error);
        req.flash('error', 'An error occurred during password reset request');
        res.redirect('/auth/signin');
    }
});

// Reset Password Page
router.get('/resetpass/:email/:token', async (req, res) => {
    try {
        const { email, token } = req.params;

        // Fetch user by email
        const userRow = await User.getone('email', email);
        if (!userRow) {
            req.flash('warning', 'Email is not registered');
            return res.redirect('/auth/signin');
        }

        // Validate token
        if (token !== userRow.token) {
            req.flash('warning', 'Invalid token');
            return res.redirect('/auth/signin');
        }

        // Render reset password page
        const context = {
            title: 'Reset Password',
            id: userRow.id
        };
        res.render('auth/resetpass', context);
    } catch (error) {
        console.error('Error during reset password page:', error);
        req.flash('error', 'An error occurred while loading the reset password page');
        res.redirect('/auth/signin');
    }
});

// Reset Password POST
router.post('/resetpass', Form.resetPass, async (req, res) => {
    try {
        const { id, password } = req.body;

        // Update user data to reset password
        const userData = {
            id: id,
            password: encrypt(password),
            token: null
        };
        await User.put(userData);

        req.flash('success', 'Password reset successful');
        res.redirect('/auth/signin');
    } catch (error) {
        console.error('Error during password reset:', error);
        req.flash('error', 'An error occurred during password reset');
        res.redirect('/auth/signin');
    }
});

module.exports = router;