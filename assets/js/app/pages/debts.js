// assets/js/app/pages/debts.js
(function () {
  'use strict';

  const DATA = [
    { apt: 'A-12', name: 'Okan Bilir', debt: 3000, credit: 0, lateDays: 12, status: 'late' },
    { apt: 'B-03', name: 'Mehmet Y.', debt: 0, credit: 250, lateDays: 0, status: 'ok' },
    { apt: 'C-08', name: 'Ayşe K.', debt: 1500, credit: 0, lateDays: 3, status: 'late' },
    { apt: 'D-01', name: 'Can S.', debt: 4500, credit: 0, lateDays: 25, status: 'risk' }
  ];

  function formatTRY(n) {
    try {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
    } catch (_) {
      return '₺ ' + n;
    }
  }

  function statusBadge(s) {
    if (s === 'ok') return '<span class="badge bg-label-success">Normal</span>';
    if (s === 'late') return '<span class="badge bg-label-warning">Gecikmiş</span>';
    if (s === 'risk') return '<span class="badge bg-label-danger">Riskli</span>';
    return '<span class="badge bg-label-secondary">—</span>';
  }

  function viewPass(x, view) {
    const net = x.credit - x.debt;
    if (view === 'late') return x.lateDays > 0;
    if (view === 'credit') return net > 0;
    if (view === 'debt') return net < 0;
    return true; // balance
  }

  function getFilters() {
    return {
      view: document.getElementById('filterDebtsView')?.value || 'balance',
      status: document.getElementById('filterDebtsStatus')?.value || 'all',
      q: (document.getElementById('filterDebtsQuery')?.value || '').trim().toLowerCase()
    };
  }

  function filterData() {
    const f = getFilters();
    return DATA.filter(x => {
      const okView = viewPass(x, f.view);
      const okStatus = f.status === 'all' ? true : x.status === f.status;
      const okQ = !f.q || x.apt.toLowerCase().includes(f.q) || x.name.toLowerCase().includes(f.q);
      return okView && okStatus && okQ;
    });
  }

  function renderSummary(rows) {
    let sumDebt = 0, sumCredit = 0, sumLate = 0;

    rows.forEach(x => {
      sumDebt += x.debt;
      sumCredit += x.credit;
      if (x.lateDays > 0) sumLate += x.debt;
    });

    const elDebt = document.getElementById('sumDebt');
    const elCredit = document.getElementById('sumCredit');
    const elLate = document.getElementById('sumLate');
    const elPeople = document.getElementById('sumPeople');

    if (elDebt) elDebt.innerText = formatTRY(sumDebt);
    if (elCredit) elCredit.innerText = formatTRY(sumCredit);
    if (elLate) elLate.innerText = formatTRY(sumLate);
    if (elPeople) elPeople.innerText = String(rows.length);
  }

  function renderTable(rows) {
    const tbody = document.getElementById('debtsTableBody');
    const badge = document.getElementById('debtsCountBadge');
    if (!tbody) return;

    tbody.innerHTML = rows.map(x => {
      const net = x.credit - x.debt;
      const netHtml =
        net > 0
          ? `<span class="fw-semibold text-success">${formatTRY(net)}</span>`
          : net < 0
            ? `<span class="fw-semibold text-danger">-${formatTRY(Math.abs(net))}</span>`
            : `<span class="fw-semibold">${formatTRY(0)}</span>`;

      const lateText = x.lateDays > 0 ? `${x.lateDays} gün` : '—';

      return `
        <tr>
          <td class="fw-semibold">${x.apt}</td>
          <td>${x.name}</td>
          <td class="text-end">${formatTRY(x.debt)}</td>
          <td class="text-end">${formatTRY(x.credit)}</td>
          <td class="text-end">${netHtml}</td>
          <td>${statusBadge(x.status)}</td>
          <td>${lateText}</td>
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
    document.getElementById('btnDebtsApply')?.addEventListener('click', () => {
      const rows = filterData();
      renderSummary(rows);
      renderTable(rows);
    });

    document.getElementById('btnDebtsExport')?.addEventListener('click', () => {
      alert('Dummy: Export (backend gelince).');
    });

    document.getElementById('btnDebtsNew')?.addEventListener('click', () => {
      alert('Dummy: Yeni kayıt (backend gelince).');
    });
  }

  window.initDebts = function () {
    const rows = filterData();
    renderSummary(rows);
    renderTable(rows);
    wireActions();
  };
})();
