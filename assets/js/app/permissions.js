// assets/js/app/permissions.js
// Tek kaynak: rol -> izin listesi

window.PERMS = {
  admin: [
    'DASHBOARD_VIEW',
    'FACILITY_VIEW',
    'FACILITY_MANAGE',
    'TICKETS_VIEW',
    'TICKETS_MANAGE',
    'PAYMENTS_VIEW',
    'PAYMENTS_MANAGE',
    'SETTINGS_VIEW',
    'SETTINGS_MANAGE'
  ],

  facility_manager: [
    'DASHBOARD_VIEW',
    'FACILITY_VIEW',
    'FACILITY_MANAGE',
    'TICKETS_VIEW',
    'TICKETS_MANAGE'
  ],

  accountant: [
    'DASHBOARD_VIEW',
    'PAYMENTS_VIEW',
    'PAYMENTS_MANAGE'
  ],

  security: [
    'DASHBOARD_VIEW',
    'VISITS_VIEW',
    'VISITS_MANAGE'
  ],

  owner: [
    'DASHBOARD_VIEW',
    'FACILITY_VIEW',
    'TICKETS_VIEW',
    'TICKETS_CREATE',
    'PAYMENTS_VIEW'
  ],

  tenant: [
    'DASHBOARD_VIEW',
    'FACILITY_VIEW',
    'TICKETS_VIEW',
    'TICKETS_CREATE',
    'PAYMENTS_VIEW'
  ],

  staff_cleaning: [
    'DASHBOARD_VIEW',
    'TICKETS_VIEW'
  ],

  staff_tech: [
    'DASHBOARD_VIEW',
    'TICKETS_VIEW'
  ]
};
