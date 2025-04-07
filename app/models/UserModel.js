'use strict';
const { Connector } = require('../../config/database');

exports.User = {
    // Add a new user
    add: async (row) => {
        try {
            const sql = `INSERT INTO users SET ?`;
            await Connector.promise().query(sql, row);
        } catch (err) {
            console.error('Error in add:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Check if a user exists by username, email, or employee_id
    check: async (username, email, employee_id) => {
        try {
            const sql = `SELECT * FROM users WHERE email = ? OR username = ? OR employee_id = ?`;
            const [rows] = await Connector.promise().query(sql, [email, username, employee_id]);
            return rows[0]; // Return the first matching user
        } catch (err) {
            console.error('Error in check:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Verify a user by identity (username, email, or employee_id)
    verify: async (identity) => {
        try {
            const sql = `SELECT * FROM users WHERE username = ? OR email = ? OR employee_id = ?`;
            const [rows] = await Connector.promise().query(sql, [identity, identity, identity]);
            return rows[0]; // Return the first matching user
        } catch (err) {
            console.error('Error in verify:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get all users
    all: async () => {
        try {
            const sql = `SELECT * FROM users`;
            const [rows] = await Connector.promise().query(sql);
            return rows; // Return all users
        } catch (err) {
            console.error('Error in all:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Update a user by ID
    put: async (col) => {
        try {
            const sql = `UPDATE users SET ? WHERE id = ?`;
            await Connector.promise().query(sql, [col, col.id]);
        } catch (err) {
            console.error('Error in put:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Delete a user by ID
    del: async (id) => {
        try {
            const sql = `DELETE FROM users WHERE id = ?`;
            await Connector.promise().query(sql, [id]);
        } catch (err) {
            console.error('Error in del:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get one user by column and value
    getone: async (col, val) => {
        try {
            const sql = `SELECT * FROM users WHERE ${col} = ?`;
            const [rows] = await Connector.promise().query(sql, [val]);
            return rows[0]; // Return the first matching user
        } catch (err) {
            console.error('Error in getone:', err);
            throw err; // Propagate the error to the caller
        }
    },

    // Get all users by column and value
    getall: async (col, val) => {
        try {
            const sql = `SELECT * FROM users WHERE ${col} = ?`;
            const [rows] = await Connector.promise().query(sql, [val]);
            return rows; // Return all matching users
        } catch (err) {
            console.error('Error in getall:', err);
            throw err; // Propagate the error to the caller
        }
    }
};