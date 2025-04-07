'use strict';

const { Connector } = require('../../config/database');

exports.ReportDetail = {
    // Add a new report detail
    add: async (row) => {
        try {
            const sql = `INSERT INTO report_details SET ?`;
            await Connector.promise().query(sql, row);
        } catch (err) {
            console.error('Error in add:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get all report details
    all: async () => {
        try {
            const sql = `SELECT * FROM report_details`;
            const [rows] = await Connector.promise().query(sql);
            return rows;
        } catch (err) {
            console.error('Error in all:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Update a report detail by ID
    put: async (col) => {
        try {
            const sql = `UPDATE report_details SET ? WHERE id = ?`;
            await Connector.promise().query(sql, [col, col['id']]);
        } catch (err) {
            console.error('Error in put:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Delete a report detail by ID
    del: async (id) => {
        try {
            const sql = `DELETE FROM report_details WHERE id = ?`;
            await Connector.promise().query(sql, [id]);
        } catch (err) {
            console.error('Error in del:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get one report detail by column and value
    getone: async (col, val) => {
        try {
            const sql = `SELECT * FROM report_details WHERE ${col} = ?`;
            const [rows] = await Connector.promise().query(sql, [val]);
            return rows[0]; // Return the first matching row
        } catch (err) {
            console.error('Error in getone:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get all report details by column and value
    getall: async (col, val) => {
        try {
            const sql = `SELECT * FROM report_details WHERE ${col} = ?`;
            const [rows] = await Connector.promise().query(sql, [val]);
            return rows; // Return all matching rows
        } catch (err) {
            console.error('Error in getall:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get report details by year and month
    getdate: async (year, month) => {
        try {
            const sql = `SELECT * FROM report_details WHERE YEAR(date) = ? AND MONTH(date) = ?`;
            const [rows] = await Connector.promise().query(sql, [year, month]);
            return rows; // Return all matching rows
        } catch (err) {
            console.error('Error in getdate:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get unique year-month combinations from report details
    getUniqueYearMonth: async () => {
        try {
            const sql = `
                SELECT 
                    EXTRACT(YEAR FROM date) AS year,
                    EXTRACT(MONTH FROM date) AS month
                FROM report_details
                GROUP BY year, month
                ORDER BY year, month;
            `;
            const [rows] = await Connector.promise().query(sql);
            return rows; // Return the unique year-month combinations
        } catch (err) {
            console.error('Error in getUniqueYearMonth:', err);
            throw err; // Propagate the error to the caller
        }
    },
    getByDateRange: async (start_date, end_date) => {
        try {
            const sql = `
                SELECT * 
                FROM report_details 
                WHERE date BETWEEN ? AND ?
                ORDER BY date ASC;
            `;
            const [rows] = await Connector.promise().query(sql, [start_date, end_date]);
            return rows; // Return all matching rows
        } catch (err) {
            console.error('Error in getByDateRange:', err);
            throw err; // Propagate the error to the caller
        }
    }
};