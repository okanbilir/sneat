// assets/js/app/auth.js
window.Auth = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  },
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    location.href = "auth-login-basic.html";
  }
};
