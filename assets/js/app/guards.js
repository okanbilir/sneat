// assets/js/app/guards.js
(function () {
  'use strict';

  function normalizeRole(role) {
    if (!role) return role;
    if (role === 'resident') return 'tenant';
    if (role === 'staff_technical') return 'staff_tech';
    return role;
  }

  function splitRoles(value) {
    if (!value) return [];
    return String(value)
      .split(/[,\s|]+/g)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Global helper
  window.hasPermission = function (permission) {
    try {
      const user = window.Auth?.getUser?.() || JSON.parse(localStorage.getItem('user') || 'null');
      const perms = user?.permissions || [];
      return perms.includes('*') || perms.includes(permission);
    } catch (_) {
      return false;
    }
  };

  function runPageGuards(root = document, user = null) {
    user = user || window.Auth?.getUser?.() || JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return;

    const effectiveRole = normalizeRole(user.role);
    const perms = Array.isArray(user.permissions) ? user.permissions : [];

    // Role guard
    root.querySelectorAll('[data-role]').forEach(el => {
      const targets = splitRoles(el.dataset.role);
      if (!targets.length) return;

      const roleMatches = targets.some(t => normalizeRole(t) === effectiveRole);
      if (!roleMatches) el.remove();
    });

    // Permission guard
    root.querySelectorAll('[data-permission]').forEach(el => {
      const p = el.dataset.permission;
      if (!p) return;
      const ok = perms.includes('*') || perms.includes(p);
      if (!ok) el.remove();
    });

    // Plan guard
    root.querySelectorAll('[data-plan]').forEach(el => {
      const plan = el.dataset.plan;
      if (plan && user.plan !== plan) el.remove();
    });
  }

  window.Guards = { run: runPageGuards, normalizeRole };
})();
