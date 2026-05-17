-- =====================================================
-- MILESTONE 5: Validation Queries
-- =====================================================

USE country_immigration_db;

-- VALIDATION 1: Row Count
SELECT '========== ROW COUNT VALIDATION ==========' AS '';
SELECT 'countries' AS table_name, COUNT(*) AS row_count FROM countries
UNION ALL SELECT 'travelers', COUNT(*) FROM travelers
UNION ALL SELECT 'visas', COUNT(*) FROM visas
UNION ALL SELECT 'ports', COUNT(*) FROM ports
UNION ALL SELECT 'border_crossings', COUNT(*) FROM border_crossings
UNION ALL SELECT 'blacklist', COUNT(*) FROM blacklist;

-- VALIDATION 2: NULL Check
SELECT '========== NULL CHECK ==========' AS '';
SELECT 'travelers.passport_no' AS column_checked,
SUM(CASE WHEN passport_no IS NULL THEN 1 ELSE 0 END) AS null_count FROM travelers
UNION ALL
SELECT 'visas.traveler_id', SUM(CASE WHEN traveler_id IS NULL THEN 1 ELSE 0 END) FROM visas
UNION ALL
SELECT 'border_crossings.direction', SUM(CASE WHEN direction IS NULL THEN 1 ELSE 0 END) FROM border_crossings;

-- VALIDATION 3: Foreign Key Integrity
SELECT '========== FOREIGN KEY INTEGRITY ==========' AS '';
SELECT 'visas.traveler_id (orphans)' AS check_name, COUNT(*) AS orphan_count
FROM visas v LEFT JOIN travelers t ON v.traveler_id = t.traveler_id WHERE t.traveler_id IS NULL
UNION ALL
SELECT 'visas.country_id (orphans)', COUNT(*)
FROM visas v LEFT JOIN countries c ON v.country_id = c.country_id WHERE c.country_id IS NULL;

-- VALIDATION 4: UPDATE Demonstration
SELECT '========== UPDATE DEMONSTRATION ==========' AS '';
UPDATE visas SET status = 'Expired' WHERE visa_id = 1 AND end_date < CURDATE();
SELECT * FROM visas WHERE visa_id = 1;

-- VALIDATION 5: DELETE Demonstration
SELECT '========== DELETE DEMONSTRATION ==========' AS '';
DELETE FROM border_crossings WHERE traveler_id = 99999;
SELECT 'DELETE completed (no data affected)' AS Status;

SELECT 'ALL VALIDATIONS COMPLETE!' AS Status;
