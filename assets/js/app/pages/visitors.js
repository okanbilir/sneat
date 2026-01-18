(function () {
  'use strict';

  // global dummy store
  window.__visitors = window.__visitors || [
    { id:'v1', unit:'B-12', name:'Mehmet Kaya', phone:'', eta:'2026-01-19T12:00', note:'Misafir', status:'pending', created:'2026-01-19' },
    { id:'v2', unit:'A-03', name:'Kargo Görevlisi', phone:'', eta:'2026-01-18T14:30', note:'Teslim', status:'in', created:'2026-01-18' }
  ];

  function getMyUnit() {
    const user = window.Auth?.getUser?.();
    if (user?.role === 'owner') return 'B-12';
    return 'A-03';
  }

  function initials(name){
    const s = String(name || 'Ziyaretçi').trim();
    const parts = s.split(/\s+/).filter(Boolean);
    const a = (parts[0] || 'Z')[0];
    const b = (parts[1] || 'Y')[0];
    return (a + b).toUpperCase();
  }

  function statusBadge(s){
    if (s === 'pending') return '<span class="badge bg-label-warning">Bekliyor</span>';
    if (s === 'in') return '<span class="badge bg-label-success">İçeride</span>';
    return '<span class="badge bg-label-secondary">Çıktı</span>';
  }

  // ---------- Tenant/Owner ----------
  function filterSelf() {
    const st = document.getElementById('visSelfStatus')?.value || '';
    const unit = getMyUnit();
    return window.__visitors.filter(v => v.unit === unit && (!st || v.status === st));
  }

  function renderSelf() {
    const tbody = document.getElementById('visSelfTbody');
    if (!tbody) return;

    const list = filterSelf();
    document.getElementById('visSelfCount').textContent = `${list.length}`;

    tbody.innerHTML = list.map(v => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="avatar avatar-xs">
              <span class="avatar-initial rounded bg-label-primary">${initials(v.name)}</span>
            </div>
            <div>
              <div class="fw-semibold">${v.name}</div>
              <small class="text-muted">${v.phone || ''}</small>
            </div>
          </div>
        </td>
        <td>${statusBadge(v.status)}</td>
        <td><span class="text-muted">${v.eta ? v.eta.replace('T',' ') : '-'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" data-act="detail" data-id="${v.id}">
            <i class="bx bx-show me-1"></i> Detay
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="detail"]').forEach(b => b.addEventListener('click', () => openSelfDetail(b.dataset.id)));
  }

  function openSelfDetail(id) {
    const v = window.__visitors.find(x => x.id === id);
    if (!v) return;

    document.getElementById('vsAvatar').textContent = initials(v.name);
    document.getElementById('vsName').textContent = v.name;
    document.getElementById('vsUnit').textContent = `Birim: ${v.unit}`;
    document.getElementById('vsPhone').textContent = v.phone || '-';
    document.getElementById('vsStatus').innerHTML = statusBadge(v.status);
    document.getElementById('vsNote').textContent = v.note || '-';

    bootstrap.Modal.getOrCreateInstance(document.getElementById('visSelfModal')).show();
  }

  function upsertSelfFromForm() {
    const unit = getMyUnit();
    const name = document.getElementById('visName').value.trim();
    const phone = document.getElementById('visPhone').value.trim();
    const eta = document.getElementById('visEta').value;
    const note = document.getElementById('visNote').value.trim();

    window.__visitors.unshift({
      id: window.CrudUI?.newId?.() || (Math.random().toString(16).slice(2)),
      unit, name, phone, eta, note,
      status: 'pending',
      created: new Date().toISOString().slice(0,10)
    });
  }

  window.initVisitors = function () {
    document.getElementById('visSelfStatus')?.addEventListener('change', renderSelf);

    document.getElementById('visForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      upsertSelfFromForm();
      e.target.reset();
      renderSelf();
    });

    renderSelf();
  };

  // ---------- Security/Admin Manage ----------
  function filterMng() {
    const q = (document.getElementById('visMngSearch')?.value || '').toLowerCase().trim();
    const st = document.getElementById('visMngStatus')?.value || '';

    return window.__visitors.filter(v => {
      const matchQ = !q || [v.name, v.unit, v.phone].some(x => String(x||'').toLowerCase().includes(q));
      const matchS = !st || v.status === st;
      return matchQ && matchS;
    });
  }

  function checkIn(id){
    const v = window.__visitors.find(x => x.id === id);
    if (!v) return;
    v.status = 'in';
    renderMng();
  }

  function checkOut(id){
    const v = window.__visitors.find(x => x.id === id);
    if (!v) return;
    v.status = 'out';
    renderMng();
  }

  function del(id){
    window.__visitors = window.__visitors.filter(x => x.id !== id);
    renderMng();
  }

  function renderMng() {
    const tbody = document.getElementById('visMngTbody');
    if (!tbody) return;

    const list = filterMng();
    document.getElementById('visMngCount').textContent = `${list.length}`;

    tbody.innerHTML = list.map(v => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="avatar avatar-xs">
              <span class="avatar-initial rounded bg-label-primary">${initials(v.name)}</span>
            </div>
            <div>
              <div class="fw-semibold">${v.name}</div>
              <small class="text-muted">${v.phone || ''}</small>
            </div>
          </div>
        </td>
        <td class="fw-semibold">${v.unit}</td>
        <td>${statusBadge(v.status)}</td>
        <td><span class="text-muted">${v.eta ? v.eta.replace('T',' ') : '-'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-success me-1" data-act="in" data-id="${v.id}">
            <i class="bx bx-log-in-circle"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary me-1" data-act="out" data-id="${v.id}">
            <i class="bx bx-log-out-circle"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-act="del" data-id="${v.id}">
            <i class="bx bx-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="in"]').forEach(b => b.addEventListener('click', () => checkIn(b.dataset.id)));
    tbody.querySelectorAll('[data-act="out"]').forEach(b => b.addEventListener('click', () => checkOut(b.dataset.id)));
    tbody.querySelectorAll('[data-act="del"]').forEach(b => b.addEventListener('click', () => del(b.dataset.id)));
  }

  window.initVisitorsManage = function () {
    document.getElementById('visMngSearch')?.addEventListener('input', renderMng);
    document.getElementById('visMngStatus')?.addEventListener('change', renderMng);

    document.getElementById('btnVisMngPending')?.addEventListener('click', () => {
      const s = document.getElementById('visMngStatus');
      if (s) s.value = 'pending';
      renderMng();
    });

    document.getElementById('btnVisMngIn')?.addEventListener('click', () => {
      const s = document.getElementById('visMngStatus');
      if (s) s.value = 'in';
      renderMng();
    });

    document.getElementById('btnVisMngAll')?.addEventListener('click', () => {
      const s = document.getElementById('visMngStatus');
      if (s) s.value = '';
      renderMng();
    });

    renderMng();
  };
})();
