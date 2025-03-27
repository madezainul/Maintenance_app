const connection = require('./config/database');

const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const createReportDetailTable = `CREATE TABLE IF NOT EXISTS report_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    shift VARCHAR(2),
    equipment_name VARCHAR(100),
    equipment_id VARCHAR(100),
    problem_description TEXT,
    solution_part_replaced TEXT,
    status VARCHAR(10),
    start_time TIME,
    stop_time TIME,
    total_time_spent INT,
    technician_name VARCHAR(100),
    supervisor_name VARCHAR(100),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createUsersTable, (err, results, fields) => {
    if (err) {
        console.error('Error creating users table', err);
        return;
    }
    console.log('Created users table successfully');
});

connection.query(createReportDetailTable, (err, results, fields) => {
    if (err) {
        console.error('Error creating report_details table', err);
        return;
    }
    console.log('Created report_details table successfully');
});

connection.end();