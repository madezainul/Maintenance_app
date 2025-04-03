'use strict'
const {User} = require('../models/UserModel');

exports.Auth = {
    isAdmin: (req, res, next) => {
        if(!req.session.id) {
            return res.redirect('/auth/signin');
        }
        User.getone('id', req.session.id, (err, userRow) => {
            if(!userRow) {
                req.flash('warning' ,'Account not found');
                return res.redirect('/auth/signin');
            }
            if(userRow.role != 'ADMIN') {
                req.flash('warning', 'Permission denied');
                return res.redirect('/auth/signin');
            }
            req.user = userRow;
            next();
        });
    },
    isUser: (req, res, next) => {
        if(!req.session.id) {
            return res.redirect('/auth/signin');
        }
        User.getone('id', req.session.id, (err, userRow) => {
            if(!userRow) {
                req.flash('warning' ,'Account not found');
                return res.redirect('/auth/signin');
            }
            if(userRow.role != 'USER') {
                req.flash('warning', 'Permission denied');
                return res.redirect('/auth/signin');
            }
            req.user = userRow;
            next();
        });
    }
}