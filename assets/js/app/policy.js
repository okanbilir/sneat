(function () {
  'use strict';

  const ROLE_PERMS = {
    admin: ['*'],

    accountant: [
      'DUES_VIEW','LEDGER_VIEW','DEBT_VIEW','REPORTS_VIEW',
      'DUES_PAY','LEDGER_MANAGE','DEBT_MANAGE','REPORTS_MANAGE',
      'USER_VIEW'
    ],

    security: [
      'VISITS_VIEW','VISITS_MANAGE',
      'FACILITY_CHECKIN'
    ],

    owner: [
      'DUES_VIEW','LEDGER_VIEW','DEBT_VIEW','REPORTS_VIEW',
      'DUES_PAY',
      'FACILITY_VIEW'
    ],

    tenant: [
      'DUES_VIEW','LEDGER_VIEW','DEBT_VIEW',
      'DUES_PAY',
      'FACILITY_VIEW'
    ],

    staff_tech: [
      'FACILITY_VIEW'
    ],

    staff_cleaning: [
      'FACILITY_VIEW'
    ],

    facility_manager: [
      'FACILITY_VIEW','FACILITY_MANAGE'
    ]
  };

  window.Policy = {
    getRolePerms(role) {
      return ROLE_PERMS[role] || [];
    }
  };
})();
