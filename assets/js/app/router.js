// assets/js/app/router.js
// 1) Route tanimlari (window.ROUTES)
// 2) Minimal SPA router (window.Router)
(function () {
  'use strict';

  // --- Role alias (eski isimler) ---
  function normalizeRole(role) {
    if (!role) return role;
    if (role === 'resident') return 'tenant';
    return role;
  }

  function dashboardPartialFor(user) {
    const r = normalizeRole(user?.role);
    const map = {
      admin: 'dashboards/admin',
      facility_manager: 'dashboards/facility_manager',
      accountant: 'dashboards/accountant',
      security: 'dashboards/security',
      trainer: 'dashboards/trainer',
      owner: 'dashboards/owner',
      tenant: 'dashboards/tenant',
      staff_cleaning: 'dashboards/staff_cleaning',
      staff_tech: 'dashboards/staff_tech'
    };
    return map[r] || 'dashboards/tenant';
  }

  // window.ROUTES = { ... } global
  window.ROUTES = {
    dashboard: {
      title: 'Dashboard',
      partial: () => dashboardPartialFor(window.Auth.getUser()),
      roles: [
        'admin',
        'facility_manager',
        'accountant',
        'security',
        'tenant',
        'owner',
        'trainer',
        'staff_cleaning',
        'staff_tech'
      ],
      permissions: [],
      onLoad: () => {
        // Dashboard chart'lari
        window.initDashboard?.();
        window.dispatchEvent(new Event('resize'));
      }
    },

    // --- Sosyal Alanlar ---
    facilities: {
      title: 'Sosyal Alanlar',
      partial: 'facilities/index',
      roles: ['tenant', 'owner', 'admin', 'facility_manager'],
      permissions: ['FACILITY_VIEW'],
      onLoad: () => window.initFacilities?.()
    },
    myBookings: {
      title: 'Rezervasyonlarim',
      partial: 'facilities/my-bookings',
      roles: ['tenant', 'owner'],
      permissions: ['FACILITY_BOOK'],
      onLoad: () => window.initMyBookings?.()
    },
    myClasses: {
      title: 'Derslerim',
      partial: 'facilities/my-classes',
      roles: ['tenant', 'owner'],
      permissions: ['FACILITY_VIEW'],
      onLoad: () => window.initMyClasses?.()
    },

    // --- Tesis Yonetimi ---
    facilitiesManage: {
      title: 'Tesis Yonetimi',
      partial: 'facilities/manage',
      roles: ['admin', 'facility_manager'],
      permissions: ['FACILITY_MANAGE'],
      onLoad: () => window.initFacilitiesManage?.()
    },
    trainersManage: {
      title: 'Egitmen Yonetimi',
      partial: 'facilities/trainers',
      roles: ['admin', 'facility_manager'],
      permissions: ['FACILITY_MANAGE'],
      onLoad: () => window.initTrainersManage?.()
    },
    reservationsManage: {
      title: 'Rezervasyon Yonetimi',
      partial: 'facilities/reservations',
      roles: ['admin', 'facility_manager'],
      permissions: ['FACILITY_MANAGE'],
      onLoad: () => window.initReservationsManage?.()
    },

    // --- Guvenlik (check-in) ---
    facilityCheckin: {
      title: 'Tesis Giris Kontrol',
      partial: 'facilities/checkin',
      roles: ['security', 'admin'],
      permissions: ['FACILITY_CHECKIN'],
      onLoad: () => window.initFacilityCheckin?.()
    },

    forbidden: {
      title: 'Erisim Yok',
      partial: 'forbidden',
      roles: [
        'admin',
        'facility_manager',
        'accountant',
        'security',
        'tenant',
        'owner',
        'trainer',
        'staff_cleaning',
        'staff_tech'
      ],
      permissions: [],
      onLoad: null
    }
  };

  // ---------------- Router core ----------------
  window.Router = {
    pendingOnLoad: null,

    loadPage(partialPath) {
      const url = `partials/${partialPath}.html`;
      return fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`${url} -> ${res.status}`);
          return res.text();
        })
        .then(html => {
          const container = document.getElementById('content-area');
          if (!container) throw new Error('#content-area bulunamadi');
          container.innerHTML = html;

          // Guard filtreleri
          window.Guards.run(container, window.Auth.getUser());

          // route'a ozel JS
          if (typeof this.pendingOnLoad === 'function') {
            setTimeout(() => {
              this.pendingOnLoad();
              window.dispatchEvent(new Event('resize'));
            }, 50);
          }
          this.pendingOnLoad = null;
        })
        .catch(err => {
          console.error('Partial yuklenemedi:', err);
        });
    },

    go(routeName) {
      const user = window.Auth.getUser();
      if (!user) {
        window.location.href = 'auth-login-basic.html';
        return;
      }

      const role = normalizeRole(user.role);
      const route = window.ROUTES?.[routeName];
      if (!route) {
        this.pendingOnLoad = null;
        return this.loadPage('forbidden');
      }

      // role kontrol
      if (route.roles && !route.roles.includes(role)) {
        this.pendingOnLoad = null;
        return this.loadPage('forbidden');
      }

      // permission kontrol (opsiyonel)
      if (route.permissions?.length) {
        const ok = route.permissions.every(p => user.permissions?.includes(p));
        if (!ok) {
          this.pendingOnLoad = null;
          return this.loadPage('forbidden');
        }
      }

      document.title = route.title || 'Admin';
      this.pendingOnLoad = typeof route.onLoad === 'function' ? route.onLoad : null;

      const partial = typeof route.partial === 'function' ? route.partial() : route.partial;
      window.AppMenu?.setActive?.(routeName);
      return this.loadPage(partial);
    }
  };
})();
