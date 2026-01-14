// assets/js/app/pages/dashboard.js
window.Pages = window.Pages || {};

window.Pages.dashboard = function () {
  // dashboard.html yüklendikten sonra çağrılır
  if (typeof window.initDashboard === "function") {
    window.initDashboard();
    window.dispatchEvent(new Event("resize"));
  }
};
