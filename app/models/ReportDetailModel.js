'use strict'
const {Connector} = require('../../config/database');

exports.ReportDetail = {
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
        let sql = `UPDATE report_details SET ? WHERE id='${col['id']}'`;
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
    },
    getdate: async (year, month, cb) => {
        let sql = `SELECT * FROM report_details WHERE YEAR(date)='${year}' AND MONTH(date)='${month}'`;
        let [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    },
    getUniqueYearMonth: async (cb) => {
        let sql = `SELECT 
  EXTRACT(YEAR FROM date) AS year,
  EXTRACT(MONTH FROM date) AS month
FROM report_details
GROUP BY year, month
ORDER BY year, month;`;
        const [rows] = await Connector.promise().query(sql);
        cb(null, rows);
    }
}