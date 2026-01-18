// assets/js/app/pages/dashboard.js
(function () {
  'use strict';

  function normalizeRole(role) {
    if (!role) return role;
    if (role === 'resident') return 'tenant';
    if (role === 'staff_technical') return 'staff_tech';
    return role;
  }

  // Chart instance'ları biriktirmemek için
  window.__charts = window.__charts || {};

  function destroyChart(key) {
    try {
      if (window.__charts[key]) {
        window.__charts[key].destroy();
        window.__charts[key] = null;
      }
    } catch (_) {}
  }

  function setTextIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  }
  // --- Admin dashboard grafik/stat ---
  function initAdminDashboard() {
    // Statik (Dummy) Veriler
    const stats = {
      apartments: 128,
      residents: 312,
      facilities: 6,
      requests: 9
    };

    setTextIfExists('stat-apartments', stats.apartments);
    setTextIfExists('stat-residents', stats.residents);
    setTextIfExists('stat-facilities', stats.facilities);
    setTextIfExists('stat-requests', stats.requests);

    // Aylık Aktivite Grafiği
    const activityEl = document.querySelector('#dashboardActivityChart');
    if (activityEl && window.ApexCharts) {
      destroyChart('dashboardActivityChart');
      activityEl.innerHTML = '';

      window.__charts.dashboardActivityChart = new ApexCharts(activityEl, {
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        series: [{ name: 'İşlem', data: [30, 40, 35, 50, 49, 60, 70, 91, 80, 60, 55, 45] }],
        xaxis: { categories: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'] }
      });
      window.__charts.dashboardActivityChart.render();
    }

    // Pie Chart
    const pieEl = document.querySelector('#dashboardPieChart');
    if (pieEl && window.ApexCharts) {
      destroyChart('dashboardPieChart');
      pieEl.innerHTML = '';

      window.__charts.dashboardPieChart = new ApexCharts(pieEl, {
        chart: { type: 'donut', height: 300 },
        labels: ['Kiracı', 'Daire Sahibi', 'Personel'],
        series: [200, 80, 32]
      });
      window.__charts.dashboardPieChart.render();
    }
  }
  // --- Accountant dashboard grafik ---
  function initAccountantDashboard() {
    // Tahsilat Trend (Line)
    const trendEl = document.querySelector('#acctCollectionChart');
    if (trendEl && window.ApexCharts) {
      destroyChart('acctCollectionChart');

      window.__charts.acctCollectionChart = new ApexCharts(trendEl, {
        chart: { type: 'line', height: 320, toolbar: { show: false } },
        stroke: { width: 3, curve: 'smooth' },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4 },
        series: [{ name: 'Tahsilat', data: [12, 18, 14, 22, 19, 28, 24, 31, 26, 35, 33, 40] }],
        xaxis: { categories: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'] },
        yaxis: { labels: { formatter: (v) => '₺ ' + Math.round(v) + 'K' } },
        tooltip: { y: { formatter: (v) => '₺ ' + v + 'K' } }
      });
      window.__charts.acctCollectionChart.render();
    }

    // Mini Sparkline (Area)
    const sparkEl = document.querySelector('#acctMiniSpark');
    if (sparkEl && window.ApexCharts) {
      destroyChart('acctMiniSpark');

      window.__charts.acctMiniSpark = new ApexCharts(sparkEl, {
        chart: { type: 'area', height: 90, sparkline: { enabled: true } },
        stroke: { width: 2, curve: 'smooth' },
        dataLabels: { enabled: false },
        series: [{ name: 'Günlük', data: [5, 12, 9, 18, 14, 22, 19, 27, 23, 30] }],
        tooltip: { enabled: true }
      });
      window.__charts.acctMiniSpark.render();
    }
  }
  // --- Security dashboard grafik/stat ---
  function initSecurityDashboard() {
    // Saatlik yoğunluk (bar)
    const hourlyEl = document.querySelector('#secHourlyChart');
    if (hourlyEl && window.ApexCharts) {
      destroyChart('secHourlyChart');
      window.__charts.secHourlyChart = new ApexCharts(hourlyEl, {
        chart: { type: 'bar', height: 320, toolbar: { show: false } },
        series: [{ name: 'Kayıt', data: [4, 6, 3, 8, 10, 14, 12, 18, 16, 11, 9, 7] }],
        xaxis: { categories: ['08','09','10','11','12','13','14','15','16','17','18','19'] },
        grid: { strokeDashArray: 4 }
      });
      window.__charts.secHourlyChart.render();
    }

    // Mini sparkline (area)
    const sparkEl = document.querySelector('#secMiniSpark');
    if (sparkEl && window.ApexCharts) {
      destroyChart('secMiniSpark');
      window.__charts.secMiniSpark = new ApexCharts(sparkEl, {
        chart: { type: 'area', height: 90, sparkline: { enabled: true } },
        stroke: { width: 2, curve: 'smooth' },
        dataLabels: { enabled: false },
        series: [{ name: 'Yoğunluk', data: [3, 7, 5, 9, 8, 12, 10, 15, 11, 14] }],
        tooltip: { enabled: true }
      });
      window.__charts.secMiniSpark.render();
    }
  }
  // --- Tek giriş noktası ---
  window.initDashboard = function () {
    const user = window.Auth?.getUser?.();
    const role = normalizeRole(user?.role);

    // Hangi dashboard açık ise, sadece onu init et
    if (role === 'admin') initAdminDashboard();
    if (role === 'accountant') initAccountantDashboard();
    if (role === 'security') initSecurityDashboard();

  };
})();
