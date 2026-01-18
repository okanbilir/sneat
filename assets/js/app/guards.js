// assets/js/app/guards.js
// assets/js/app/guards.js

window.hasPermission = function (permission) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || localStorage.getItem('role') || 'tenant';
    const rolePerms = (window.PERMS && window.PERMS[role]) ? window.PERMS[role] : [];
    return rolePerms.includes(permission);
  } catch (e) {
    return false;
  }
};

(function () {
  'use strict';

  // root: guard uygulanacak DOM parcası (default: document)
  function runPageGuards(root = document, user = null) {
    user = user || window.Auth?.getUser?.();
    if (!user) return;

    const effectiveRole = user.role === 'resident' ? 'tenant' : user.role;

    // Role
    root.querySelectorAll('[data-role]').forEach(el => {
      const target = el.dataset.role;
      // tenant/resident uyumlulugu
      if (target === 'resident' && effectiveRole === 'tenant') return;
      if (target === 'tenant' && user.role === 'resident') return;
      if (target !== effectiveRole) el.remove();
    });

    // Permission
    root.querySelectorAll('[data-permission]').forEach(el => {
      const p = el.dataset.permission;
      if (p && !user.permissions?.includes(p)) el.remove();
    });

    // Plan
    root.querySelectorAll('[data-plan]').forEach(el => {
      const plan = el.dataset.plan;
      if (plan && user.plan !== plan) el.remove();
    });
  }

  window.Guards = { run: runPageGuards };
})();
