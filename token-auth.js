/**
 * token-auth.js
 * Final clean auth – token khusus milik lu
 */

(function () {
  "use strict";

  // ===== CONFIG =====
  const VALID_TOKEN = "GUWEGANTENGBANGET"; // TOKEN PUNYA LU
  const TOKEN_QUERY_KEY = "token";
  const TOKEN_STORAGE_KEY = "token";
  const BLOCK_MESSAGE = "Akses Ditolak";

  // ===== HELPERS =====
  function getQueryParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch {
      return null;
    }
  }

  function getToken() {
    return (
      getQueryParam(TOKEN_QUERY_KEY) ||
      localStorage.getItem(TOKEN_STORAGE_KEY)
    );
  }

  function isValidToken(token) {
    return token === VALID_TOKEN;
  }

  function block(reason) {
    console.warn("Auth blocked:", reason);
    document.documentElement.innerHTML =
      `<h2 style="font-family:sans-serif;text-align:center;margin-top:20vh;">
        ${BLOCK_MESSAGE}
      </h2>`;
  }

  function allow(token) {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {}
    document.documentElement.classList.add("auth-ok");
    console.log("Auth success");
  }

  // ===== MAIN =====
  function initAuth() {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const token = getToken();
    if (!isValidToken(token)) {
      block("Token tidak valid");
      return;
    }

    allow(token);
  }

  initAuth();
})();