// assets/js/app/router.js
(function () {
  'use strict';

  // --- Role alias (eski isimler) ---
  function normalizeRole(role) {
    if (!role) return role;
    if (role === 'resident') return 'tenant';
    if (role === 'staff_technical') return 'staff_tech';
    return role;
  }

  // --- Permission helper ---
  function hasAllPermissions(user, required = []) {
    if (!required || !required.length) return true;
    const perms = user?.permissions || [];
    if (perms.includes('*')) return true;
    return required.every(p => perms.includes(p));
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
      // dosya adlari kebab-case
      staff_cleaning: 'dashboards/staff-cleaning',
      staff_tech: 'dashboards/staff-tech'
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
        window.initDashboard?.();
        window.dispatchEvent(new Event('resize'));
      }
    },

    // --- Finans / Aidat ---
    dues: {
      title: 'Aidat',
      partial: 'finance/dues',
      roles: ['tenant', 'owner', 'admin', 'accountant'],
      permissions: ['DUES_VIEW'],
      onLoad: () => window.initDues?.()
    },
    ledger: {
      title: 'Hesap Hareketleri',
      partial: 'finance/ledger',
      roles: ['tenant', 'owner', 'admin', 'accountant'],
      permissions: ['LEDGER_VIEW'],
      onLoad: () => window.initLedger?.()
    },
    debts: {
      title: 'Borç / Alacak',
      partial: 'finance/debts',
      roles: ['tenant', 'owner', 'admin', 'accountant'],
      permissions: ['DEBT_VIEW'],
      onLoad: () => window.initDebts?.()
    },
    reports: {
      title: 'Raporlar',
      partial: 'finance/reports',
      roles: ['owner', 'admin', 'accountant'],
      permissions: ['REPORTS_VIEW'],
      onLoad: () => window.initReports?.()
    },

    // --- Güvenlik (genel) ---
    visits: {
      title: 'Giriş / Çıkış',
      partial: 'security/visits',
      roles: ['security', 'admin'],
      permissions: ['VISITS_VIEW'],
      onLoad: () => window.initVisits?.()
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
        'admin','facility_manager','accountant','security',
        'tenant','owner','trainer','staff_cleaning','staff_tech'
      ],
      permissions: [],
      onLoad: () => window.initForbidden?.()
    },
    
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

          // Guard filtreleri (menu/button vb data-permission/data-role)
          window.Guards.run(container, window.Auth.getUser());

          // route'a ozel JS
          const fn = this.pendingOnLoad;
          this.pendingOnLoad = null;

          if (typeof fn === 'function') {
            setTimeout(() => {
              try {
                fn();
              } finally {
                window.dispatchEvent(new Event('resize'));
              }
            }, 50);
          }
        })
        .catch(err => {
          console.error('Partial yuklenemedi:', err);
          // Partial patlarsa da forbidden'a dusmek daha iyi
          // (sonsuz loop olmasin diye kontrol)
          if (partialPath !== 'forbidden') {
            this.pendingOnLoad = null;
            return this.loadPage('forbidden');
          }
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
        // route yoksa forbidden
        document.title = 'Erisim Yok';
        this.pendingOnLoad = null;
        window.AppMenu?.setActive?.('forbidden');
        return this.loadPage('forbidden');
      }

      // role kontrol
      if (route.roles && !route.roles.includes(role)) {
        document.title = 'Erisim Yok';
        this.pendingOnLoad = null;
        window.AppMenu?.setActive?.('forbidden');
        return this.loadPage('forbidden');
      }

      // permission kontrol
      if (!hasAllPermissions(user, route.permissions || [])) {
        document.title = 'Erisim Yok';
        this.pendingOnLoad = null;
        window.AppMenu?.setActive?.('forbidden');
        return this.loadPage('forbidden');
      }

      document.title = route.title || 'Admin';
      this.pendingOnLoad = typeof route.onLoad === 'function' ? route.onLoad : null;

      const partial = typeof route.partial === 'function' ? route.partial() : route.partial;
      window.AppMenu?.setActive?.(routeName);
      return this.loadPage(partial);
    }
  };
})();
