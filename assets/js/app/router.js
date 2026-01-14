// window.ROUTES = { ... } olarak globalde dursun
window.ROUTES = {
  // Dashboard
  dashboard: {
    title: "Dashboard",
    partial: "dashboard",
    roles: ["admin", "facility_manager", "accountant", "security", "resident", "trainer"],
    permissions: [], // gerekirse ekleriz
    onLoad: () => {
      window.initDashboard?.();
      window.dispatchEvent(new Event("resize"));
    }
  },

  // --- Sosyal Alanlar (Resident ekranları) ---
  facilities: {
    title: "Sosyal Alanlar",
    partial: "facilities/index",
    roles: ["resident", "admin", "facility_manager"],
    permissions: ["FACILITY_VIEW"],
    onLoad: () => window.initFacilities?.()
  },
  myBookings: {
    title: "Rezervasyonlarım",
    partial: "facilities/my-bookings",
    roles: ["resident"],
    permissions: ["FACILITY_BOOK"],
    onLoad: () => window.initMyBookings?.()
  },
  myClasses: {
    title: "Derslerim",
    partial: "facilities/my-classes",
    roles: ["resident"],
    permissions: ["FACILITY_VIEW"],
    onLoad: () => window.initMyClasses?.()
  },

  // --- Tesis Yönetimi (Admin/Facility Manager) ---
  facilitiesManage: {
    title: "Tesis Yönetimi",
    partial: "facilities/manage",
    roles: ["admin", "facility_manager"],
    permissions: ["FACILITY_MANAGE"],
    onLoad: () => window.initFacilitiesManage?.()
  },
  trainersManage: {
    title: "Eğitmen Yönetimi",
    partial: "facilities/trainers",
    roles: ["admin", "facility_manager"],
    permissions: ["FACILITY_MANAGE"],
    onLoad: () => window.initTrainersManage?.()
  },
  reservationsManage: {
    title: "Rezervasyon Yönetimi",
    partial: "facilities/reservations",
    roles: ["admin", "facility_manager"],
    permissions: ["FACILITY_MANAGE"],
    onLoad: () => window.initReservationsManage?.()
  },

  // --- Güvenlik (QR / Check-in) ---
  facilityCheckin: {
    title: "Tesis Giriş Kontrol",
    partial: "facilities/checkin",
    roles: ["security", "admin"],
    permissions: ["FACILITY_CHECKIN"],
    onLoad: () => window.initFacilityCheckin?.()
  },

  forbidden: {
    title: "Erişim Yok",
    partial: "forbidden",
    roles: ["admin", "facility_manager", "accountant", "security", "resident", "trainer"],
    permissions: [],
    onLoad: null
  }
};
