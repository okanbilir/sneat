(function () {
  'use strict';

  function statusBadge(s) {
    if (s === 'open') return '<span class="badge bg-label-warning">Açık</span>';
    if (s === 'in_progress') return '<span class="badge bg-label-primary">İşlemde</span>';
    return '<span class="badge bg-label-success">Tamamlandı</span>';
  }

  window.initStaffCleaningDashboard = function () {
    const data = window.__tickets || [];

    // Temizlik için: assignee=cleaning VEYA tag=cleaning olanlar (atanmamışsa bile listede görülsün)
    const cleaningRelated = data.filter(t => (t.assignee || '') === 'cleaning' || (t.tag || '') === 'cleaning');

    const open = cleaningRelated.filter(t => t.status === 'open').length;
    const progress = cleaningRelated.filter(t => t.status === 'in_progress').length;

    const today = new Date().toISOString().slice(0, 10);
    const doneToday = cleaningRelated.filter(t => t.status === 'done' && t.created === today).length;

    const common = cleaningRelated.filter(t => String(t.unit || '').toLowerCase().includes('ortak')).length;

    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v); };
    setText('cl-open', open);
    setText('cl-progress', progress);
    setText('cl-done-today', doneToday);
    setText('cl-common', common);
    setText('cl-total', cleaningRelated.length);

    // tablo (en güncel 8)
    const top = cleaningRelated.slice().sort((a, b) => String(b.created).localeCompare(String(a.created))).slice(0, 8);

    const tbody = document.getElementById('cl-table');
    if (!tbody) return;

    tbody.innerHTML = top.map(t => `
      <tr>
        <td>
          <div class="fw-semibold">${t.title}</div>
          <small class="text-muted">${t.tag || 'cleaning'}</small>
        </td>
        <td>${t.unit || '-'}</td>
        <td>${statusBadge(t.status)}</td>
        <td class="text-end">
          <a href="javascript:void(0);" class="btn btn-sm btn-outline-primary" data-route="maintenanceManage">
            <i class="bx bx-right-arrow-alt"></i>
          </a>
        </td>
      </tr>
    `).join('');
  };
})();
