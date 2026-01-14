// assets/js/app/app.js
(function () {
  const user = window.Auth.getUser();
  if (!user) return window.location.href = "auth-login-basic.html";

  window.Menu.load().then(() => {
    window.Router.go("dashboard");
    window.Menu.setActive("dashboard");
  });
})();
