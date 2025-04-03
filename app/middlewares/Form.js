'use strict'

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

exports.Form = {
    signin: (req, res, next) => {
        if(getKeyByValue(req.body, '')) {
            req.flash('warning', 'data can not be empty');
            return res.redirect('/signin');
        }
        next();
    },
    signup: (req, res, next) => {
        if(getKeyByValue(req.body, '')) {
            req.flash('warning', 'data can not be empty');
            return res.redirect('/auth/signup');
        }
        if(req.body.password.length < 8 ) {
            req.flash('warning', 'minimum password 8 characters');
            return res.redirect('/auth/signup');
        }
        next();
    },
    forgetPass: (req, res, next) => {
        if(getKeyByValue(req.body, '')) {
            req.flash('warning', 'data can not be empty');
            return res.redirect('/forgetpass');
        }
        next();
    },
    resetPass: (req, res, next) => {
        if(getKeyByValue(req.body, '')) {
            req.flash('warning', 'data can not be empty');
            return res.redirect('/resetpass');
        }
        next();
    },
    createUser: (req, res, next) => {
        if(getKeyByValue(req.body, '')) {
            req.flash('warning', 'data can not be empty');
            return res.redirect('/user');
        }
        if(req.body.password.length < 8 ) {
            req.flash('warning', 'minimum password 8 characters');
            return res.redirect('/user');
        }
        next();
    },
    updateUser: (req, res, next) => {
        if(getKeyByValue(req.body, '')) {
            req.flash('warning', 'data can not be empty');
            return res.redirect('/user');
        }
        next();
    },
}