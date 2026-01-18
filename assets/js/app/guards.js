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

  function splitRoles(value) {
    if (!value) return [];
    return value
      .split(/[,|\s]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // root: guard uygulanacak DOM parcası (default: document)
  function runPageGuards(root = document, user = null) {
    user = user || window.Auth?.getUser?.();
    if (!user) return;

    const effectiveRole = user.role === 'resident' ? 'tenant' : user.role;

    // Role
    root.querySelectorAll('[data-role]').forEach(el => {
      const targets = splitRoles(el.dataset.role);
      if (!targets.length) return;

      // tenant/resident uyumlulugu
      const roleMatches = targets.some(t => {
        if (t === 'resident' && effectiveRole === 'tenant') return true;
        if (t === 'tenant' && user.role === 'resident') return true;
        return t === effectiveRole;
      });

      if (!roleMatches) el.remove();
    });

    // Permission
    root.querySelectorAll('[data-permission]').forEach(el => {
      const p = el.dataset.permission;
      const perms = user.permissions || [];
      const ok = perms.includes('*') || (p && perms.includes(p));
      if (p && !ok) el.remove();
    });

    // Plan
    root.querySelectorAll('[data-plan]').forEach(el => {
      const plan = el.dataset.plan;
      if (plan && user.plan !== plan) el.remove();
    });
  }

  window.Guards = { run: runPageGuards };
})();
