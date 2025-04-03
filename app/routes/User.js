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

router.get('/', async (req, res) => {
    User.all((err, rows) => {
        let context = {
            title: 'User Management',
            users: rows.map(row => {
                return {
                    ...row, 
                    verified_at: moment(row.verified_at).format('YYYY-MM-DD hh:mm:ss'),
                    created_at: moment(row.created_at).format('YYYY-MM-DD hh:mm:ss'),
                    updated_at: moment(row.updated_at).format('YYYY-MM-DD hh:mm:ss')
                }
            })
        };
        res.render('user/index', context);
    });
});

router.post('/create', Form.createUser, (req, res) => {
    let { username, email, password, role } = req.body;
    User.check(username, email, (err, userRow) => {
        console.log(userRow);
        if (userRow) {
            req.flash('warning', 'username atau email sudah ada');
            return res.redirect('/user');
        }
        let userData = {
            username: username,
            email: email,
            role: role,
            password: encrypt(password),
            token: crypto.randomBytes(32).toString('hex'),
            token_expires_at: moment().add(1, 'd').format('YYYY-MM-DD hh:mm:ss'),

            // remove this if the email verification feature was acivated
            verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
        };
        // Message.activateAccount(email, userData.token);
        User.add(userData, () => {
            req.flash('success', 'user berhasil ditambahkan, silahkan cek email untuk aktivasi akun');
            res.redirect('/user');
        });
    });
});

router.post('/update', Form.updateUser, (req, res) => {
    let { id, username, email, role } = req.body;
    User.getone('id', id, (err, row) => {
        console.log(email != row.email || username != row.username);
        if(email != row.email) {
            User.getone('email', email, (err, userRow) => {
                if (userRow) {
                    req.flash('warning', 'email sudah ada');
                    return res.redirect('/user');
                }
            });
        }
        if(username != row.username) {
            User.getone('username', username, (err, userRow) => {
                if (userRow) {
                    req.flash('warning', 'username sudah ada');
                    return res.redirect('/user');
                }
            });
        }
        let userData = {
            id: id,
            username: username,
            email: email,
            role: role,
            token: crypto.randomBytes(32).toString('hex'),
            token_expires_at: moment().add(1, 'd').format('YYYY-MM-DD hh:mm:ss'),

            // remove this if the email verification feature was acivated
            verified_at: moment().format('YYYY-MM-DD hh:mm:ss')
        };
        // Message.activateAccount(email, userData.token);
        User.put(userData, () => {
            req.flash('success', 'data user berhasil diubah, silahkan cek email untuk aktivasi akun anda');
            return res.redirect('/user');
        });
    })
});

router.get('/delete/:id', (req, res) => {
    User.getone('id', req.params.id, (err, userRow) => {
        User.del(req.params.id, () => {
            req.flash('success', 'data super user berhasil dihapus');
            res.redirect('/user');
        });
    });
});

// router.get('/user/profile/:id', async (req, res) => {
//     let userId = req.params.id;
//     User.getone('id', userId, (err, userRow) => {
//         if (err || !userRow) {
//             req.flash('error', 'User not found');
//             return res.redirect('/user');
//         }
//         let context = {
//             title: 'User Profile',
//             user: {
//                 ...userRow,
//                 verified_at: moment(userRow.verified_at).format('YYYY-MM-DD hh:mm:ss'),
//                 created_at: moment(userRow.created_at).format('YYYY-MM-DD hh:mm:ss'),
//                 updated_at: moment(userRow.updated_at).format('YYYY-MM-DD hh:mm:ss')
//             }
//         };
//         res.render('user/profile', context);
//     });
// });

router.get('/profile', (req, res) => {
    let context = {
        title: 'User Profile'
    };
    res.render('user/profile', context);
});

module.exports = router;