/* ============================================================
   data.js — Mock Data Module
   Mirrors the SQL schema: countries, travelers, visas,
   ports, border_crossings, blacklist
   ============================================================ */

/* ---------- Countries ---------- */
export const countries = [
  { country_id: 1,  name: 'Pakistan',        population: 231000000, visa_policy: 'Visa on arrival for 48 countries' },
  { country_id: 2,  name: 'United States',   population: 331000000, visa_policy: 'Visa required for most nationalities' },
  { country_id: 3,  name: 'United Kingdom',  population: 67000000,  visa_policy: 'Standard visitor visa required' },
  { country_id: 4,  name: 'Germany',         population: 83000000,  visa_policy: 'Schengen visa regulations apply' },
  { country_id: 5,  name: 'United Arab Emirates', population: 10000000, visa_policy: 'Visa on arrival for 50+ countries' },
  { country_id: 6,  name: 'Saudi Arabia',    population: 35000000,  visa_policy: 'eVisa available for 49 nationalities' },
  { country_id: 7,  name: 'Turkey',          population: 85000000,  visa_policy: 'eVisa required for most visitors' },
  { country_id: 8,  name: 'China',           population: 1400000000,visa_policy: 'Visa required; 144-hr transit exemption' },
];

/* ---------- Travelers ---------- */
export const travelers = [
  { traveler_id: 1,  name: 'Ahmed Hassan',      passport_no: 'PK5492810', nationality_id: 1, date_of_birth: '1985-04-12' },
  { traveler_id: 2,  name: 'Sarah Mitchell',    passport_no: 'US8834021', nationality_id: 2, date_of_birth: '1990-07-23' },
  { traveler_id: 3,  name: 'Oliver Bennett',    passport_no: 'GB2290183', nationality_id: 3, date_of_birth: '1978-11-05' },
  { traveler_id: 4,  name: 'Fatima Al-Rashid',  passport_no: 'SA6612987', nationality_id: 6, date_of_birth: '1995-01-30' },
  { traveler_id: 5,  name: 'Hans Müller',       passport_no: 'DE3348820', nationality_id: 4, date_of_birth: '1983-09-18' },
  { traveler_id: 6,  name: 'Aisha Khan',        passport_no: 'PK7723001', nationality_id: 1, date_of_birth: '1992-06-14' },
  { traveler_id: 7,  name: 'James O\'Brien',    passport_no: 'US9945512', nationality_id: 2, date_of_birth: '1975-03-27' },
  { traveler_id: 8,  name: 'Mei Lin',           passport_no: 'CN1102398', nationality_id: 8, date_of_birth: '1998-12-09' },
  { traveler_id: 9,  name: 'Yusuf Ibrahim',     passport_no: 'AE5590021', nationality_id: 5, date_of_birth: '1988-08-22' },
  { traveler_id: 10, name: 'Elena Petrova',     passport_no: 'TR8812640', nationality_id: 7, date_of_birth: '2001-02-16' },
];

// // Create a new empty array that we will fill from the database
// export let travelers = [];

// // Create a function to fetch the real data
// export async function fetchTravelersFromDB() {
//     try {
//         const response = await fetch('http://127.0.0.1:3000/api/travelers');
//         travelers = await response.json();
//         console.log("Travelers loaded from SQL:", travelers);
//     } catch (error) {
//         console.error("Failed to fetch travelers:", error);
//     }
// }

/* ---------- Visas ---------- */
export const visas = [
  { visa_id: 1,  traveler_id: 1,  country_id: 2, type: 'Tourist',    status: 'Approved',  start_date: '2024-12-01', end_date: '2025-03-01', reason: 'Tourism and sightseeing' },
  { visa_id: 2,  traveler_id: 2,  country_id: 1, type: 'Work',       status: 'Approved',  start_date: '2024-11-15', end_date: '2025-11-15', reason: 'Employment at tech firm' },
  { visa_id: 3,  traveler_id: 3,  country_id: 4, type: 'Student',    status: 'Pending',   start_date: '2025-09-01', end_date: '2026-06-30', reason: 'Masters programme enrollment' },
  { visa_id: 4,  traveler_id: 4,  country_id: 3, type: 'Diplomatic', status: 'Approved',  start_date: '2024-10-01', end_date: '2025-09-30', reason: 'Diplomatic mission' },
  { visa_id: 5,  traveler_id: 5,  country_id: 5, type: 'Work',       status: 'Rejected',  start_date: '2025-01-01', end_date: '2025-12-31', reason: 'Business consulting' },
  { visa_id: 6,  traveler_id: 6,  country_id: 2, type: 'Tourist',    status: 'Pending',   start_date: '2025-06-01', end_date: '2025-08-31', reason: 'Family visit' },
  { visa_id: 7,  traveler_id: 7,  country_id: 1, type: 'Transit',    status: 'Approved',  start_date: '2025-02-10', end_date: '2025-02-12', reason: 'Connecting flight to India' },
  { visa_id: 8,  traveler_id: 8,  country_id: 6, type: 'Work',       status: 'Approved',  start_date: '2025-03-01', end_date: '2026-02-28', reason: 'IT sector employment' },
  { visa_id: 9,  traveler_id: 9,  country_id: 1, type: 'Tourist',    status: 'Expired',   start_date: '2024-01-01', end_date: '2024-06-30', reason: 'Tourism' },
  { visa_id: 10, traveler_id: 10, country_id: 2, type: 'Student',    status: 'Approved',  start_date: '2025-08-20', end_date: '2027-05-15', reason: 'Undergraduate degree' },
];

