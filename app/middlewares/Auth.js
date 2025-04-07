'use strict';
const { User } = require('../models/UserModel');

exports.Auth = {
    // Middleware to check if the user is an admin
    isAdmin: async (req, res, next) => {
        try {
            // Check if the session ID exists
            if (!req.session.id) {
                return res.redirect('/auth/signin');
            }

            // Fetch the user by session ID
            const userRow = await User.getone('id', req.session.id);
            if (!userRow) {
                req.flash('warning', 'Account not found');
                return res.redirect('/auth/signin');
            }

            // Check if the user has the ADMIN role
            if (userRow.role !== 'ADMIN') {
                req.flash('warning', 'Permission denied');
                return res.redirect('/auth/signin');
            }

            // Attach the user data to the request object
            req.user = userRow;
            next();
        } catch (error) {
            console.error('Error in isAdmin middleware:', error);
            req.flash('error', 'An error occurred while verifying permissions');
            res.redirect('/auth/signin');
        }
    },

    // Middleware to check if the user is a regular user or admin
    isUser: async (req, res, next) => {
        try {
            // Check if the session ID exists
            if (!req.session.id) {
                return res.redirect('/auth/signin');
            }

            // Fetch the user by session ID
            const userRow = await User.getone('id', req.session.id);
            if (!userRow) {
                req.flash('warning', 'Account not found');
                return res.redirect('/auth/signin');
            }

            // Check if the user has the USER or ADMIN role
            if (userRow.role === 'USER' || userRow.role === 'ADMIN') {
                req.user = userRow;
                next();
            } else {
                req.flash('warning', 'Permission denied');
                return res.redirect('/auth/signin');
            }
        } catch (error) {
            console.error('Error in isUser middleware:', error);
            req.flash('error', 'An error occurred while verifying permissions');
            res.redirect('/auth/signin');
        }
    }
};