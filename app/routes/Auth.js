'use strict'

const express = require('express'),
    crypto = require('crypto'),
    moment = require('moment'),
    { Form } = require('../middlewares/Form'),
    { User } = require('../models/UserModel'),
    { Message } = require('../utils/Message'),
    { Auth } = require('../middlewares/Auth'),
    router = express.Router(),
    encrypt = password => crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');

router.get('/signin', async (req, res) => {
    let context = {
        title: 'Login',
    };
    res.render('auth/signin', context);
});

router.post('/signin', Form.nonEmpty, (req, res) => {
    let { identity, password } = req.body;
    User.verify(identity, (err, userRow) => {
        if (!userRow) {
            req.flash('warning', 'username or email not found');
            return res.redirect('/auth/signin');
        }
        if (!userRow.verified_at) {
            req.flash('warning', 'Account is not activated, please contact the Admin to activate your account');
            return res.redirect('/auth/signin');
        }
        if (encrypt(password) != userRow.password) {
            req.flash('warning', 'wrong password');
            return res.redirect('/auth/signin');
        }
        req.session.id = userRow.id;
        res.redirect('/');
    });
});

router.get('/signup', async (req, res) => {
    let context = {
        title: 'Register',
    };
    res.render('auth/signup', context);
});

router.post('/signup', Form.signup, (req, res) => {
    let { employee_id, username, email, password } = req.body;
    User.check(username, email, employee_id, (err, userRow) => {
        if (userRow) {
            req.flash('warning', 'employee ID or username or email not found');
            return res.redirect('/auth/signup');
        }
        let userData = {
            employee_id: employee_id,
            username: username,
            email: email,
            role: 'USER',
            password: encrypt(password),
            token: crypto.randomBytes(32).toString('hex'),
            token_expires_at: moment().add(1, 'd').format('YYYY-MM-DD hh:mm:ss'),

            // remove this if the email verification feature was acivated
            verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
        };
        Message.activateAccount(email, userData.token);
        User.add(userData, () => {
            req.flash('success', 'user is successfully registered, please check your email for activate your account');
            res.redirect('/auth/signin');
        });
    });
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/auth/signin');
});

// router.get('/activate/:email/:token', (req, res) => {
//     let {email, token} = req.params;
//     User.getone('email', email, (err, userRow) => {
//         if(!userRow) {
//             req.flash('warning', 'email belum terdaftar');
//             return res.redirect('/signin');
//         }
//         if(token != userRow.token) {
//             req.flash('warning', 'token tidak sesuai');
//             return res.redirect('/signin');
//         }
//         let userData = {
//             id: userRow.id,
//             token: null,
//             verified_at: moment()
//         };
//         User.put(userData, () => {
//             req.flash('success', 'aktivasi akun berhasil');
//             res.redirect('/signin');
//         });
//     });
// });

router.get('/forgetpass', async (req, res) => {
    let context = {
        title: 'Forget Password',
    };
    res.render('auth/forgetpass', context);
});

// router.post('/forgetpass', Form.forgetPass, (req, res) => {
//     let {email} = req.body;
//     User.getone('email', email, (err, userRow) => {
//         if(!userRow) {
//             req.flash('warning', 'email belum terdaftar');
//             return res.redirect('/signin');
//         }
//         if(!userRow.verified_at) {
//             req.flash('warning', 'akun belum diaktivasi, silahkan cek email untuk aktivasi akun anda');
//             return res.redirect('/signin');
//         }
//         let userData = {
//             id: userRow.id,
//             token: crypto.randomBytes(32).toString('hex')
//         };
//         Message.forgetPassword(email, userData.token);
//         User.put(userData, () => {
//             req.flash('success', 'permintaan reset password telah terkirim, silahkan cek email untuk reset password anda');
//             res.redirect('/signin');
//         });
//     });
// });

// router.get('/resetpass/:email/:token', (req, res) => {
//     let {email, token} = req.params;
//     res.render('auth/resetpass');
// User.getone('email', email, async (err, userRow) => {
//     if(!userRow) {
//         req.flash('warning', 'email belum terdaftar');
//         return res.redirect('/signin');
//     }
//     if(token != userRow.token) {
//         req.flash('warning', 'token tidak sesuai');
//         return res.redirect('/signin');
//     }
//     let context = {
//         title: 'Reset Password',
//         id: userRow.id
//     };
//     res.render('auth/resetpass', context);
// });
// });

// router.post('/resetpass', Form.resetPass, (req, res) => {
//     let {id, password} = req.body;
//     let userData = {
//         id: id,
//         password: encrypt(password),
//         token: null
//     };
//     User.put(userData, () => {
//         req.flash('success', 'reset password berhasil');
//         res.redirect('/signin');
//     });
// });

module.exports = router;