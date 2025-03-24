'use strict'
const {Transporter} = require('../../config/mail');

exports.Message = {
    activateAccount: (email, token) => {
        let data = {
            from: 'Humas ICBS',
            to: email,
            subject: 'Aktivasi Akun',
            html: `<p>Untuk aktivasi akun anda <a href="http://${process.env.DOMAIN}/activate/${email}/${token}">Klik Disini</a></p>`
        };
        Transporter.sendMail(data, (err, info) => {
            console.log(info.response);
        });
    },
    forgetPassword: (email, token) => {
        let data = {
            from: 'Humas ICBS',
            to: email,
            subject: 'Lupa Password',
            html: `<p>Untuk mengubah password akun anda <a href="http://${process.env.DOMAIN}/resetpass/${email}/${token}">Klik Disini</a></p>`
        };
        Transporter.sendMail(data, (err, info) => {
            console.log(info.response);
        });
    },
}