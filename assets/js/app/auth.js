(function () {
  'use strict';

  const USER_KEY = 'user';
  const TOKEN_KEY = 'token';

  function safeJsonParse(raw) {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function getUser() {
    return safeJsonParse(localStorage.getItem(USER_KEY));
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

  function isLoggedIn() {
    const token = getToken();
    const user = getUser();
    return !!(token && user && user.role);
  }

  function logout(redirect = 'auth-login-basic.html') {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = redirect;
  }

  window.Auth = { getUser, setUser, getToken, setToken, isLoggedIn, logout };
})();
