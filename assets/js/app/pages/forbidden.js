// assets/js/app/pages/forbidden.js
(function () {
  'use strict';

  window.initForbidden = function () {
    const user = window.Auth?.getUser?.();
    const nameEl = document.getElementById('fbUserName');
    const roleEl = document.getElementById('fbUserRole');

    if (nameEl) nameEl.innerText = user?.name || '—';
    if (roleEl) roleEl.innerText = user?.role || '—';

    document.getElementById('btnLogoutFromForbidden')?.addEventListener('click', () => {
      window.Auth?.logout?.('auth-login-basic.html');
    });
  };
})();
