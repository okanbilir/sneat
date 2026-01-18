// assets/js/app/pages/dashboard.js
(function () {
  'use strict';

  // ---------- Helpers ----------
  function normalizeRole(role) {
    if (!role) return role;
    if (role === 'resident') return 'tenant';
    if (role === 'staff_technical') return 'staff_tech';
    return role;
  }

  // ApexCharts instance birikmesini engelle
  window.__charts = window.__charts || {};
  function destroyChart(key) {
    try {
      const inst = window.__charts[key];
      if (inst && typeof inst.destroy === 'function') inst.destroy();
    } catch (_) {}
    window.__charts[key] = null;
  }

  // ---------- Accountant Charts (Finance dashboard widgets) ----------
  function initAccountantCharts() {
    // 1) Tahsilat Trend (Line)
    const trendEl = document.querySelector('#acctCollectionChart');
    if (trendEl && window.ApexCharts) {
      destroyChart('acctCollectionChart');

      const options = {
        chart: { type: 'line', height: 320, toolbar: { show: false } },
        stroke: { width: 3, curve: 'smooth' },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4 },
        series: [{ name: 'Tahsilat', data: [12, 18, 14, 22, 19, 28, 24, 31, 26, 35, 33, 40] }],
        xaxis: { categories: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'] },
        yaxis: { labels: { formatter: (v) => '₺ ' + Math.round(v) + 'K' } },
        tooltip: { y: { formatter: (v) => '₺ ' + v + 'K' } }
      };

      window.__charts.acctCollectionChart = new ApexCharts(trendEl, options);
      window.__charts.acctCollectionChart.render();
    }

    // 2) Mini Sparkline (Area) -> özel bir div id önerilir.
    // Eğer sen "#acctMiniSpark" kartının içine chart basacaksan içeride bir div kullan:
    // <div id="acctMiniSparkChart"></div>
    const sparkEl = document.querySelector('#acctMiniSparkChart');
    if (sparkEl && window.ApexCharts) {
      destroyChart('acctMiniSparkChart');

      const sparkOptions = {
        chart: { type: 'area', height: 90, sparkline: { enabled: true } },
        stroke: { width: 2, curve: 'smooth' },
        dataLabels: { enabled: false },
        series: [{ name: 'Günlük', data: [5, 12, 9, 18, 14, 22, 19, 27, 23, 30] }],
        tooltip: { enabled: true }
      };

      window.__charts.acctMiniSparkChart = new ApexCharts(sparkEl, sparkOptions);
      window.__charts.acctMiniSparkChart.render();
    }
  }

  // ---------- Main initDashboard ----------
  // Router -> dashboard route onLoad burayı çağırıyor.
  window.initDashboard = function () {
    const user = window.Auth?.getUser?.();
    const role = normalizeRole(user?.role);

    // Role'e göre dashboard init fonksiyonları (partials içinde varsa)
    try {
      if (role === 'admin') {
        window.initAdminDashboard?.();
        return;
      }

      if (role === 'accountant') {
        // Muhasebe dashboard partial'ı açıkken chartlar
        initAccountantCharts();
        window.initAccountantDashboard?.();
        return;
      }

      if (role === 'security') {
        window.initSecurityDashboard?.();
        return;
      }

      if (role === 'staff_tech') {
        window.initStaffTechDashboard?.();
        return;
      }

      if (role === 'staff_cleaning') {
        window.initStaffCleaningDashboard?.();
        return;
      }

      if (role === 'owner') {
        window.initOwnerDashboard?.();
        return;
      }

      // default tenant
      window.initTenantDashboard?.();
    } catch (err) {
      console.warn('Dashboard init hata:', err);
    }
  };
})();
