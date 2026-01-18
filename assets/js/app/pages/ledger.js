// assets/js/app/pages/ledger.js
(function () {
  'use strict';

  const DATA = [
    // in/out: in = +, out = -
    { date: '2026-01-12', apt: 'A-12', person: 'Okan Bilir', type: 'payment', desc: 'Ocak aidat ödemesi', amount: 1500, direction: 'in', status: 'completed' },
    { date: '2026-01-10', apt: 'C-08', person: 'Ayşe K.', type: 'due', desc: 'Ocak tahakkuk', amount: 1500, direction: 'in', status: 'posted' },
    { date: '2026-01-09', apt: 'B-03', person: 'Mehmet Y.', type: 'refund', desc: 'Fazla ödeme iadesi', amount: 250, direction: 'out', status: 'completed' },
    { date: '2026-01-07', apt: 'D-01', person: 'Can S.', type: 'adjustment', desc: 'Düzeltme kaydı', amount: 100, direction: 'in', status: 'pending' }
  ];

  function formatTRY(n) {
    try {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
    } catch (_) {
      return '₺ ' + n;
    }
  }

  function typeBadge(t) {
    if (t === 'payment') return '<span class="badge bg-label-success">Ödeme</span>';
    if (t === 'due') return '<span class="badge bg-label-primary">Tahakkuk</span>';
    if (t === 'refund') return '<span class="badge bg-label-warning">İade</span>';
    return '<span class="badge bg-label-secondary">Düzeltme</span>';
  }

  function statusBadge(s) {
    if (s === 'completed') return '<span class="badge bg-label-success">Tamamlandı</span>';
    if (s === 'posted') return '<span class="badge bg-label-primary">İşlendi</span>';
    if (s === 'pending') return '<span class="badge bg-label-warning">Bekliyor</span>';
    return '<span class="badge bg-label-secondary">—</span>';
  }

  function withinRange(dateStr, days) {
    if (days === 'all') return true;
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= Number(days);
  }

  function getFilters() {
    return {
      range: document.getElementById('filterLedgerRange')?.value || '7',
      type: document.getElementById('filterLedgerType')?.value || 'all',
      q: (document.getElementById('filterLedgerQuery')?.value || '').trim().toLowerCase()
    };
  }

  function filterData() {
    const f = getFilters();
    return DATA.filter(x => {
      const okRange = withinRange(x.date, f.range);
      const okType = f.type === 'all' ? true : x.type === f.type;
      const okQ =
        !f.q ||
        x.apt.toLowerCase().includes(f.q) ||
        x.person.toLowerCase().includes(f.q) ||
        x.desc.toLowerCase().includes(f.q);
      return okRange && okType && okQ;
    });
  }

  function renderSummary(rows) {
    let sumIn = 0, sumOut = 0;

    rows.forEach(x => {
      if (x.direction === 'in') sumIn += x.amount;
      if (x.direction === 'out') sumOut += x.amount;
    });

    const elIn = document.getElementById('sumIn');
    const elOut = document.getElementById('sumOut');
    const elNet = document.getElementById('sumNet');
    const elCount = document.getElementById('sumCount');

    if (elIn) elIn.innerText = formatTRY(sumIn);
    if (elOut) elOut.innerText = formatTRY(sumOut);
    if (elNet) elNet.innerText = formatTRY(sumIn - sumOut);
    if (elCount) elCount.innerText = String(rows.length);
  }

  function renderTable(rows) {
    const tbody = document.getElementById('ledgerTableBody');
    const badge = document.getElementById('ledgerCountBadge');
    if (!tbody) return;

    tbody.innerHTML = rows.map(x => {
      const amt = x.direction === 'in' ? x.amount : -x.amount;
      const amtText = formatTRY(Math.abs(amt));
      const amtHtml =
        x.direction === 'in'
          ? `<span class="fw-semibold text-success">+ ${amtText}</span>`
          : `<span class="fw-semibold text-danger">- ${amtText}</span>`;

      return `
        <tr>
          <td>${x.date}</td>
          <td>
            <div class="d-flex align-items-center">
              <div class="avatar avatar-xs me-2">
                <span class="avatar-initial rounded bg-label-primary">${(x.apt || '—').slice(0,1)}</span>
              </div>
              <div>
                <div class="fw-semibold">${x.apt}</div>
                <small class="text-muted">${x.person}</small>
              </div>
            </div>
          </td>
          <td>${typeBadge(x.type)}</td>
          <td>${x.desc}</td>
          <td class="text-end">${amtHtml}</td>
          <td>${statusBadge(x.status)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary" type="button">
              <i class="bx bx-detail me-1"></i> Detay
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (badge) badge.innerText = String(rows.length);
  }

  function wireActions() {
    document.getElementById('btnLedgerApply')?.addEventListener('click', () => {
      const rows = filterData();
      renderSummary(rows);
      renderTable(rows);
    });

    document.getElementById('btnLedgerExport')?.addEventListener('click', () => {
      alert('Dummy: Export (backend gelince).');
    });

    document.getElementById('btnLedgerNew')?.addEventListener('click', () => {
      alert('Dummy: Yeni hareket ekleme (backend gelince).');
    });
  }

  window.initLedger = function () {
    const rows = filterData();
    renderSummary(rows);
    renderTable(rows);
    wireActions();
  };
})();
