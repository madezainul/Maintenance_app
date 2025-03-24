const connection = require('./config/database');

const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const createReportHeaderTable = `CREATE TABLE IF NOT EXISTS report_headers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    report_date DATE NOT NULL,
    report_description VARCHAR(50) NOT NULL,
    supervisor_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const createReportDetailTable = `CREATE TABLE IF NOT EXISTS report_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_header_id INT NOT NULL,
    date DATE NOT NULL,
    equipment_name VARCHAR(100) NOT NULL,
    equipment_id VARCHAR(100) NOT NULL,
    equipment_model VARCHAR(100) NOT NULL,
    problem_description TEXT NOT NULL,
    solution_part_replaced TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    stop_time TIME NOT NULL,
    total_time_spent INT NOT NULL,
    technician_name VARCHAR(100) NOT NULL,
    supervisor_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_header_id) REFERENCES report_headers(id)
)`;

connection.query(createUsersTable, (err, results, fields) => {
    if (err) {
        console.error('Error creating users table', err);
        return;
    }
    console.log('Created users table successfully');
});

connection.query(createReportHeaderTable, (err, results, fields) => {
    if (err) {
        console.error('Error creating report_headers table', err);
        return;
    }
    console.log('Created report_headers table successfully');
});

connection.query(createReportDetailTable, (err, results, fields) => {
    if (err) {
        console.error('Error creating report_details table', err);
        return;
    }
    console.log('Created report_details table successfully');
});

connection.end();