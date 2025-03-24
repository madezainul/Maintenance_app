'use strict'
const {Connector} = require('../../config/database');

exports.ReportHeader = {
    add: async (row, cb) => {
        let sql = `INSERT INTO report_header SET ?`;
        await Connector.promise().query(sql, row);
        cb(null);
    },
    check: async (date, shift, cb) => {
        let sql = `SELECT * FROM report_header WHERE date = '${date}' AND shift = '${shift}' `;
        const [rows] = await Connector.promise().query(sql);
        cb(null, rows[0]);
    },
    all: async cb => {
        let sql = `SELECT * FROM report_header`;
        const [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    },
    put: async (col, cb) => {
        let sql = `UPDATE report_header SET ? WHERE id=${col['id']}`;
        await Connector.promise().query(sql, col);
        cb(null);
    },
    del: async (id, cb) => {
        let sql = `DELETE FROM report_header WHERE id='${id}'`;
        await Connector.promise().query(sql);
        cb(null);
    },
    getone: async (col, val, cb) => {
        let sql = `SELECT * FROM report_header WHERE ${col}='${val}'`;
        let [row] = await Connector.promise().query(sql);
        cb(null, row[0]);
    },
    getall: async (col, val, cb) => {
        let sql = `SELECT * FROM report_header WHERE ${col}='${val}'`;
        let [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    }
}