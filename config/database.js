'use strict'
const mysql = require('mysql2');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// });

// connection.connect((err) => {
//     if (err) {
//         console.log('Error connecting to Db');
//         return;
//     }
//     console.log('Connection established');
// });

// module.exports = connection;

exports.Connector = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});