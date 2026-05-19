/* ============================================================
   pages.js — Page Renderer Module
   Each function renders content into its .page-view container.
   Pages: Dashboard, Travelers, Visas, Border Crossings,
          Ports, Blacklist
   ============================================================ */

import {
  countries, travelers, visas, ports, border_crossings, blacklist,
  getCountryName, getPortName, getTraveler, isBlacklisted,
  getDashboardStats, getVisaTypeBreakdown,
} from './data.js';

import {
  paginate, filterData, formatDate, formatDateTime,
  openModal, closeModal, showToast, initTableSort,
} from './ui.js';

/* ============================================================
   DASHBOARD
   ============================================================ */
export function renderDashboard() {
  const stats = getDashboardStats();
  const breakdown = getVisaTypeBreakdown();
  const maxCount = Math.max(...breakdown.map(b => b.count), 1);

  /* Bar colours per visa type */
  const barColors = {
    Tourist:    '#C9A84C',
    Work:       '#1E40AF',
    Student:    '#14724A',
    Transit:    '#B45309',
    Diplomatic: '#5B21B6',
  };

  /* Recent crossings (latest 5) */
  const recentCrossings = [...border_crossings]
    .sort((a, b) => new Date(b.crossing_time) - new Date(a.crossing_time))
    .slice(0, 5);

  const activityHTML = recentCrossings.map(c => {
    const t = getTraveler(c.traveler_id);
    const dot = c.direction === 'IN' ? 'blue' : 'amber';
    const dir = c.direction === 'IN' ? '➜ Entered' : '← Departed';
    return `
      <li class="activity-item">
        <div class="activity-item__dot activity-item__dot--${dot}"></div>
        <div class="activity-item__body">
          <div class="activity-item__text">
            <strong>${t?.name ?? 'Unknown'}</strong> ${dir} via ${getPortName(c.port_id)}
          </div>
          <div class="activity-item__time">${formatDateTime(c.crossing_time)}</div>
        </div>
      </li>`;
  }).join('');

  /* Pending visa list */
  const pendingVisas = visas.filter(v => v.status === 'Pending').slice(0, 5);
  const pendingHTML = pendingVisas.length === 0
    ? `<div class="empty-state"><p class="empty-state__title">No pending visas</p></div>`
    : `<table class="data-table">
        <thead><tr>
          <th>Traveler</th><th>Destination</th><th>Type</th><th>Applied</th>
        </tr></thead>
        <tbody>
          ${pendingVisas.map(v => {
            const t = getTraveler(v.traveler_id);
            return `<tr>
              <td>${t?.name ?? '—'}</td>
              <td>${getCountryName(v.country_id)}</td>
              <td><span class="badge badge--${v.type.toLowerCase()}">${v.type}</span></td>
              <td>${formatDate(v.start_date)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;

  document.getElementById('dashboardView').innerHTML = `
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-banner__text">
        <div class="welcome-banner__greeting">Welcome back, Officer</div>
        <div class="welcome-banner__title">Country Immigration System</div>
        <div class="welcome-banner__subtitle">Monitor and manage all immigration activities from one central dashboard.</div>
      </div>
      <div class="welcome-banner__meta">
        <div class="welcome-banner__date-block">
          <div class="welcome-banner__date" id="dashDate"></div>
          <div class="welcome-banner__time" id="dashTime"></div>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--navy">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">${stats.totalTravelers}</div>
          <div class="stat-card__label">Registered Travelers</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--gold">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">${stats.totalVisas}</div>
          <div class="stat-card__label">Total Visa Records</div>
          <div class="stat-card__delta up">↑ ${stats.approvedVisas} approved</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--amber">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">${stats.pendingVisas}</div>
          <div class="stat-card__label">Pending Applications</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">${stats.totalCrossings}</div>
          <div class="stat-card__label">Border Crossings</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--green">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">${stats.totalCountries}</div>
          <div class="stat-card__label">Countries in System</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--red">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value">${stats.blacklisted}</div>
          <div class="stat-card__label">Active Blacklists</div>
          <div class="stat-card__delta down">${stats.blacklisted > 0 ? 'Requires attention' : 'All clear'}</div>
        </div>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Left Column -->
      <div style="display:flex;flex-direction:column;gap:20px;">
        <!-- Recent Activity -->
        <div class="panel">
          <div class="panel__header">
            <div>
              <div class="panel__title">Recent Border Activity</div>
              <div class="panel__subtitle">Latest crossings across all ports</div>
            </div>
          </div>
          <div class="panel__body">
            <ul class="activity-list">${activityHTML}</ul>
          </div>
        </div>

        <!-- Pending Visas -->
        <div class="panel">
          <div class="panel__header">
            <div>
              <div class="panel__title">Pending Visa Applications</div>
              <div class="panel__subtitle">Awaiting officer review</div>
            </div>
            <button class="btn btn--gold btn--sm" onclick="document.querySelector('[data-page=visas]').click()">View All</button>
          </div>
          <div class="table-wrapper">${pendingHTML}</div>
        </div>
      </div>

      <!-- Right Column -->
      <div style="display:flex;flex-direction:column;gap:20px;">
        <!-- Quick Actions -->
        <div class="panel">
          <div class="panel__header">
            <div class="panel__title">Quick Actions</div>
          </div>
          <div class="panel__body">
            <div class="quick-actions">
              <button class="quick-action-btn" onclick="document.querySelector('[data-page=travelers]').click()">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>
                Add Traveler
              </button>
              <button class="quick-action-btn" onclick="document.querySelector('[data-page=visas]').click()">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                New Visa
              </button>
              <button class="quick-action-btn" onclick="document.querySelector('[data-page=crossings]').click()">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                Log Crossing
              </button>
              <button class="quick-action-btn" onclick="document.querySelector('[data-page=blacklist]').click()">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                Blacklist Check
              </button>
            </div>
          </div>
        </div>

        <!-- Visa Breakdown -->
        <div class="panel">
          <div class="panel__header">
            <div class="panel__title">Visa Type Breakdown</div>
          </div>
          <div class="panel__body">
            <div class="visa-breakdown">
              ${breakdown.map(b => `
                <div class="visa-bar-row">
                  <span class="visa-bar-row__label">${b.type}</span>
                  <div class="visa-bar-track">
                    <div class="visa-bar-fill" style="width:${(b.count/maxCount)*100}%;background:${barColors[b.type]};"></div>
                  </div>
                  <span class="visa-bar-row__count">${b.count}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Port Status -->
        <div class="panel">
          <div class="panel__header">
            <div class="panel__title">Active Ports</div>
          </div>
          <div class="panel__body" style="padding:14px;">
            <div class="port-status-grid">
              ${ports.slice(0, 4).map(p => {
                const ins  = border_crossings.filter(c => c.port_id === p.port_id && c.direction === 'IN').length;
                const outs = border_crossings.filter(c => c.port_id === p.port_id && c.direction === 'OUT').length;
                return `
                  <div class="port-card">
                    <div class="port-card__name">${p.name.split(' ').slice(0,3).join(' ')}</div>
                    <div class="port-card__type">${p.type}</div>
                    <div class="port-card__stats">
                      <div><div class="port-card__stat-val">${ins}</div><div class="port-card__stat-lbl">Arrivals</div></div>
                      <div><div class="port-card__stat-val">${outs}</div><div class="port-card__stat-lbl">Departures</div></div>
                    </div>
                  </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;

  /* Live date */
  const dateEl = document.getElementById('dashDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
}

/* ============================================================
   TRAVELERS PAGE
   ============================================================ */
let travelerPage = 1;
let travelerQuery = '';
const ROWS = 8;

export function renderTravelers() {
  const el = document.getElementById('travelersView');
  if (!el) return;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header__left">
        <div class="page-header__title">Travelers</div>
        <div class="page-header__breadcrumb">
          <span>Dashboard</span><span>›</span><span class="current">Travelers</span>
        </div>
      </div>
      <div class="page-header__actions">
        <button class="btn btn--gold" id="addTravelerBtn">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Traveler
        </button>
      </div>
    </div>

    <div class="panel">
      <div class="panel__header">
        <div>
          <div class="panel__title">Traveler Registry</div>
          <div class="panel__subtitle">All registered travelers and their passport details</div>
        </div>
        <div class="panel__actions">
          <div class="topbar__search" style="width:220px;">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="travelerSearch" placeholder="Search travelers…" oninput="window._travelerSearch(this.value)">
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table" id="travelersTable">
          <thead><tr>
            <th class="sortable" data-key="traveler_id">#</th>
            <th class="sortable" data-key="name">Full Name</th>
            <th>Passport No.</th>
            <th class="sortable" data-key="nationality_id">Nationality</th>
            <th>Date of Birth</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody id="travelersBody"></tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination__info" id="travelerInfo"></span>
        <div class="pagination__controls" id="travelerPager"></div>
      </div>
    </div>`;

  window._travelerSearch = (q) => { travelerQuery = q; travelerPage = 1; _drawTravelers(); };
  document.getElementById('addTravelerBtn')?.addEventListener('click', () => openModal('travelerModal'));

  _drawTravelers();
}

function _drawTravelers() {
  const filtered = filterData(travelers, travelerQuery, ['name', 'passport_no']);
  const paged = paginate(filtered, travelerPage, ROWS, 'travelerInfo', 'travelerPager', p => {
    travelerPage = p; _drawTravelers();
  });

  document.getElementById('travelersBody').innerHTML = paged.map(t => {
    const bl = isBlacklisted(t.traveler_id);
    return `<tr>
      <td>${t.traveler_id}</td>
      <td><strong>${t.name}</strong></td>
      <td><span class="mono">${t.passport_no}</span></td>
      <td>${getCountryName(t.nationality_id)}</td>
      <td>${formatDate(t.date_of_birth)}</td>
      <td>${bl
        ? `<span class="badge badge--blacklist">Blacklisted</span>`
        : `<span class="badge badge--approved">Clear</span>`}</td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn--outline btn--sm">View</button>
          <button class="btn btn--outline btn--sm">Edit</button>
        </div>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="7"><div class="empty-state"><p class="empty-state__title">No travelers found</p></div></td></tr>`;
}

/* ============================================================
   VISAS PAGE
   ============================================================ */
let visaPage = 1;
let visaStatusFilter = '';
let visaTypeFilter = '';

export function renderVisas() {
  const el = document.getElementById('visasView');
  if (!el) return;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header__left">
        <div class="page-header__title">Visa Management</div>
        <div class="page-header__breadcrumb">
          <span>Dashboard</span><span>›</span><span class="current">Visas</span>
        </div>
      </div>
      <div class="page-header__actions">
        <button class="btn btn--gold" id="addVisaBtn">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Application
        </button>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <select class="form-control" id="visaStatusFilter" onchange="window._visaFilter()">
        <option value="">All Statuses</option>
        <option>Pending</option><option>Approved</option>
        <option>Rejected</option><option>Expired</option><option>Cancelled</option>
      </select>
      <select class="form-control" id="visaTypeFilter" onchange="window._visaFilter()">
        <option value="">All Types</option>
        <option>Tourist</option><option>Work</option><option>Student</option>
        <option>Transit</option><option>Diplomatic</option>
      </select>
    </div>

    <div class="panel">
      <div class="panel__header">
        <div>
          <div class="panel__title">Visa Applications</div>
          <div class="panel__subtitle">All visa records across all nationalities and destinations</div>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Traveler</th><th>Destination</th>
            <th>Type</th><th>Status</th><th>Valid From</th><th>Valid To</th><th>Actions</th>
          </tr></thead>
          <tbody id="visasBody"></tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination__info" id="visaInfo"></span>
        <div class="pagination__controls" id="visaPager"></div>
      </div>
    </div>`;

  window._visaFilter = () => {
    visaStatusFilter = document.getElementById('visaStatusFilter').value;
    visaTypeFilter   = document.getElementById('visaTypeFilter').value;
    visaPage = 1;
    _drawVisas();
  };
  document.getElementById('addVisaBtn')?.addEventListener('click', () => openModal('visaModal'));
  _drawVisas();
}

function _drawVisas() {
  let filtered = [...visas];
  if (visaStatusFilter) filtered = filtered.filter(v => v.status === visaStatusFilter);
  if (visaTypeFilter)   filtered = filtered.filter(v => v.type === visaTypeFilter);

  const paged = paginate(filtered, visaPage, ROWS, 'visaInfo', 'visaPager', p => {
    visaPage = p; _drawVisas();
  });

  document.getElementById('visasBody').innerHTML = paged.map(v => {
    const t = getTraveler(v.traveler_id);
    return `<tr>
      <td>${v.visa_id}</td>
      <td><strong>${t?.name ?? '—'}</strong><br><small class="mono" style="color:var(--clr-text-muted);font-size:.72rem;">${t?.passport_no ?? ''}</small></td>
      <td>${getCountryName(v.country_id)}</td>
      <td><span class="badge badge--${v.type.toLowerCase()}">${v.type}</span></td>
      <td><span class="badge badge--${v.status.toLowerCase()}">${v.status}</span></td>
      <td>${formatDate(v.start_date)}</td>
      <td>${formatDate(v.end_date)}</td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn--outline btn--sm" onclick="window._approveVisa(${v.visa_id})">Approve</button>
          <button class="btn btn--danger btn--sm" onclick="window._rejectVisa(${v.visa_id})">Reject</button>
        </div>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="8"><div class="empty-state"><p class="empty-state__title">No visa records match the filter</p></div></td></tr>`;

  /* Mock approve/reject with toast feedback */
  window._approveVisa = (id) => showToast(`Visa #${id} marked as Approved.`, 'success');
  window._rejectVisa  = (id) => showToast(`Visa #${id} marked as Rejected.`, 'error');
}

/* ============================================================
   BORDER CROSSINGS PAGE
   ============================================================ */
let crossingPage = 1;
let crossingDir = '';

export function renderCrossings() {
  const el = document.getElementById('crossingsView');
  if (!el) return;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header__left">
        <div class="page-header__title">Border Crossings</div>
        <div class="page-header__breadcrumb">
          <span>Dashboard</span><span>›</span><span class="current">Border Crossings</span>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <select class="form-control" id="crossingDirFilter" onchange="window._crossingFilter()">
        <option value="">All Directions</option>
        <option value="IN">Entry (IN)</option>
        <option value="OUT">Exit (OUT)</option>
      </select>
    </div>

    <div class="panel">
      <div class="panel__header">
        <div class="panel__title">Crossing Log</div>
        <div class="panel__subtitle">All recorded entries and exits at all ports</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Traveler</th><th>Port of Entry/Exit</th>
            <th>Direction</th><th>Date & Time</th>
          </tr></thead>
          <tbody id="crossingsBody"></tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination__info" id="crossingInfo"></span>
        <div class="pagination__controls" id="crossingPager"></div>
      </div>
    </div>`;

  window._crossingFilter = () => {
    crossingDir = document.getElementById('crossingDirFilter').value;
    crossingPage = 1; _drawCrossings();
  };
  _drawCrossings();
}

function _drawCrossings() {
  let filtered = [...border_crossings].sort((a,b) => new Date(b.crossing_time) - new Date(a.crossing_time));
  if (crossingDir) filtered = filtered.filter(c => c.direction === crossingDir);

  const paged = paginate(filtered, crossingPage, ROWS, 'crossingInfo', 'crossingPager', p => {
    crossingPage = p; _drawCrossings();
  });

  document.getElementById('crossingsBody').innerHTML = paged.map(c => {
    const t = getTraveler(c.traveler_id);
    return `<tr>
      <td>${c.crossing_id}</td>
      <td><strong>${t?.name ?? '—'}</strong></td>
      <td>${getPortName(c.port_id)}</td>
      <td><span class="badge badge--${c.direction.toLowerCase()}">${c.direction === 'IN' ? '↓ Entry' : '↑ Exit'}</span></td>
      <td><span class="mono">${formatDateTime(c.crossing_time)}</span></td>
    </tr>`;
  }).join('');
}

/* ============================================================
   PORTS PAGE
   ============================================================ */
export function renderPorts() {
  const el = document.getElementById('portsView');
  if (!el) return;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header__left">
        <div class="page-header__title">Ports of Entry</div>
        <div class="page-header__breadcrumb">
          <span>Dashboard</span><span>›</span><span class="current">Ports</span>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel__header">
        <div class="panel__title">Registered Ports</div>
        <div class="panel__subtitle">Airports, seaports and land border crossings</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Port Name</th><th>Type</th><th>Country</th>
            <th>Total Arrivals</th><th>Total Departures</th>
          </tr></thead>
          <tbody>
            ${ports.map(p => {
              const ins  = border_crossings.filter(c => c.port_id === p.port_id && c.direction === 'IN').length;
              const outs = border_crossings.filter(c => c.port_id === p.port_id && c.direction === 'OUT').length;
              const typeIcon = p.type === 'Airport' ? '✈' : p.type === 'Seaport' ? '⚓' : '🛤';
              return `<tr>
                <td>${p.port_id}</td>
                <td><strong>${p.name}</strong></td>
                <td>${typeIcon} ${p.type}</td>
                <td>${getCountryName(p.country_id)}</td>
                <td><span class="badge badge--in">${ins} IN</span></td>
                <td><span class="badge badge--out">${outs} OUT</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* ============================================================
   BLACKLIST PAGE
   ============================================================ */
export function renderBlacklist() {
  const el = document.getElementById('blacklistView');
  if (!el) return;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header__left">
        <div class="page-header__title">Blacklist Registry</div>
        <div class="page-header__breadcrumb">
          <span>Dashboard</span><span>›</span><span class="current">Blacklist</span>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel__header">
        <div class="panel__title">Banned Travelers</div>
        <div class="panel__subtitle">Active travel bans and restricted individuals</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Traveler</th><th>Passport</th>
            <th>Reason</th><th>Ban Start</th><th>Ban End</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${blacklist.map(b => {
              const t = getTraveler(b.traveler_id);
              const today = new Date().toISOString().slice(0,10);
              const active = !b.reinstated && b.ban_start <= today && b.ban_end >= today;
              return `<tr>
                <td>${b.blacklist_id}</td>
                <td><strong>${t?.name ?? '—'}</strong></td>
                <td><span class="mono">${t?.passport_no ?? '—'}</span></td>
                <td style="max-width:220px;white-space:normal;">${b.reason}</td>
                <td>${formatDate(b.ban_start)}</td>
                <td>${formatDate(b.ban_end)}</td>
                <td>
                  ${active
                    ? `<span class="badge badge--blacklist">Active Ban</span>`
                    : `<span class="badge badge--approved">Reinstated</span>`}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* ============================================================
   COUNTRIES PAGE
   ============================================================ */
export function renderCountries() {
  const el = document.getElementById('countriesView');
  if (!el) return;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header__left">
        <div class="page-header__title">Countries</div>
        <div class="page-header__breadcrumb">
          <span>Dashboard</span><span>›</span><span class="current">Countries</span>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel__header">
        <div class="panel__title">Country Registry</div>
        <div class="panel__subtitle">All countries and their immigration visa policies</div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Country Name</th><th>Population</th><th>Visa Policy</th>
          </tr></thead>
          <tbody>
            ${countries.map(c => `<tr>
              <td>${c.country_id}</td>
              <td><strong>${c.name}</strong></td>
              <td>${c.population.toLocaleString()}</td>
              <td style="max-width:280px;white-space:normal;">${c.visa_policy}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}
