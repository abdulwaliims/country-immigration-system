
CREATE DATABASE immigration_system;
USE immigration_system;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE countries (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(100) NOT NULL,
    population BIGINT,
    visa_policy VARCHAR(100)
);

CREATE TABLE travelers (
    traveler_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    passport_no VARCHAR(50) UNIQUE NOT NULL,
    gender VARCHAR(10),
    dob DATE,
    nationality_id INT,
    FOREIGN KEY (nationality_id) REFERENCES countries(country_id)
);

CREATE TABLE ports (
    port_id INT PRIMARY KEY AUTO_INCREMENT,
    country_id INT,
    port_name VARCHAR(100) NOT NULL,
    port_type VARCHAR(50),
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

CREATE TABLE visas (
    visa_id INT PRIMARY KEY AUTO_INCREMENT,
    traveler_id INT,
    country_id INT,
    visa_type VARCHAR(50),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(50),
    processed_by INT,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id),
    FOREIGN KEY (country_id) REFERENCES countries(country_id),
    FOREIGN KEY (processed_by) REFERENCES users(user_id)
);

CREATE TABLE border_crossings (
    crossing_id INT PRIMARY KEY AUTO_INCREMENT,
    traveler_id INT,
    port_id INT,
    visa_id INT,
    entry_exit_type VARCHAR(10),
    crossing_time DATETIME,
    recorded_by INT,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id),
    FOREIGN KEY (port_id) REFERENCES ports(port_id),
    FOREIGN KEY (visa_id) REFERENCES visas(visa_id),
    FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

CREATE TABLE blacklist (
    blacklist_id INT PRIMARY KEY AUTO_INCREMENT,
    traveler_id INT,
    reason VARCHAR(255),
    ban_start DATE,
    ban_end DATE,
    status VARCHAR(50),
    added_by INT,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id),
    FOREIGN KEY (added_by) REFERENCES users(user_id)
);