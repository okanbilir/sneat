// assets/js/app/app.js
(function () {
  'use strict';

  // Auth zorunlu
  const user = window.Auth?.getUser?.();
  if (!user) {
    window.location.href = 'auth-login-basic.html';
    return;
  }
  window.NavbarUser?.render?.();

  // Logout (navbar)
  function bindLogout() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.Auth.logout();
    });
  }

  bindLogout();

  // Menu yukle -> varsayilan sayfa
  window.AppMenu
    .load()
    .then(() => {
      // Default ekran
      window.Router.go('dashboard');
      window.AppMenu.setActive('dashboard');
    })
    .catch(err => console.error('App baslatilamadi:', err));
})();
