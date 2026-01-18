(function () {
  'use strict';

  // Stores (dummy)
  window.__visitors = window.__visitors || [];
  window.__parcels = window.__parcels || [];
  window.__food = window.__food || [
    { id:'f1', unit:'B-12', vendor:'Getir', note:'Kapıda', status:'waiting', created:'2026-01-19' }
  ];

  function text(elId, v){ const el = document.getElementById(elId); if (el) el.textContent = String(v); }
  function qv(id){ return (document.getElementById(id)?.value || '').toLowerCase().trim(); }

  function badgeVisitor(s){
    if (s === 'pending') return '<span class="badge bg-label-warning">Bekliyor</span>';
    if (s === 'in') return '<span class="badge bg-label-success">İçeride</span>';
    return '<span class="badge bg-label-secondary">Çıktı</span>';
  }
  function badgeParcel(s){
    if (s === 'waiting') return '<span class="badge bg-label-warning">Bekliyor</span>';
    return '<span class="badge bg-label-success">Teslim</span>';
  }
  function badgeFood(s){
    if (s === 'waiting') return '<span class="badge bg-label-warning">Bekliyor</span>';
    return '<span class="badge bg-label-success">Teslim</span>';
  }

  function todayISO(){ return new Date().toISOString().slice(0,10); }

  function renderKpis(){
    const t = todayISO();
    text('kpiVisitors', window.__visitors.filter(v => (v.created||'') === t).length);
    text('kpiParcels', window.__parcels.filter(p => p.status === 'waiting').length);
    text('kpiFood', window.__food.filter(f => f.status === 'waiting').length);
  }

  function currentTabKey(){
    const active = document.querySelector('.nav-pills .nav-link.active');
    const target = active?.getAttribute('data-bs-target') || '#tabVisitors';
    if (target === '#tabParcels') return 'parcels';
    if (target === '#tabFood') return 'food';
    return 'visitors';
  }

  function passesCommonFilter(obj, fields){
    const q = qv('opSearch');
    const st = document.getElementById('opStatus')?.value || '';
    const matchQ = !q || fields.some(f => String(obj[f]||'').toLowerCase().includes(q));
    const matchS = !st || obj.status === st;
    return matchQ && matchS;
  }

  // Visitors table
  function renderVisitors(){
    const tbody = document.getElementById('opVisitorsTbody');
    if (!tbody) return;

    const list = window.__visitors.filter(v => passesCommonFilter(v, ['name','unit','phone','note']));
    text('opCount', list.length);

    tbody.innerHTML = list.map(v => `
      <tr>
        <td class="fw-semibold">${v.name}</td>
        <td>${v.unit}</td>
        <td>${badgeVisitor(v.status)}</td>
        <td><span class="text-muted">${(v.eta||'').replace('T',' ') || '-'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-success me-1" data-act="vin" data-id="${v.id}">
            <i class="bx bx-log-in-circle"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary me-1" data-act="vout" data-id="${v.id}">
            <i class="bx bx-log-out-circle"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-act="vdel" data-id="${v.id}">
            <i class="bx bx-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="vin"]').forEach(b => b.addEventListener('click', () => { const v=window.__visitors.find(x=>x.id===b.dataset.id); if(v){v.status='in'; renderAll();} }));
    tbody.querySelectorAll('[data-act="vout"]').forEach(b => b.addEventListener('click', () => { const v=window.__visitors.find(x=>x.id===b.dataset.id); if(v){v.status='out'; renderAll();} }));
    tbody.querySelectorAll('[data-act="vdel"]').forEach(b => b.addEventListener('click', () => { window.__visitors = window.__visitors.filter(x=>x.id!==b.dataset.id); renderAll(); }));
  }

  // Parcels table
  function renderParcels(){
    const tbody = document.getElementById('opParcelsTbody');
    if (!tbody) return;

    const list = window.__parcels.filter(p => passesCommonFilter(p, ['unit','carrier','track','note']));
    text('opCount', list.length);

    tbody.innerHTML = list.map(p => `
      <tr>
        <td class="fw-semibold">${p.unit}</td>
        <td>${p.carrier}</td>
        <td><span class="text-muted">${p.track || '-'}</span></td>
        <td>${badgeParcel(p.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-success me-1" data-act="pdeliv" data-id="${p.id}">
            <i class="bx bx-check"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-act="pdel" data-id="${p.id}">
            <i class="bx bx-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="pdeliv"]').forEach(b => b.addEventListener('click', () => { const p=window.__parcels.find(x=>x.id===b.dataset.id); if(p){p.status='delivered'; renderAll();} }));
    tbody.querySelectorAll('[data-act="pdel"]').forEach(b => b.addEventListener('click', () => { window.__parcels = window.__parcels.filter(x=>x.id!==b.dataset.id); renderAll(); }));
  }

  // Food table
  function renderFood(){
    const tbody = document.getElementById('opFoodTbody');
    if (!tbody) return;

    const list = window.__food.filter(f => passesCommonFilter(f, ['unit','vendor','note']));
    text('opCount', list.length);

    tbody.innerHTML = list.map(f => `
      <tr>
        <td class="fw-semibold">${f.unit}</td>
        <td>${f.vendor}</td>
        <td><span class="text-muted">${f.note || '-'}</span></td>
        <td>${badgeFood(f.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-success me-1" data-act="fdeliv" data-id="${f.id}">
            <i class="bx bx-check"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-act="fdel" data-id="${f.id}">
            <i class="bx bx-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="fdeliv"]').forEach(b => b.addEventListener('click', () => { const f=window.__food.find(x=>x.id===b.dataset.id); if(f){f.status='delivered'; renderAll();} }));
    tbody.querySelectorAll('[data-act="fdel"]').forEach(b => b.addEventListener('click', () => { window.__food = window.__food.filter(x=>x.id!==b.dataset.id); renderAll(); }));
  }

  function renderAll(){
    renderKpis();
    const tab = currentTabKey();
    if (tab === 'parcels') return renderParcels();
    if (tab === 'food') return renderFood();
    return renderVisitors();
  }

  // ----- Modals (manual entry) -----
  function openModal(id){ bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).show(); }
  function closeModal(id){ bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide(); }

  function newId(){ return (window.CrudUI?.newId?.() || Math.random().toString(16).slice(2)); }

  function bind(){
    document.getElementById('opSearch')?.addEventListener('input', renderAll);
    document.getElementById('opStatus')?.addEventListener('change', renderAll);
    document.getElementById('opRefresh')?.addEventListener('click', renderAll);

    document.querySelectorAll('.nav-pills [data-bs-toggle="tab"]').forEach(btn => {
      btn.addEventListener('shown.bs.tab', () => {
        // status dropdown’da anlamsız durum kalmış olabilir, temizle
        document.getElementById('opStatus').value = '';
        document.getElementById('opSearch').value = '';
        renderAll();
      });
    });

    document.getElementById('opNewVisitor')?.addEventListener('click', () => openModal('opVisitorModal'));
    document.getElementById('opNewParcel')?.addEventListener('click', () => openModal('opParcelModal'));
    document.getElementById('opNewFood')?.addEventListener('click', () => openModal('opFoodModal'));

    document.getElementById('opVisitorForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      window.__visitors.unshift({
        id: newId(),
        unit: document.getElementById('opVisUnit').value.trim(),
        name: document.getElementById('opVisName').value.trim(),
        phone: document.getElementById('opVisPhone').value.trim(),
        eta: document.getElementById('opVisEta').value,
        note: document.getElementById('opVisNote').value.trim() || 'Manuel giriş',
        status: 'pending',
        created: todayISO()
      });
      e.target.reset();
      closeModal('opVisitorModal');
      renderAll();
    });

    document.getElementById('opParcelForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      window.__parcels.unshift({
        id: newId(),
        unit: document.getElementById('opParUnit').value.trim(),
        carrier: document.getElementById('opParCarrier').value.trim(),
        track: document.getElementById('opParTrack').value.trim(),
        status: document.getElementById('opParStatus').value,
        note: document.getElementById('opParNote').value.trim() || 'Manuel giriş',
        created: todayISO()
      });
      e.target.reset();
      closeModal('opParcelModal');
      renderAll();
    });

    document.getElementById('opFoodForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      window.__food.unshift({
        id: newId(),
        unit: document.getElementById('opFoodUnit').value.trim(),
        vendor: document.getElementById('opFoodVendor').value.trim(),
        note: document.getElementById('opFoodNote').value.trim() || 'Manuel giriş',
        status: 'waiting',
        created: todayISO()
      });
      e.target.reset();
      closeModal('opFoodModal');
      renderAll();
    });
  }

  window.initOperations = function(){
    bind();
    renderAll();
  };
})();
