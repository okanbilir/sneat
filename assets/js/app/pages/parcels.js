(function () {
  'use strict';

  // global dummy store
  window.__parcels = window.__parcels || [
    { id:'p1', unit:'B-12', carrier:'Yurtiçi', track:'YT-123', status:'waiting', note:'Güvenlikte', created:'2026-01-18' },
    { id:'p2', unit:'A-03', carrier:'Trendyol', track:'TR-553', status:'delivered', note:'Teslim alındı', created:'2026-01-16' }
  ];

  function statusBadge(s){
    if (s === 'waiting') return '<span class="badge bg-label-warning">Bekliyor</span>';
    return '<span class="badge bg-label-success">Teslim</span>';
  }

  function getMyUnit() {
    // Backend gelince user -> unitId gelir. Şimdilik demo:
    const user = window.Auth?.getUser?.();
    // owner@ örnek: B-12, resident@ örnek: A-03 yapalım
    if (user?.role === 'owner') return 'B-12';
    return 'A-03';
  }

  // ---------- Tenant/Owner view ----------
  function isWithinLast7Days(isoDate) {
    try {
      const d = new Date(isoDate);
      const now = new Date();
      const diff = (now - d) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    } catch (_) {
      return false;
    }
  }

  function carrierInitials(name){
    const s = String(name || 'Kargo').trim();
    const parts = s.split(/\s+/).filter(Boolean);
    const a = (parts[0] || 'K')[0];
    const b = (parts[1] || 'G')[0];
    return (a + b).toUpperCase();
  }

  function statusBadge(s){
    if (s === 'waiting') return '<span class="badge bg-label-warning">Bekliyor</span>';
    return '<span class="badge bg-label-success">Teslim</span>';
  }

  function filterSelf() {
    const q = (document.getElementById('parcelSelfSearch')?.value || '').toLowerCase().trim();
    const st = document.getElementById('parcelSelfStatus')?.value || '';
    const unit = getMyUnit();

    return window.__parcels.filter(p => {
      const mine = p.unit === unit;
      const matchQ = !q || [p.carrier, p.track, p.note].some(v => String(v||'').toLowerCase().includes(q));
      const matchS = !st || p.status === st;
      return mine && matchQ && matchS;
    });
  }

  function renderKpis(allMine) {
    const waiting = allMine.filter(x => x.status === 'waiting').length;
    const delivered = allMine.filter(x => x.status === 'delivered').length;
    const last7 = allMine.filter(x => isWithinLast7Days(x.created)).length;

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v); };
    set('parcelKpiWaiting', waiting);
    set('parcelKpiDelivered', delivered);
    set('parcelKpiLast7', last7);
    set('parcelSelfCount', allMine.length);
  }

  function renderSelf() {
    const tbody = document.getElementById('parcelSelfTbody');
    if (!tbody) return;

    const unit = getMyUnit();
    const allMine = window.__parcels.filter(p => p.unit === unit);
    renderKpis(allMine);

    const list = filterSelf();
    const tableCount = document.getElementById('parcelSelfTableCount');
    if (tableCount) tableCount.textContent = `${list.length}`;

    tbody.innerHTML = list.map(p => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="avatar avatar-xs">
              <span class="avatar-initial rounded bg-label-primary">${carrierInitials(p.carrier)}</span>
            </div>
            <div class="fw-semibold">${p.carrier}</div>
          </div>
        </td>
        <td>
          <span class="text-muted">${p.track || '-'}</span>
        </td>
        <td>${statusBadge(p.status)}</td>
        <td><span class="text-muted">${p.created || '-'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" data-act="detail" data-id="${p.id}">
            <i class="bx bx-show me-1"></i> Detay
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="detail"]').forEach(b =>
      b.addEventListener('click', () => openSelfDetail(b.dataset.id))
    );
  }

  function openSelfDetail(id) {
    const p = window.__parcels.find(x => x.id === id);
    if (!p) return;

    document.getElementById('psAvatar').textContent = carrierInitials(p.carrier);
    document.getElementById('psCarrier').textContent = p.carrier || '-';
    document.getElementById('psUnit').textContent = `Birim: ${p.unit || '-'}`;
    document.getElementById('psTrack').textContent = p.track || '-';
    document.getElementById('psStatus').innerHTML = statusBadge(p.status);
    document.getElementById('psNote').textContent = p.note || '-';

    const el = document.getElementById('parcelSelfModal');
    bootstrap.Modal.getOrCreateInstance(el).show();
  }

  window.initParcels = function () {
    document.getElementById('parcelSelfSearch')?.addEventListener('input', renderSelf);
    document.getElementById('parcelSelfStatus')?.addEventListener('change', renderSelf);

    document.getElementById('btnParcelRefresh')?.addEventListener('click', renderSelf);

    document.getElementById('btnParcelFilterWaiting')?.addEventListener('click', () => {
      const s = document.getElementById('parcelSelfStatus');
      if (s) s.value = 'waiting';
      renderSelf();
    });

    document.getElementById('btnParcelFilterDelivered')?.addEventListener('click', () => {
      const s = document.getElementById('parcelSelfStatus');
      if (s) s.value = 'delivered';
      renderSelf();
    });

    document.getElementById('btnParcelFilterAll')?.addEventListener('click', () => {
      const s = document.getElementById('parcelSelfStatus');
      if (s) s.value = '';
      renderSelf();
    });

    renderSelf();
  }
});
