// assets/js/app/ui/navbar-user.js
(function () {
  'use strict';

  function prettyRole(role) {
    const map = {
      admin: 'Admin',
      accountant: 'Muhasebe',
      security: 'Güvenlik',
      owner: 'Daire Sahibi',
      tenant: 'Kiracı',
      resident: 'Kiracı',
      facility_manager: 'Tesis Yöneticisi',
      trainer: 'Eğitmen',
      staff_cleaning: 'Temizlik',
      staff_tech: 'Teknik'
    };
    return map[role] || role || '—';
  }

  window.NavbarUser = {
    render() {
      const user = window.Auth?.getUser?.();
      const name = user?.name || '—';
      const role = prettyRole(user?.role);

      const nameEl = document.getElementById('navUserName');
      const roleEl = document.getElementById('navUserRole');

      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = role;
    }
  };
})();
