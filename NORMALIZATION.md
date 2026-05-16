# NORMALIZATION DOCUMENT - Country Entry & Immigration System

## Table 1: countries

### 1NF (First Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** All columns contain atomic values. country_id is integer, name is single string, population is single number, visa_policy_rules is text block. No repeating groups or arrays.

### 2NF (Second Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** Primary key is single column (country_id). There is no composite key, so partial dependency cannot exist.

### 3NF (Third Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** All non-key columns (name, population, visa_policy_rules) directly describe the country. No transitive dependencies exist.

## Table 2: travelers

### 1NF (First Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** name, passport_no, date_of_birth are all atomic values. Each traveler has one row with single values per column.

### 2NF (Second Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** Primary key is single column (traveler_id). No composite key exists.

### 3NF (Third Normal Form)
**Issue:** NATIONALITY column causes transitive dependency. Nationality (text) depends on traveler_id, but it also duplicates country names that should be in countries table.
**Change Made:** Removed 'nationality' text column. Added 'nationality_id' as foreign key referencing countries(country_id).
**Justification:** Now nationality is stored once in countries table. Travelers references it via foreign key. This eliminates data duplication and ensures referential integrity.

## Table 3: visas

### 1NF (First Normal Form)
**Issue:** REASON column could potentially contain multiple reasons.
**Change Made:** Ensure each reason is single atomic value per row.
**Justification:** If multiple rejection reasons exist, multiple visa rows will be created or separate reasons table will be used.

### 2NF (Second Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** Primary key is single column (visa_id). No partial dependencies.

### 3NF (Third Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** type, status, start_date, end_date all depend directly on visa_id. No column depends on another non-key column.

## Table 4: ports

### 1NF (First Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** name, type, country_id are all atomic values.

### 2NF (Second Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** Single-column primary key (port_id).

### 3NF (Third Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** name, type, country_id all directly describe the port. No transitive dependencies.

## Table 5: border_crossings

### 1NF (First Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** direction is single value (IN or OUT), timestamp is single value.

### 2NF (Second Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** Single-column primary key (crossing_id).

### 3NF (Third Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** traveler_id, port_id, direction, timestamp all depend directly on crossing_id.

## Table 6: blacklist

### 1NF (First Normal Form)
**Issue:** REASON column could contain multiple reasons.
**Change Made:** Ensure each reason is single atomic value per ban record.
**Justification:** If multiple ban reasons exist, multiple blacklist entries will be created.

### 2NF (Second Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** Single-column primary key (blacklist_id).

### 3NF (Third Normal Form)
**Issue:** No issues found.
**Change Made:** No change needed.
**Justification:** reason, ban_start, ban_end, reinstated all depend directly on blacklist_id.

## DUPLICATES REMOVED

| Table | Redundant Column | Action Taken |
|-------|-----------------|---------------|
| travelers | nationality (text) | Removed. Replaced with nationality_id foreign key |
| border_crossings | traveler_name | Removed. Access traveler name via JOIN to travelers table |
| blacklist | traveler_passport | Removed. Access passport via JOIN to travelers table |
| ports | country_name | Removed. Use country_id foreign key instead |

## SUMMARY OF CHANGES

**Changes Made:**
1. travelers table: nationality column removed, nationality_id FK added
2. All tables now satisfy 1NF, 2NF, and 3NF
3. All duplicate columns removed
4. Foreign key relationships properly defined

**Final Schema (3NF):**
- countries(country_id, name, population, visa_policy_rules)
- travelers(traveler_id, name, passport_no, nationality_id, date_of_birth)
- visas(visa_id, traveler_id, country_id, type, status, start_date, end_date, reason)
- ports(port_id, name, type, country_id)
- border_crossings(crossing_id, traveler_id, port_id, direction, timestamp)
- blacklist(blacklist_id, traveler_id, reason, ban_start, ban_end, reinstated)
