(() => {
  "use strict";

  const host = location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
  const candidates = [
    `http://${host}:5206`,
    `http://${host}:5000`,
    `https://${host}:7097`,
  ];

  let activeOrigin = sessionStorage.getItem("rigforgeApiOrigin") || "";

  async function apiFetch(path, options = {}) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const origins = activeOrigin
      ? [activeOrigin, ...candidates.filter((x) => x !== activeOrigin)]
      : candidates;
    let lastError = null;

    for (const origin of origins) {
      try {
        const response = await fetch(`${origin}${normalizedPath}`, options);
        activeOrigin = origin;
        sessionStorage.setItem("rigforgeApiOrigin", origin);
        return response;
      } catch (error) {
        lastError = error;
      }
    }

    const error = new Error(
      "API'ye ulaşılamadı. Visual Studio'da RigForge.API projesini çalıştırıp konsolda 5206, 5000 veya 7097 portlarından birinin açık olduğunu kontrol et."
    );
    error.cause = lastError;
    throw error;
  }

  window.RigForgeApi = {
    fetch: apiFetch,
    get origin() {
      return activeOrigin;
    },
  };
})();
