// assets/js/app/pages/dues.js
(function () {
  'use strict';

  // Dummy dataset
  const DATA = [
    { apt: 'A-12', name: 'Okan Bilir', amount: 1500, due: '2026-01-31', status: 'unpaid' },
    { apt: 'B-03', name: 'Mehmet Y.', amount: 1500, due: '2026-01-31', status: 'paid' },
    { apt: 'C-08', name: 'Ayşe K.', amount: 1500, due: '2026-01-15', status: 'late' },
    { apt: 'D-01', name: 'Can S.', amount: 1500, due: '2026-01-31', status: 'unpaid' }
  ];

  function formatTRY(n) {
    try {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
    } catch (_) {
      return '₺ ' + n;
    }
  }

  function badgeForStatus(s) {
    if (s === 'paid') return '<span class="badge bg-label-success">Ödendi</span>';
    if (s === 'late') return '<span class="badge bg-label-warning">Gecikmiş</span>';
    return '<span class="badge bg-label-danger">Ödenmedi</span>';
  }

  function filterData() {
    const q = (document.getElementById('filterQuery')?.value || '').trim().toLowerCase();
    const status = document.getElementById('filterStatus')?.value || 'all';
    // period şimdilik dummy, backend gelince kullanılacak:
    // const period = document.getElementById('filterPeriod')?.value;

    return DATA.filter(x => {
      const okQ = !q || x.apt.toLowerCase().includes(q) || x.name.toLowerCase().includes(q);
      const okS = status === 'all' ? true : x.status === status;
      return okQ && okS;
    });
  }

  function renderTable(rows) {
    const tbody = document.getElementById('duesTableBody');
    const badge = document.getElementById('duesCountBadge');
    if (!tbody) return;

    tbody.innerHTML = rows.map((x, idx) => {
      return `
        <tr>
          <td class="fw-semibold">
            <div class="form-check m-0">
              <input class="form-check-input" type="radio" name="duesPick" id="duesPick${idx}">
              <label class="form-check-label ms-2" for="duesPick${idx}">${x.apt}</label>
            </div>
          </td>
          <td>${x.name}</td>
          <td class="fw-semibold">${formatTRY(x.amount)}</td>
          <td>${x.due}</td>
          <td>${badgeForStatus(x.status)}</td>
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

  function renderSummary(rows) {
    let total = 0, paid = 0, unpaid = 0, late = 0;

    rows.forEach(x => {
      total += x.amount;
      if (x.status === 'paid') paid += x.amount;
      if (x.status === 'unpaid') unpaid += x.amount;
      if (x.status === 'late') late += x.amount;
    });

    const elTotal = document.getElementById('sumTotal');
    const elPaid = document.getElementById('sumPaid');
    const elUnpaid = document.getElementById('sumUnpaid');
    const elLate = document.getElementById('sumLate');

    if (elTotal) elTotal.innerText = formatTRY(total);
    if (elPaid) elPaid.innerText = formatTRY(paid);
    if (elUnpaid) elUnpaid.innerText = formatTRY(unpaid);
    if (elLate) elLate.innerText = formatTRY(late);
  }

  function wireActions() {
    const btnApply = document.getElementById('btnDuesApply');
    btnApply?.addEventListener('click', () => {
      const rows = filterData();
      renderTable(rows);
      renderSummary(rows);
    });

    document.getElementById('btnDuesCreate')?.addEventListener('click', () => {
      alert('Dummy: Aidat oluşturma (backend gelince).');
    });

    document.getElementById('btnDuesExport')?.addEventListener('click', () => {
      alert('Dummy: Dışa aktarma (backend gelince).');
    });

    document.getElementById('btnMarkPaid')?.addEventListener('click', () => {
      alert('Dummy: seçili kaydı ödendi yap (backend gelince).');
    });

    document.getElementById('btnSendReminder')?.addEventListener('click', () => {
      alert('Dummy: hatırlatma gönder (backend gelince).');
    });
  }

  window.initDues = function () {
    // ilk render
    const rows = filterData();
    renderTable(rows);
    renderSummary(rows);
    wireActions();
  };
})();
