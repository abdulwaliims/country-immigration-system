-- =====================================================
-- MILESTONE 4: DDL Scripts
-- Country Entry & Immigration Management System
-- Authors: Abdul Wali & Muhammad Khizer
-- =====================================================

DROP DATABASE IF EXISTS country_immigration_db;
CREATE DATABASE country_immigration_db;
USE country_immigration_db;

CREATE TABLE countries (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    population BIGINT NOT NULL CHECK (population >= 0),
    visa_policy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE travelers (
    traveler_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    passport_no VARCHAR(20) NOT NULL UNIQUE,
    nationality_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nationality_id) REFERENCES countries(country_id),
    CONSTRAINT chk_passport CHECK (passport_no REGEXP '^[A-Z0-9]{6,20}$'),
    CONSTRAINT chk_dob CHECK (date_of_birth <= CURDATE())
);

CREATE TABLE visas (
    visa_id INT PRIMARY KEY AUTO_INCREMENT,
    traveler_id INT NOT NULL,
    country_id INT NOT NULL,
    type ENUM('Tourist', 'Work', 'Student', 'Transit', 'Diplomatic') NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Expired', 'Cancelled') NOT NULL DEFAULT 'Pending',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(country_id),
    CONSTRAINT chk_visa_dates CHECK (end_date >= start_date)
);

CREATE TABLE ports (
    port_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('Airport', 'Seaport', 'Land Border') NOT NULL,
    country_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(country_id),
    CONSTRAINT unique_port_per_country UNIQUE (name, country_id)
);

CREATE TABLE border_crossings (
    crossing_id INT PRIMARY KEY AUTO_INCREMENT,
    traveler_id INT NOT NULL,
    port_id INT NOT NULL,
    direction ENUM('IN', 'OUT') NOT NULL,
    crossing_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id) ON DELETE CASCADE,
    FOREIGN KEY (port_id) REFERENCES ports(port_id),
    INDEX idx_traveler_time (traveler_id, crossing_time),
    INDEX idx_port_direction (port_id, direction, crossing_time)
);

CREATE TABLE blacklist (
    blacklist_id INT PRIMARY KEY AUTO_INCREMENT,
    traveler_id INT NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    ban_start DATE NOT NULL,
    ban_end DATE NOT NULL,
    reinstated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id) ON DELETE CASCADE,
    CONSTRAINT chk_ban_dates CHECK (ban_end >= ban_start)
);

CREATE INDEX idx_passport ON travelers(passport_no);
CREATE INDEX idx_visa_expiry ON visas(end_date, status);
CREATE INDEX idx_blacklist_active ON blacklist(ban_start, ban_end, reinstated);

SHOW TABLES;
SELECT 'All tables created successfully!' AS Status;
