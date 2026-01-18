(function () {
  'use strict';

  let rows = [
    { id:'u1', name:'Admin', email:'admin@', role:'admin', plan:'pro', status:'active', permissions:['*'] },
    { id:'u2', name:'Muhasebe', email:'accountant@', role:'accountant', plan:'pro', status:'active', permissions:['DUES_SITE_VIEW','DUES_MANAGE','LEDGER_SITE_VIEW','LEDGER_MANAGE','DEBT_SITE_VIEW','DEBT_MANAGE','REPORTS_SITE_VIEW','REPORTS_MANAGE','USER_VIEW'] },
    { id:'u3', name:'Daire Sahibi', email:'owner@', role:'owner', plan:'standard', status:'active', permissions:['DUES_SELF_VIEW','DUES_PAY','LEDGER_SELF_VIEW','DEBT_SELF_VIEW','REPORTS_SELF_VIEW','ANNOUNCEMENT_VIEW','FACILITY_VIEW'] },
    { id:'u4', name:'Kiracı', email:'resident@', role:'tenant', plan:'standard', status:'active', permissions:['DUES_SELF_VIEW','DUES_PAY','LEDGER_SELF_VIEW','DEBT_SELF_VIEW','ANNOUNCEMENT_VIEW','FACILITY_VIEW','FACILITY_BOOK'] }
  ];

  function roleLabel(r){
    const map = {
      tenant:'Kiracı', owner:'Daire Sahibi', accountant:'Muhasebe', security:'Güvenlik',
      facility_manager:'Operasyon', admin:'Admin', staff_cleaning:'Temizlik', staff_tech:'Teknik'
    };
    return map[r] || r;
  }

  function badgeStatus(s){
    if (s === 'active') return '<span class="badge bg-label-success">Aktif</span>';
    return '<span class="badge bg-label-secondary">Pasif</span>';
  }

  function filtered() {
    const q = (document.getElementById('userSearch')?.value || '').toLowerCase().trim();
    const rf = document.getElementById('roleFilter')?.value || '';
    return rows.filter(r => {
      const matchQ = !q || [r.name, r.email, r.role].some(x => String(x).toLowerCase().includes(q));
      const matchR = !rf || r.role === rf;
      return matchQ && matchR;
    });
  }

  function render() {
    const list = filtered();
    document.getElementById('userCount').textContent = `${list.length} kayıt`;

    const tbody = document.getElementById('usersTbody');
    if (!tbody) return;

    tbody.innerHTML = list.map(r => `
      <tr>
        <td class="fw-semibold">${r.name}</td>
        <td>${r.email}</td>
        <td>${roleLabel(r.role)}</td>
        <td><span class="badge bg-label-primary">${r.plan}</span></td>
        <td>${badgeStatus(r.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-icon btn-outline-primary me-1" data-act="edit" data-id="${r.id}">
            <i class="bx bx-edit-alt"></i>
          </button>
          <button class="btn btn-sm btn-icon btn-outline-danger" data-act="del" data-id="${r.id}">
            <i class="bx bx-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-act="edit"]').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.id)));
    tbody.querySelectorAll('[data-act="del"]').forEach(b => b.addEventListener('click', () => doDelete(b.dataset.id)));
  }

  function openNew() {
    document.getElementById('userId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userRole').value = 'tenant';
    document.getElementById('userPlan').value = 'standard';
    document.getElementById('userStatus').value = 'active';
    document.getElementById('userPerms').value = '';
    window.CrudUI.openModal('userModal');
  }

  function openEdit(id) {
    const r = rows.find(x => x.id === id);
    if (!r) return;

    document.getElementById('userId').value = r.id;
    document.getElementById('userName').value = r.name;
    document.getElementById('userEmail').value = r.email;
    document.getElementById('userRole').value = r.role;
    document.getElementById('userPlan').value = r.plan;
    document.getElementById('userStatus').value = r.status;
    document.getElementById('userPerms').value = (r.permissions || []).join(', ');
    window.CrudUI.openModal('userModal');
  }

  function doDelete(id) {
    const r = rows.find(x => x.id === id);
    if (!r) return;

    // demo: admin'i silme
    if (r.role === 'admin') {
      alert('Admin silinemez (demo).');
      return;
    }
    rows = rows.filter(x => x.id !== id);
    render();
  }

  function upsertFromForm() {
    const id = document.getElementById('userId').value || window.CrudUI.newId();
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const plan = document.getElementById('userPlan').value;
    const status = document.getElementById('userStatus').value;

    const permsRaw = document.getElementById('userPerms').value || '';
    const permissions = permsRaw
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);

    const existing = rows.find(x => x.id === id);
    if (existing) {
      Object.assign(existing, { name, email, role, plan, status, permissions });
    } else {
      rows.unshift({ id, name, email, role, plan, status, permissions });
    }
  }

  window.initUsers = function () {
    document.getElementById('btnNewUser')?.addEventListener('click', openNew);

    document.getElementById('userSearch')?.addEventListener('input', render);
    document.getElementById('roleFilter')?.addEventListener('change', render);

    document.getElementById('userForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      upsertFromForm();
      window.CrudUI.closeModal('userModal');
      render();
    });

    render();
  };
})();
