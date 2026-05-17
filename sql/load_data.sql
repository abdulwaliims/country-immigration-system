-- =====================================================
-- MILESTONE 5: Data Population (DML)
-- =====================================================

USE country_immigration_db;
SET GLOBAL local_infile = 1;

LOAD DATA LOCAL INFILE 'data/countries.csv'
INTO TABLE countries
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(country_id, name, population, visa_policy);

LOAD DATA LOCAL INFILE 'data/ports.csv'
INTO TABLE ports
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(port_id, name, type, country_id);

LOAD DATA LOCAL INFILE 'data/travelers.csv'
INTO TABLE travelers
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(traveler_id, name, passport_no, nationality_id, date_of_birth);

LOAD DATA LOCAL INFILE 'data/visas.csv'
INTO TABLE visas
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(visa_id, traveler_id, country_id, type, status, start_date, end_date, reason);

LOAD DATA LOCAL INFILE 'data/border_crossings.csv'
INTO TABLE border_crossings
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(crossing_id, traveler_id, port_id, direction, crossing_time);

LOAD DATA LOCAL INFILE 'data/blacklist.csv'
INTO TABLE blacklist
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(blacklist_id, traveler_id, reason, ban_start, ban_end, reinstated);

SELECT 'Data loaded successfully!' AS Status;
