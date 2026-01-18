// assets/js/app/pages/visits.js
(function () {
  'use strict';

  const DATA = [
    { date: '2026-01-18', time: '09:12', type: 'resident', label: 'Oturum Sakini', gate: 'A Kapısı', status: 'in' },
    { date: '2026-01-18', time: '09:18', type: 'visitor', label: 'Ziyaretçi • Ali K.', gate: 'A Kapısı', status: 'in' },
    { date: '2026-01-18', time: '09:40', type: 'vehicle', label: '34 ABC 123', gate: 'Otopark', status: 'hold' },
    { date: '2026-01-17', time: '19:05', type: 'visitor', label: 'Ziyaretçi • Ece T.', gate: 'B Kapısı', status: 'out' }
  ];

  function typeBadge(t) {
    if (t === 'resident') return '<span class="badge bg-label-info">Sakin</span>';
    if (t === 'visitor') return '<span class="badge bg-label-warning">Ziyaretçi</span>';
    return '<span class="badge bg-label-danger">Araç</span>';
  }

  function statusBadge(s) {
    if (s === 'in') return '<span class="badge bg-label-success">İçeride</span>';
    if (s === 'out') return '<span class="badge bg-label-secondary">Çıkış</span>';
    return '<span class="badge bg-label-warning">Kontrol</span>';
  }

  function getFilters() {
    return {
      range: document.getElementById('filterVisitRange')?.value || 'today',
      type: document.getElementById('filterVisitType')?.value || 'all',
      status: document.getElementById('filterVisitStatus')?.value || 'all',
      q: (document.getElementById('filterVisitQuery')?.value || '').trim().toLowerCase()
    };
  }

  function withinRange(dateStr, range) {
    if (range === 'all') return true;

    const today = new Date();
    const d = new Date(dateStr + 'T00:00:00');

    // Bugün
    if (range === 'today') {
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    }

    // Son N gün
    const days = Number(range);
    const diff = (today - d) / (1000 * 60 * 60 * 24);
    return diff <= days;
  }

  function filterData() {
    const f = getFilters();
    return DATA.filter(x => {
      const okRange = withinRange(x.date, f.range);
      const okType = f.type === 'all' ? true : x.type === f.type;
      const okStatus = f.status === 'all' ? true : x.status === f.status;
      const okQ =
        !f.q ||
        x.label.toLowerCase().includes(f.q) ||
        x.gate.toLowerCase().includes(f.q);
      return okRange && okType && okStatus && okQ;
    });
  }

  function renderSummary(rows) {
    const inCount = rows.filter(x => x.status === 'in').length;
    const outCount = rows.filter(x => x.status === 'out').length;
    const holdCount = rows.filter(x => x.status === 'hold').length;

    const elIn = document.getElementById('sumVisitIn');
    const elOut = document.getElementById('sumVisitOut');
    const elHold = document.getElementById('sumVisitHold');
    const elCount = document.getElementById('sumVisitCount');

    if (elIn) elIn.innerText = String(inCount);
    if (elOut) elOut.innerText = String(outCount);
    if (elHold) elHold.innerText = String(holdCount);
    if (elCount) elCount.innerText = String(rows.length);
  }

  function renderTable(rows) {
    const tbody = document.getElementById('visitTableBody');
    const badge = document.getElementById('visitCountBadge');
    if (!tbody) return;

    tbody.innerHTML = rows.map(x => {
      return `
        <tr>
          <td>${x.date}</td>
          <td>${x.time}</td>
          <td>${typeBadge(x.type)}</td>
          <td class="fw-semibold">${x.label}</td>
          <td>${x.gate}</td>
          <td>${statusBadge(x.status)}</td>
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
    document.getElementById('btnVisitApply')?.addEventListener('click', () => {
      const rows = filterData();
      renderSummary(rows);
      renderTable(rows);
    });

    document.getElementById('btnVisitNew')?.addEventListener('click', () => {
      alert('Dummy: Yeni kayıt (backend gelince).');
    });

    document.getElementById('btnVisitExport')?.addEventListener('click', () => {
      alert('Dummy: Export (backend gelince).');
    });
  }

  window.initVisits = function () {
    const rows = filterData();
    renderSummary(rows);
    renderTable(rows);
    wireActions();
  };
})();
