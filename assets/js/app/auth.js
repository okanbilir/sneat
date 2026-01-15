// assets/js/app/auth.js
// Login sayfasi localStorage'a user + token yaziyor.
// Burasi sadece okuma/yonetim yardimcilari.
(function () {
  'use strict';

  const USER_KEY = 'user';
  const TOKEN_KEY = 'token';

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch (_) {
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function logout(redirect = 'auth-login-basic.html') {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = redirect;
  }

  window.Auth = { getUser, setUser, getToken, setToken, logout };
})();
