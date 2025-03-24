'use strict'
const {Connector} = require('../../config/database');

exports.User = {
    add: async (row, cb) => {
        let sql = `INSERT INTO users SET ?`;
        await Connector.promise().query(sql, row);
        cb(null);
    },
    check: async (username, email, cb) => {
        let sql = `SELECT * FROM users WHERE email = '${email}' OR username = '${username}' `;
        const [rows] = await Connector.promise().query(sql);
        cb(null, rows[0]);
    },
    verify: async (identity, cb) => {
        let sql = `SELECT * FROM users WHERE username = '${identity}' OR email = '${identity}' `;
        const [row] = await Connector.promise().query(sql);
        cb(null, row[0]);
    },
    all: async cb => {
        let sql = `SELECT * FROM users`;
        const [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    },
    put: async (col, cb) => {
        let sql = `UPDATE users SET ? WHERE id=${col['id']}`;
        await Connector.promise().query(sql, col);
        cb(null);
    },
    del: async (id, cb) => {
        let sql = `DELETE FROM users WHERE id='${id}'`;
        await Connector.promise().query(sql);
        cb(null);
    },
    getone: async (col, val, cb) => {
        let sql = `SELECT * FROM users WHERE ${col}='${val}'`;
        let [row] = await Connector.promise().query(sql);
        cb(null, row[0]);
    },
    getall: async (col, val, cb) => {
        let sql = `SELECT * FROM users WHERE ${col}='${val}'`;
        let [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    }
}