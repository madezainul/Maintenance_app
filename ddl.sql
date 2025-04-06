CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `employee_id` varchar(100) NOT NULL,
    `username` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password` varchar(100) NOT NULL,
    `token` varchar(255) DEFAULT NULL,
    `token_expires_at` datetime DEFAULT NULL,
    `full_name` varchar(100) DEFAULT NULL,
    `mobile` varchar(100) DEFAULT NULL,
    `department` varchar(100) DEFAULT NULL,
    `position` varchar(100) DEFAULT NULL,
    `verified_at` datetime DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `role` enum('ADMIN', 'USER', 'STAFF') DEFAULT 'USER',
    PRIMARY KEY (`id`),
    UNIQUE KEY `employee_id` (`employee_id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
)

-- Update usern details
UPDATE `users`
SET `full_name` = 'I Made Zainul Muttaqin', `mobile` = '0501546765', `department` = 'MES Department', `position` = 'MES Engineer'
WHERE `username` = 'Made Zainul';

UPDATE `users`
SET `role` = 'ADMIN'
WHERE `id` = 1;

UPDATE `users`
SET `email` = 'zainul.m@ahqpck.com'
WHERE `id` = 1;

CREATE TABLE `report_details` (
    `id` int NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `shift` varchar(2) NOT NULL,
    `equipment_name` varchar(100) NOT NULL,
    `equipment_id` varchar(100) DEFAULT NULL,
    `problem_description` text,
    `solution_part_replaced` text,
    `status` varchar(50) DEFAULT NULL,
    `start_time` time NOT NULL,
    `stop_time` time NOT NULL,
    `total_time_spent` varchar(50) NOT NULL,
    `technician_name` varchar(100) DEFAULT NULL,
    `supervisor` varchar(100) DEFAULT NULL,
    `category` varchar(100) DEFAULT NULL,
    `created_at` datetime DEFAULT NOW(),
    PRIMARY KEY (`id`)
)