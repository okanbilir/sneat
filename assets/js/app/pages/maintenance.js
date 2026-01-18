(function () {
  'use strict';

  // Ortak dummy data (2 ekran da buradan beslenecek)
  window.__tickets = window.__tickets || [
    { id:'t1', title:'Kapı kilidi sıkışıyor', unit:'A-03', tag:'other', body:'Kapı zor kapanıyor', status:'open', assignee:'', created:'2026-01-18' },
    { id:'t2', title:'Koridor lambası', unit:'B-11', tag:'electric', body:'Yanıp sönüyor', status:'in_progress', assignee:'tech', created:'2026-01-17' },
    { id:'t3', title:'Asansör temizlik', unit:'Ortak', tag:'cleaning', body:'Kabin temizliği', status:'done', assignee:'cleaning', created:'2026-01-15' }
  ];

  function statusBadge(s){
    if (s === 'open') return '<span class="badge bg-label-warning">Açık</span>';
    if (s === 'in_progress') return '<span class="badge bg-label-primary">İşlemde</span>';
    return '<span class="badge bg-label-success">Tamamlandı</span>';
  }

  function tagLabel(t){
    const m = { plumbing:'Tesisat', electric:'Elektrik', cleaning:'Temizlik', other:'Diğer' };
    return m[t] || t;
  }

  // ---------- INDEX (tenant/owner view) ----------
  function filterTicketsIndex() {
    const q = (document.getElementById('ticketSearch')?.value || '').toLowerCase().trim();
    const st = document.getElementById('ticketStatusFilter')?.value || '';

    return window.__tickets.filter(x => {
      const matchQ = !q || [x.title, x.unit, x.tag].some(v => String(v).toLowerCase().includes(q));
      const matchS = !st || x.status === st;
      return matchQ && matchS;
    });
  }

  function renderIndex() {
    const tbody = document.getElementById('ticketsTbody');
    if (!tbody) return;

    const list = filterTicketsIndex();
    tbody.innerHTML = list.map(x => `
      <tr>
        <td>
          <div class="fw-semibold">${x.title}</div>
          <small class="text-muted">${tagLabel(x.tag)}</small>
        </td>
        <td>${x.unit}</td>
        <td>${statusBadge(x.status)}</td>
        <td><span class="text-muted">${x.created}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" data-act="del" data-id="${x.id}">
            <i class="bx bx-trash me-1"></i> Sil
          </button>
        </td>
      </tr>
    `).join('');

    // demo: silme
    tbody.querySelectorAll('[data-act="del"]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.id;
      window.__tickets = window.__tickets.filter(t => t.id !== id);
      renderIndex();
    }));
  }

  function openNewTicket() {
    document.getElementById('ticketId').value = '';
    document.getElementById('ticketTitle').value = '';
    document.getElementById('ticketUnit').value = '';
    document.getElementById('ticketBody').value = '';
    document.getElementById('ticketTag').value = 'plumbing';
    window.CrudUI.openModal('ticketModal');
  }

  window.initMaintenance = function () {
    document.getElementById('btnNewTicket')?.addEventListener('click', openNewTicket);
    document.getElementById('ticketSearch')?.addEventListener('input', renderIndex);
    document.getElementById('ticketStatusFilter')?.addEventListener('change', renderIndex);

    document.getElementById('ticketForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = window.CrudUI.newId();
      const title = document.getElementById('ticketTitle').value.trim();
      const unit = document.getElementById('ticketUnit').value.trim();
      const body = document.getElementById('ticketBody').value.trim();
      const tag = document.getElementById('ticketTag').value;

      window.__tickets.unshift({
        id, title, unit, body, tag,
        status:'open', assignee:'', created: new Date().toISOString().slice(0,10)
      });

      window.CrudUI.closeModal('ticketModal');
      renderIndex();
    });

    renderIndex();
  };

  // ---------- MANAGE (admin/tech/cleaning) ----------
  function filterManage() {
    const q = (document.getElementById('mSearch')?.value || '').toLowerCase().trim();
    const st = document.getElementById('mStatus')?.value || '';
    const asg = document.getElementById('mAssignee')?.value || '';

    return window.__tickets.filter(x => {
      const matchQ = !q || [x.title, x.unit].some(v => String(v).toLowerCase().includes(q));
      const matchS = !st || x.status === st;
      const matchA = !asg || x.assignee === asg;
      return matchQ && matchS && matchA;
    });
  }

  function assigneeLabel(a){
    const m = { tech:'Teknik', cleaning:'Temizlik', facility:'Operasyon', '':'Atanmadı' };
    return m[a] || a;
  }

  function renderManage() {
    const tbody = document.getElementById('mTbody');
    if (!tbody) return;

    const list = filterManage();
    document.getElementById('mCount').textContent = `${list.length}`;

    tbody.innerHTML = list.map(x => `
      <tr>
        <td>
          <div class="fw-semibold">${x.title}</div>
          <small class="text-muted">${tagLabel(x.tag)}</small>
        </td>
        <td>${x.unit}</td>
        <td>${assigneeLabel(x.assignee)}</td>
        <td>${statusBadge(x.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" data-act="edit" data-id="${x.id}">
            <i class="bx bx-edit-alt me-1"></i> Yönet
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="edit"]').forEach(b => b.addEventListener('click', () => openManage(b.dataset.id)));
  }

  function openManage(id){
    const t = window.__tickets.find(x => x.id === id);
    if (!t) return;

    document.getElementById('mId').value = t.id;
    document.getElementById('mTitle').textContent = t.title;
    document.getElementById('mUnit').textContent = `Birim: ${t.unit}`;
    document.getElementById('mAssignSel').value = t.assignee || '';
    document.getElementById('mStatusSel').value = t.status || 'open';
    document.getElementById('mNote').value = t.note || '';
    window.CrudUI.openModal('mModal');
  }

  window.initMaintenanceManage = function () {
    document.getElementById('mSearch')?.addEventListener('input', renderManage);
    document.getElementById('mStatus')?.addEventListener('change', renderManage);
    document.getElementById('mAssignee')?.addEventListener('change', renderManage);

    document.getElementById('mForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('mId').value;
      const t = window.__tickets.find(x => x.id === id);
      if (!t) return;

      t.assignee = document.getElementById('mAssignSel').value;
      t.status = document.getElementById('mStatusSel').value;
      t.note = document.getElementById('mNote').value.trim();

      window.CrudUI.closeModal('mModal');
      renderManage();
    });

    renderManage();
  };
})();
