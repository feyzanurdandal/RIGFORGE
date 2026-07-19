(function () {
  "use strict";
  function parse(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }
  function countCart() {
    const keys = ["rigforgeCart", "cart", "RIGFORGECart", "selectedParts"];
    for (const key of keys) {
      const v = parse(key, null);
      if (Array.isArray(v))
        return v.reduce((n, x) => n + Number(x.quantity || 1), 0);
      if (v && typeof v === "object") return Object.keys(v).length;
    }
    return 0;
  }
  document
    .querySelectorAll("#headerCartCount")
    .forEach((b) => (b.textContent = String(countCart())));
  const user = parse("rigforgeUser", null);
  document.querySelectorAll(".profile-action").forEach((link) => {
    const wrap = document.createElement("div");
    wrap.className = "account-menu-wrap";
    link.parentNode.insertBefore(wrap, link);
    wrap.appendChild(link);
    link.href = user ? "profile.html" : "login.html";
    link.querySelector(".action-label").textContent = user
      ? user.name?.split(" ")[0] || "Hesabım"
      : "Giriş Yap";
    if (user) {
      link.setAttribute("aria-expanded", "false");
      const menu = document.createElement("div");
      menu.className = "account-dropdown";
      menu.hidden = true;
      menu.innerHTML =
        '<a href="profile.html">Profilim</a><a href="profile.html#orders">Siparişlerim</a><a href="kargo-takip.html">Kargo Takibi</a><button type="button" data-logout>Çıkış Yap</button>';
      wrap.appendChild(menu);
      link.addEventListener("click", (e) => {
        if (innerWidth > 820) {
          e.preventDefault();
          menu.hidden = !menu.hidden;
          link.setAttribute("aria-expanded", String(!menu.hidden));
        }
      });
      menu.querySelector("[data-logout]").onclick = () => {
        localStorage.removeItem("rigforgeUser");
        location.href = "index.html";
      };
      document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) {
          menu.hidden = true;
          link.setAttribute("aria-expanded", "false");
        }
      });
    }
  });
  window.addEventListener("storage", () => location.reload());
})();
