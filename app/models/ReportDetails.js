'use strict'
const {Connector} = require('../../config/database');

exports.ReportDetails = {
    add: async (row, cb) => {
        let sql = `INSERT INTO report_details SET ?`;
        await Connector.promise().query(sql, row);
        cb(null);
    },
    all: async cb => {
        let sql = `SELECT * FROM report_details`;
        const [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    },
    put: async (col, cb) => {
        let sql = `UPDATE report_details SET ? WHERE id=${col['id']}`;
        await Connector.promise().query(sql, col);
        cb(null);
    },
    del: async (id, cb) => {
        let sql = `DELETE FROM report_details WHERE id='${id}'`;
        await Connector.promise().query(sql);
        cb(null);
    },
    getone: async (col, val, cb) => {
        let sql = `SELECT * FROM report_details WHERE ${col}='${val}'`;
        let [row] = await Connector.promise().query(sql);
        cb(null, row[0]);
    },
    getall: async (col, val, cb) => {
        let sql = `SELECT * FROM report_details WHERE ${col}='${val}'`;
        let [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    }
}