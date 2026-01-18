// assets/js/app/router.js
(function () {
  'use strict';

  // --- Role alias ---
  function normalizeRole(role) {
    if (!role) return role;
    if (role === 'resident') return 'tenant';
    if (role === 'staff_technical') return 'staff_tech';
    return role;
  }

  // --- Permission helper (OR destekli) ---
  // required: ["A|B", "C"] -> mode 'all' ise (A veya B) VE C gerekir
  // mode 'any' ise (A veya B) veya C yeter
  function hasPermissions(user, required = [], mode = 'all') {
    if (!required || !required.length) return true;

    const perms = user?.permissions || [];
    if (perms.includes('*')) return true;

    const matchExpr = (expr) => {
      const alts = String(expr)
        .split('|')
        .map(s => s.trim())
        .filter(Boolean);
      return alts.some(p => perms.includes(p));
    };

    if (mode === 'any') return required.some(matchExpr);
    return required.every(matchExpr);
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
      staff_cleaning: 'dashboards/staff-cleaning',
      staff_tech: 'dashboards/staff-tech'
    };
    return map[r] || 'dashboards/tenant';
  }

  // ---------------- ROUTES ----------------
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

    // -------- Finans / Aidat --------
    dues: {
      title: 'Aidat',
      partial: 'finance/dues',
      roles: ['tenant', 'owner', 'admin', 'accountant'],
      // SELF veya SITE görme yetkisi
      permissions: ['DUES_SELF_VIEW|DUES_SITE_VIEW'],
      onLoad: () => window.initDues?.()
    },
    ledger: {
      title: 'Hesap Hareketleri',
      partial: 'finance/ledger',
      roles: ['tenant', 'owner', 'admin', 'accountant'],
      permissions: ['LEDGER_SELF_VIEW|LEDGER_SITE_VIEW'],
      onLoad: () => window.initLedger?.()
    },
    debts: {
      title: 'Borç / Alacak',
      partial: 'finance/debts',
      roles: ['tenant', 'owner', 'admin', 'accountant'],
      permissions: ['DEBT_SELF_VIEW|DEBT_SITE_VIEW'],
      onLoad: () => window.initDebts?.()
    },
    reports: {
      title: 'Raporlar',
      partial: 'finance/reports',
      roles: ['owner', 'admin', 'accountant'],
      permissions: ['REPORTS_SELF_VIEW|REPORTS_SITE_VIEW'],
      onLoad: () => window.initReports?.()
    },

    // -------- Güvenlik --------
    visits: {
      title: 'Giriş / Çıkış',
      partial: 'security/visits',
      roles: ['security', 'admin', 'facility_manager'],
      permissions: ['VISITS_VIEW'],
      onLoad: () => window.initVisits?.()
    },


    // --- Ziyaretçi --- SİL
    visitors: {
      title: 'Ziyaretçi Bildir',
      partial: 'visitors/index',
      roles: ['tenant','owner'],
      permissions: ['VISITOR_CREATE|VISITOR_SELF_VIEW'],
      onLoad: () => window.initVisitors?.()
    },
    visitorsManage: {
      title: 'Ziyaretçi Yönetimi',
      partial: 'visitors/manage',
      roles: ['security','admin'],
      permissions: ['VISITOR_MANAGE'],
      onLoad: () => window.initVisitorsManage?.()
    },
// //////////////////// SİL

    operations: {
      title: 'Operasyon Merkezi',
      partial: 'operations/index',
      roles: ['security','admin'],
      permissions: ['VISITOR_MANAGE|PARCEL_MANAGE|FOOD_MANAGE'],
      onLoad: () => window.initOperations?.()
    },


    // -------- Sosyal Alanlar --------
    facilities: {
      title: 'Sosyal Alanlar',
      partial: 'facilities/index',
      roles: ['tenant', 'owner', 'admin', 'facility_manager', 'trainer'],
      permissions: ['FACILITY_VIEW'],
      onLoad: () => window.initFacilities?.()
    },
    myBookings: {
      title: 'Rezervasyonlarım',
      partial: 'facilities/my-bookings',
      roles: ['tenant', 'owner'],
      permissions: ['FACILITY_BOOK'],
      onLoad: () => window.initMyBookings?.()
    },
    myClasses: {
      title: 'Derslerim',
      partial: 'facilities/my-classes',
      roles: ['tenant', 'owner', 'trainer'],
      permissions: ['FACILITY_VIEW'],
      onLoad: () => window.initMyClasses?.()
    },

    facilitiesManage: {
      title: 'Tesis Yönetimi',
      partial: 'facilities/manage',
      roles: ['admin', 'facility_manager'],
      permissions: ['FACILITY_MANAGE'],
      onLoad: () => window.initFacilitiesManage?.()
    },
    trainersManage: {
      title: 'Eğitmen Yönetimi',
      partial: 'facilities/trainers',
      roles: ['admin', 'facility_manager'],
      permissions: ['FACILITY_MANAGE'],
      onLoad: () => window.initTrainersManage?.()
    },
    reservationsManage: {
      title: 'Rezervasyon Yönetimi',
      partial: 'facilities/reservations',
      roles: ['admin', 'facility_manager'],
      permissions: ['FACILITY_MANAGE'],
      onLoad: () => window.initReservationsManage?.()
    },

    facilityCheckin: {
      title: 'Tesis Giriş Kontrol',
      partial: 'facilities/checkin',
      roles: ['security', 'admin'],
      permissions: ['FACILITY_CHECKIN'],
      onLoad: () => window.initFacilityCheckin?.()
    },
    // --- Duyurular ---
    announcements: {
      title: 'Duyurular',
      partial: 'announcements/index',
      roles: ['tenant','owner','admin','accountant','security','facility_manager','trainer','staff_cleaning','staff_tech'],
      permissions: ['ANNOUNCEMENT_VIEW|ANNOUNCEMENT_MANAGE'],
      onLoad: () => window.initAnnouncements?.()
    },
    announcementsManage: {
      title: 'Duyuru Yönetimi',
      partial: 'announcements/manage',
      roles: ['admin','facility_manager','accountant'],
      permissions: ['ANNOUNCEMENT_MANAGE'],
      onLoad: () => window.initAnnouncementsManage?.()
    },

    // --- Kullanıcı Yönetimi (Admin/Muhasebe) ---
    users: {
      title: 'Kullanıcılar',
      partial: 'admin/users',
      roles: ['admin','accountant'],
      permissions: ['USER_VIEW'],
      onLoad: () => window.initUsers?.()
    },

    // --- Bakım / İş Emri ---
    maintenance: {
      title: 'Bakım / İş Emirleri',
      partial: 'maintenance/index',
      roles: ['tenant','owner','admin','staff_cleaning','staff_tech'],
      permissions: ['MAINTENANCE_VIEW|MAINTENANCE_MANAGE'],
      onLoad: () => window.initMaintenance?.()
    },
    maintenanceManage: {
      title: 'İş Emri Yönetimi',
      partial: 'maintenance/manage',
      roles: ['admin','staff_cleaning','staff_tech'],
      permissions: ['MAINTENANCE_MANAGE'],
      onLoad: () => window.initMaintenanceManage?.()
    },
    // --- Kargo ---
    parcels: {
      title: 'Kargolarım',
      partial: 'parcels/index',
      roles: ['tenant', 'owner'],
      permissions: ['PARCEL_SELF_VIEW'],
      onLoad: () => window.initParcels?.()
    },
    parcelsManage: {
      title: 'Kargo Yönetimi',
      partial: 'parcels/manage',
      roles: ['security', 'admin'],
      permissions: ['PARCEL_MANAGE'],
      onLoad: () => window.initParcelsManage?.()
    },

    forbidden: {
      title: 'Erişim Yok',
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
      onLoad: () => window.initForbidden?.()
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
          window.Guards?.run?.(container, window.Auth.getUser());
          if (typeof this.pendingOnLoad === 'function') {
            setTimeout(() => {
              this.pendingOnLoad && this.pendingOnLoad();
              window.dispatchEvent(new Event('resize'));
            }, 50);
          }
          window.__pendingOnLoad = null;
        })
        .catch(err => {
          console.error('Partial yuklenemedi:', err);
        });
    },

    go(routeName) {
      const user = window.Auth?.getUser?.();
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

      // Role kontrol
      if (route.roles && !route.roles.includes(role)) {
        this.pendingOnLoad = null;
        return this.loadPage('forbidden');
      }

      // Permission kontrol (OR destekli)
      if (route.permissions?.length) {
        const ok = hasPermissions(user, route.permissions, 'all'); // her expr kendi icinde OR olabilir
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
