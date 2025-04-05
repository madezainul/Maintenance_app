'use strict';
const { Transporter } = require('../../config/mail');

exports.Message = {
  activateAccount: async (email, token) => {
    try {
      const data = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Aktivasi Akun',
        html: `<p>Untuk aktivasi akun anda <a href="http://${process.env.DOMAIN}/activate/${email}/${token}">Klik Disini</a></p>`,
      };
      const info = await Transporter.sendMail(data);
      console.log('Email sent:', info);
    } catch (error) {
      console.error('Error sending activation email:', error);
    }
  },

  forgetPassword: async (email, token) => {
    try {
      const data = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Lupa Password',
        html: `<p>Untuk mengubah password akun anda <a href="http://${process.env.DOMAIN}/resetpass/${email}/${token}">Klik Disini</a></p>`,
      };
      const info = await Transporter.sendMail(data);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
    }
  },
};