/* ---------- Ports ---------- */
export const ports = [
  { port_id: 1, name: 'Allama Iqbal International Airport', type: 'Airport',      country_id: 1 },
  { port_id: 2, name: 'Karachi Seaport',                    type: 'Seaport',      country_id: 1 },
  { port_id: 3, name: 'Wagah Border Crossing',              type: 'Land Border',  country_id: 1 },
  { port_id: 4, name: 'JFK International Airport',          type: 'Airport',      country_id: 2 },
  { port_id: 5, name: 'Heathrow Airport',                   type: 'Airport',      country_id: 3 },
  { port_id: 6, name: 'Frankfurt Airport',                  type: 'Airport',      country_id: 4 },
  { port_id: 7, name: 'Dubai International Airport',        type: 'Airport',      country_id: 5 },
];

/* ---------- Border Crossings ---------- */
export const border_crossings = [
  { crossing_id: 1,  traveler_id: 1,  port_id: 1, direction: 'OUT', crossing_time: '2024-12-01T08:35:00' },
  { crossing_id: 2,  traveler_id: 2,  port_id: 4, direction: 'IN',  crossing_time: '2024-11-15T14:20:00' },
  { crossing_id: 3,  traveler_id: 3,  port_id: 6, direction: 'IN',  crossing_time: '2025-01-05T11:00:00' },
  { crossing_id: 4,  traveler_id: 4,  port_id: 5, direction: 'IN',  crossing_time: '2024-10-01T09:15:00' },
  { crossing_id: 5,  traveler_id: 7,  port_id: 1, direction: 'IN',  crossing_time: '2025-02-10T22:45:00' },
  { crossing_id: 6,  traveler_id: 7,  port_id: 1, direction: 'OUT', crossing_time: '2025-02-12T06:10:00' },
  { crossing_id: 7,  traveler_id: 8,  port_id: 7, direction: 'OUT', crossing_time: '2025-03-01T16:30:00' },
  { crossing_id: 8,  traveler_id: 9,  port_id: 1, direction: 'IN',  crossing_time: '2024-01-10T10:00:00' },
  { crossing_id: 9,  traveler_id: 10, port_id: 4, direction: 'OUT', crossing_time: '2025-08-20T07:55:00' },
  { crossing_id: 10, traveler_id: 6,  port_id: 3, direction: 'OUT', crossing_time: '2025-01-28T13:00:00' },
];

/* ---------- Blacklist ---------- */
export const blacklist = [
  { blacklist_id: 1, traveler_id: 5, reason: 'Fraudulent visa documents submitted', ban_start: '2024-06-01', ban_end: '2026-06-01', reinstated: false },
  { blacklist_id: 2, traveler_id: 9, reason: 'Overstay of visa — exceeded 90 days', ban_start: '2024-07-15', ban_end: '2025-07-15', reinstated: false },
];

/* ============================================================
   Helper Lookups
   ============================================================ */

/** Returns country name from ID */
export function getCountryName(id) {
  return countries.find(c => c.country_id === id)?.name ?? '—';
}

/** Returns traveler object from ID */
export function getTraveler(id) {
  return travelers.find(t => t.traveler_id === id) ?? null;
}

/** Returns port name from ID */
export function getPortName(id) {
  return ports.find(p => p.port_id === id)?.name ?? '—';
}

/** Returns true if a traveler is currently blacklisted */
export function isBlacklisted(traveler_id) {
  const today = new Date().toISOString().slice(0, 10);
  return blacklist.some(b =>
    b.traveler_id === traveler_id &&
    !b.reinstated &&
    b.ban_start <= today &&
    b.ban_end >= today
  );
}

/** Aggregated stats for dashboard */
export function getDashboardStats() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    totalTravelers:  travelers.length,
    totalVisas:      visas.length,
    pendingVisas:    visas.filter(v => v.status === 'Pending').length,
    approvedVisas:   visas.filter(v => v.status === 'Approved').length,
    rejectedVisas:   visas.filter(v => v.status === 'Rejected').length,
    expiredVisas:    visas.filter(v => v.status === 'Expired').length,
    totalCountries:  countries.length,
    totalPorts:      ports.length,
    totalCrossings:  border_crossings.length,
    blacklisted:     blacklist.filter(b => !b.reinstated).length,
    crossingsToday:  border_crossings.filter(b => b.crossing_time.startsWith(today)).length,
  };
}

/** Visa type breakdown for chart */
export function getVisaTypeBreakdown() {
  const types = ['Tourist', 'Work', 'Student', 'Transit', 'Diplomatic'];
  return types.map(type => ({
    type,
    count: visas.filter(v => v.type === type).length,
  }));
}
