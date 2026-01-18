(function () {
  'use strict';

  function statusBadge(s) {
    if (s === 'open') return '<span class="badge bg-label-warning">Açık</span>';
    if (s === 'in_progress') return '<span class="badge bg-label-primary">İşlemde</span>';
    return '<span class="badge bg-label-success">Tamamlandı</span>';
  }

  function tagScore(tag) {
    // Öncelik: electric/plumbing daha kritik
    if (tag === 'electric') return 3;
    if (tag === 'plumbing') return 2;
    return 1;
  }

  window.initStaffTechDashboard = function () {
    const data = window.__tickets || [];
    const assignedTech = data.filter(t => (t.assignee || '') === 'tech');

    const open = assignedTech.filter(t => t.status === 'open').length;
    const progress = assignedTech.filter(t => t.status === 'in_progress').length;

    // dummy "bugün kapanan": created bugünkü tarih olan done'lar gibi kabul edelim
    const today = new Date().toISOString().slice(0, 10);
    const doneToday = assignedTech.filter(t => t.status === 'done' && t.created === today).length;

    const unassigned = data.filter(t => !t.assignee).length;

    document.getElementById('tech-open')?.(document.getElementById('tech-open').textContent = open);
    document.getElementById('tech-progress')?.(document.getElementById('tech-progress').textContent = progress);
    document.getElementById('tech-done-today')?.(document.getElementById('tech-done-today').textContent = doneToday);
    document.getElementById('tech-unassigned')?.(document.getElementById('tech-unassigned').textContent = unassigned);
    document.getElementById('tech-total')?.(document.getElementById('tech-total').textContent = assignedTech.length);

    // tablo: en kritik olanlar üstte
    const top = assignedTech
      .slice()
      .sort((a, b) => (tagScore(b.tag) - tagScore(a.tag)))
      .slice(0, 6);

    const tbody = document.getElementById('tech-table');
    if (!tbody) return;

    tbody.innerHTML = top.map(t => `
      <tr>
        <td>
          <div class="fw-semibold">${t.title}</div>
          <small class="text-muted">${t.tag || ''}</small>
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
