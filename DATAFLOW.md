# DATAFLOW DESCRIPTION - Country Entry & Immigration System

## Overview
This document describes how data flows through the Country Entry & Immigration Management System, from input sources to database storage to output reports.

## Data Sources (Input)

### Source 1: Traveler Registration
- **Who inputs:** Border officer or traveler
- **What data:** Name, passport number, date of birth, nationality
- **Where it goes:** travelers table

### Source 2: Visa Application
- **Who inputs:** Traveler or immigration officer
- **What data:** Visa type (Tourist/Work/Student), destination country, start date, end date
- **Where it goes:** visas table

### Source 3: Border Crossing Scan
- **Who inputs:** Border officer scanning passport
- **What data:** Traveler ID, port ID, direction (IN/OUT), timestamp
- **Where it goes:** border_crossings table

### Source 4: Blacklist Management
- **Who inputs:** Immigration administrator
- **What data:** Traveler ID, ban reason, ban start date, ban end date
- **Where it goes:** blacklist table

### Source 5: Country & Port Administration
- **Who inputs:** System administrator
- **What data:** Country name, population, visa policy; Port name, type
- **Where it goes:** countries table, ports table

## Data Flow Diagram

INPUT                                    PROCESSING                                    OUTPUT

Traveler Registration ─────┐
                           │
Visa Application ──────────┼───  Validation ───  Database ───  Query Results
                           │      (Check FK,        (MySQL)          │
Border Crossing ───────────┤       dates,                             │
                           │       duplicates)                        
Blacklist Entry ───────────┘                                    Reports/Analytics
                                                                     │
Country/Port Admin ─────────────────────────────────────────────────│
                                                                     
                                                              Export CSV/PDF

## Data Storage (Database Tables)

### Table Relationships and Dependencies

+---------------+
|   countries   |
+-------^-------+
        |
        | (1:N)
+-------v-------+
|   travelers   |
+-------^-------+
        |
        | (1:N)
+-------+-------+---------------+
|               |               |
+-------v-------+-------v-------+-------v-------+
|     visas     | border_crossings |   blacklist   |
+---------------+-----------------+---------------+
                        |
                        | (N:1)
                +-------v-------+
                |     ports     |
                +---------------+

**Dependency Order (for data loading):**
1. countries (no foreign keys)
2. ports (depends on countries)
3. travelers (depends on countries via nationality_id)
4. visas (depends on travelers and countries)
5. border_crossings (depends on travelers and ports)
6. blacklist (depends on travelers)

## Data Outputs

### Output 1: Real-time Queries
- **What:** Search traveler by name/passport
- **How:** SELECT query on travelers table
- **User:** Border officer

### Output 2: Visa Status Check
- **What:** Check if traveler has valid visa
- **How:** JOIN visas + travelers + countries
- **User:** Immigration officer

### Output 3: Entry/Exit History
- **What:** Complete travel history of a traveler
- **How:** JOIN border_crossings + travelers + ports
- **User:** Immigration officer

### Output 4: Overstay Report
- **What:** Travelers who stayed beyond visa expiry
- **How:** Compare visas.end_date with last border_crossings OUT record
- **User:** Administrator

### Output 5: Daily Entry Statistics
- **What:** Number of entries per port per day
- **How:** GROUP BY on border_crossings with direction='IN'

### Output 6: Blacklist Alerts
- **What:** Automatic flag when blacklisted traveler attempts entry
- **How:** Check blacklist table before approving entry
- **User:** Border officer (alert on screen)

## Data Volume Summary

| Table | Estimated Rows | Data Source |
|-------|---------------|-------------|
| countries | 50 | Manual entry |
| travelers | 10,000 | Synthetic (Faker) |
| visas | 15,000 | Synthetic |
| ports | 200 | Manual + Mockaroo |
| border_crossings | 50,000 | Synthetic |
| blacklist | 500 | Synthetic |
