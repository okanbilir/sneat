// assets/js/app/menu.js
(function () {
  'use strict';

  const MENU_CONTAINER_ID = 'menu-area';
  const MENU_PARTIAL_PATH = 'partials/menu.html';
  let sneatInitDone = false;

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById(id);
      if (existing) return resolve();
      const s = document.createElement('script');
      s.id = id;
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Script yuklenemedi: ' + src));
      document.body.appendChild(s);
    });
  }

  async function initSneatAfterMenu() {
    // Sneat vendor menu + main, menu DOM geldikten sonra yuklenmeli.
    // Aksi halde PerfectScrollbar "no element" hatasi verebilir.
    if (sneatInitDone) {
      // Menu yeniden yuklendiyse yeniden boyutla
      window.dispatchEvent(new Event('resize'));
      return;
    }

    await loadScriptOnce('sneat-vendor-menu', 'assets/vendor/js/menu.js');
    await loadScriptOnce('sneat-main', 'assets/js/main.js');

    sneatInitDone = true;
  }

  function setActive(routeName) {
    document
      .querySelectorAll('#menu-area .menu-item')
      .forEach(li => li.classList.remove('active', 'open'));

    const link = document.querySelector(`#menu-area [data-route="${routeName}"]`);
    if (!link) return;

    const item = link.closest('.menu-item');
    item?.classList.add('active');

    const parent = item?.closest('.menu-sub')?.closest('.menu-item');
    parent?.classList.add('active', 'open');
  }

  function bindClicks() {
    document.querySelectorAll('#menu-area [data-route]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const routeName = a.dataset.route;
        window.Router.go(routeName);
        setActive(routeName);
      });
    });

    // Logout butonu (partial icinde olabilir)
    const logout = document.querySelector('#menu-area [data-action="logout"], #menu-area #logoutBtn');
    if (logout) {
      logout.addEventListener('click', e => {
        e.preventDefault();
        window.Auth.logout();
      });
    }
  }

  async function load() {
    const host = document.getElementById(MENU_CONTAINER_ID);
    if (!host) throw new Error(`#${MENU_CONTAINER_ID} bulunamadi`);

    const res = await fetch(MENU_PARTIAL_PATH);
    const html = await res.text();
    host.innerHTML = html;

    // role/permission filtreleri sadece menu alaninda
      window.Guards.run(host);

    // Sneat init (vendor menu + main) menu geldikten sonra
    await initSneatAfterMenu();

    bindClicks();
  }

  window.AppMenu = {
    load,
    setActive
  };
})();
