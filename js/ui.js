/* ============================================================
   ui.js — UI Utility Module
   Sidebar toggle, Toast notifications, Modal helpers,
   Pagination, Clock, Page navigation
   ============================================================ */

/* ==================== SIDEBAR ==================== */

/**
 * Initialises sidebar open/close behaviour on mobile.
 * Attaches hamburger button and overlay click handlers.
 */
export function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const hamburger = document.getElementById('hamburgerBtn');

  if (!sidebar) return;

  /* Open sidebar */
  hamburger?.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  /* Close via overlay click */
  overlay?.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Highlights the correct sidebar nav item based on the active page key.
 * @param {string} pageKey - matches data-page attribute on sidebar items
 */
export function setActiveSidebarItem(pageKey) {
  document.querySelectorAll('.sidebar__item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageKey);
  });
}

/* ==================== PAGE ROUTING ==================== */

/**
 * Wires up sidebar nav items to swap visible page sections.
 * Each .sidebar__item[data-page] maps to a .page-view[data-page] element.
 * @param {Function} onNavigate - callback(pageKey) fired after navigation
 */
export function initNavigation(onNavigate) {
  const navItems = document.querySelectorAll('.sidebar__item[data-page]');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.page;
      showPage(key);
      setActiveSidebarItem(key);

      /* Update topbar title */
      const titleEl = document.getElementById('topbarTitle');
      if (titleEl) titleEl.textContent = item.querySelector('.nav-label')?.textContent ?? '';

      onNavigate?.(key);

      /* Close sidebar on mobile after navigation */
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebarOverlay')?.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}

/**
 * Shows the requested page section; hides all others.
 * @param {string} key
 */
export function showPage(key) {
  document.querySelectorAll('.page-view').forEach(view => {
    view.style.display = view.dataset.page === key ? 'block' : 'none';
  });
}

/* ==================== TOAST NOTIFICATIONS ==================== */

let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Shows a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration - ms before auto-dismiss (default 3500)
 */
export function showToast(message, type = 'success', duration = 3500) {
  const container = getToastContainer();

  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `${icons[type] ?? ''}<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

/* ==================== MODAL ==================== */

/**
 * Opens a modal by its ID.
 * @param {string} modalId
 */
export function openModal(modalId) {
  document.getElementById(modalId)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal by its ID.
 * @param {string} modalId
 */
export function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Initialises close behaviour for all modals:
 * - .modal__close buttons
 * - clicking the overlay
 */
export function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    /* Close when clicking the dark overlay itself */
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  document.querySelectorAll('.modal__close, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });
}

/* ==================== LIVE CLOCK ==================== */

/**
 * Starts a live clock updating every second.
 * @param {string} elementId - ID of element to inject time into
 */
export function startClock(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  function update() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-PK', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  }
  update();
  setInterval(update, 1000);
}

/* ==================== PAGINATION ==================== */

/**
 * Renders pagination controls and slices data.
 * @param {Array}    data       - full dataset
 * @param {number}   page       - current page (1-indexed)
 * @param {number}   perPage    - rows per page
 * @param {string}   infoId     - ID of "Showing X–Y of Z" element
 * @param {string}   ctrlId     - ID of pagination controls container
 * @param {Function} onPage     - callback(newPage) when a page btn is clicked
 * @returns {Array} - sliced data for the current page
 */
export function paginate(data, page, perPage, infoId, ctrlId, onPage) {
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const end   = Math.min(start + perPage, total);

  /* Update info text */
  const infoEl = document.getElementById(infoId);
  if (infoEl) {
    infoEl.textContent = total === 0
      ? 'No records found'
      : `Showing ${start + 1}–${end} of ${total} records`;
  }

  /* Render buttons */
  const ctrlEl = document.getElementById(ctrlId);
  if (ctrlEl) {
    ctrlEl.innerHTML = '';

    const prevBtn = makePageBtn('‹', safePage <= 1, () => onPage(safePage - 1));
    ctrlEl.appendChild(prevBtn);

    for (let p = 1; p <= totalPages; p++) {
      if (
        totalPages <= 7 ||
        p === 1 || p === totalPages ||
        (p >= safePage - 1 && p <= safePage + 1)
      ) {
        const btn = makePageBtn(String(p), false, () => onPage(p), p === safePage);
        ctrlEl.appendChild(btn);
      } else if (
        (p === safePage - 2 || p === safePage + 2) && totalPages > 7
      ) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination__btn';
        ellipsis.style.border = 'none';
        ellipsis.textContent = '…';
        ctrlEl.appendChild(ellipsis);
      }
    }

    const nextBtn = makePageBtn('›', safePage >= totalPages, () => onPage(safePage + 1));
    ctrlEl.appendChild(nextBtn);
  }

  return data.slice(start, end);
}

function makePageBtn(label, disabled, onClick, active = false) {
  const btn = document.createElement('button');
  btn.className = 'pagination__btn' + (active ? ' active' : '');
  btn.textContent = label;
  btn.disabled = disabled;
  btn.addEventListener('click', onClick);
  return btn;
}

/* ==================== TABLE SORT ==================== */

/**
 * Adds click-to-sort behaviour to a table's sortable <th> elements.
 * @param {string}   tableId
 * @param {Array}    data        - source array
 * @param {Function} onSort      - callback(sortedData) to re-render table
 */
export function initTableSort(tableId, data, onSort) {
  const headers = document.querySelectorAll(`#${tableId} th.sortable`);
  let currentKey = null;
  let asc = true;

  headers.forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (currentKey === key) asc = !asc;
      else { currentKey = key; asc = true; }

      headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(asc ? 'sort-asc' : 'sort-desc');

      const sorted = [...data].sort((a, b) => {
        const va = a[key]; const vb = b[key];
        if (va < vb) return asc ? -1 : 1;
        if (va > vb) return asc ? 1 : -1;
        return 0;
      });
      onSort(sorted);
    });
  });
}

/* ==================== SEARCH / FILTER ==================== */

/**
 * Filters an array of objects by a search string across specified keys.
 * @param {Array}    data
 * @param {string}   query
 * @param {string[]} keys - object keys to search within
 * @returns {Array}
 */
export function filterData(data, query, keys) {
  const q = query.trim().toLowerCase();
  if (!q) return data;
  return data.filter(item =>
    keys.some(k => String(item[k] ?? '').toLowerCase().includes(q))
  );
}

/* ==================== FORMAT HELPERS ==================== */

/** Format an ISO date string as "DD MMM YYYY" */
export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** Format a datetime string as "DD MMM YYYY, HH:MM" */
export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
