// assets/js/app/guards.js
window.Guards = {
  run(root = document) {
    const user = Auth.getUser();
    if (!user) return;

    root.querySelectorAll("[data-role]").forEach(el => {
      if (el.dataset.role !== user.role) el.remove();
    });

    root.querySelectorAll("[data-permission]").forEach(el => {
      if (!user.permissions?.includes(el.dataset.permission)) el.remove();
    });

    root.querySelectorAll("[data-plan]").forEach(el => {
      if (user.plan !== el.dataset.plan) el.remove();
    });
  }
};
