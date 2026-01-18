// assets/js/app/pages/reports.js
(function () {
  'use strict';

  const DATA = [
    { period: '2025-11', collected: 145000, debt: 32000, late: 12000, count: 420 },
    { period: '2025-12', collected: 152000, debt: 28000, late: 9000, count: 438 },
    { period: '2026-01', collected: 98000,  debt: 41000, late: 17000, count: 301 }
  ];

  function formatTRY(n) {
    try {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
    } catch (_) {
      return '₺ ' + n;
    }
  }

  function getFilters() {
    return {
      period: document.getElementById('filterReportPeriod')?.value || '2026-01',
      type: document.getElementById('filterReportType')?.value || 'collection'
    };
  }

  function pickRows() {
    // Şimdilik: tabloya hepsini gösteriyoruz. Backend gelince filtre etkiler.
    return DATA.slice().reverse();
  }

  function renderKpi(rows) {
    // “seçili dönem” KPI gibi davranalım
    const f = getFilters();
    const current = DATA.find(x => x.period === f.period) || rows[0] || DATA[DATA.length - 1];

    const elCollected = document.getElementById('repKpiCollected');
    const elDebt = document.getElementById('repKpiDebt');
    const elLate = document.getElementById('repKpiLate');
    const elCount = document.getElementById('repKpiCount');

    if (elCollected) elCollected.innerText = formatTRY(current.collected);
    if (elDebt) elDebt.innerText = formatTRY(current.debt);
    if (elLate) elLate.innerText = formatTRY(current.late);
    if (elCount) elCount.innerText = String(current.count);
  }

  function renderTable(rows) {
    const tbody = document.getElementById('reportsTableBody');
    const badge = document.getElementById('reportsCountBadge');
    if (!tbody) return;

    tbody.innerHTML = rows.map(x => {
      return `
        <tr>
          <td class="fw-semibold">${x.period}</td>
          <td class="text-end fw-semibold text-success">${formatTRY(x.collected)}</td>
          <td class="text-end fw-semibold text-danger">${formatTRY(x.debt)}</td>
          <td class="text-end fw-semibold text-warning">${formatTRY(x.late)}</td>
          <td class="text-end">${x.count}</td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-outline-primary">
              <i class="bx bx-detail me-1"></i> Detay
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (badge) badge.innerText = String(rows.length);
  }

  function wireActions() {
    document.getElementById('btnReportsApply')?.addEventListener('click', () => {
      const rows = pickRows();
      renderKpi(rows);
      renderTable(rows);
    });

    document.getElementById('btnReportsGenerate')?.addEventListener('click', () => {
      alert('Dummy: raporu yenile (backend gelince).');
    });

    document.getElementById('btnReportsExport')?.addEventListener('click', () => {
      alert('Dummy: export (backend gelince).');
    });
  }

  window.initReports = function () {
    const rows = pickRows();
    renderKpi(rows);
    renderTable(rows);
    wireActions();
  };
})();
