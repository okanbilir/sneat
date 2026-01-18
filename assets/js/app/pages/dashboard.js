window.initDashboard = function () {

  // ---- Statik (Dummy) Veriler ----
  const stats = {
    apartments: 128,
    residents: 312,
    facilities: 6,
    requests: 9
  };

  document.getElementById("stat-apartments").innerText = stats.apartments;
  document.getElementById("stat-residents").innerText = stats.residents;
  document.getElementById("stat-facilities").innerText = stats.facilities;
  document.getElementById("stat-requests").innerText = stats.requests;

  // ---- Aylık Aktivite Grafiği ----
  const activityEl = document.querySelector("#dashboardActivityChart");
  if (activityEl) {
    activityEl.innerHTML = "";
    new ApexCharts(activityEl, {
      chart: { type: "bar", height: 300 },
      series: [{
        name: "İşlem",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 80, 60, 55, 45]
      }],
      xaxis: {
        categories: ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"]
      }
    }).render();
  }

  // ---- Pie Chart ----
  const pieEl = document.querySelector("#dashboardPieChart");
  if (pieEl) {
    pieEl.innerHTML = "";
    new ApexCharts(pieEl, {
      chart: { type: "donut", height: 300 },
      labels: ["Kiracı", "Daire Sahibi", "Personel"],
      series: [200, 80, 32]
    }).render();
  }
};
