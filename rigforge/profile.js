(() => {
  "use strict";

  const API_PROFILE = "/api/profile";
  const API_ORDERS = "/api/orders";
  const token = localStorage.getItem("rigforgeToken");
  const rawUser = localStorage.getItem("rigforgeUser");

  if (!token || !rawUser) {
    location.replace("login.html");
    return;
  }

  let user = JSON.parse(rawUser);
  let addresses = [];
  let fetchedOrders = [];

  const authHeaders = (json = false) => ({
    Authorization: `Bearer ${token}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  });

  async function readJson(response) {
    const text = await response.text();
    if (!text) return {};
    try { return JSON.parse(text); } catch { return { message: text }; }
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    })[char]);
  }

  function updateUserUI() {
    document.getElementById("welcomeName").textContent = `Hoş geldin, ${user.name || "Kullanıcı"}`;
    document.getElementById("welcomeMail").textContent = user.email || "";
    const avatar = document.getElementById("avatar");
    if (avatar) {
      avatar.textContent = (user.name || "RF").split(" ").filter(Boolean)
        .map((x) => x[0]).slice(0, 2).join("").toUpperCase();
    }
    document.getElementById("profileName").value = user.name || "";
    document.getElementById("profileEmail").value = user.email || "";
    document.getElementById("profilePhone").value = user.phone || "";
  }

  const tabs = document.querySelectorAll(".tab-btn[data-tab]");
  const panels = document.querySelectorAll(".tab-panel");
  function openTab(id) {
    tabs.forEach((x) => x.classList.toggle("active", x.dataset.tab === id));
    panels.forEach((x) => x.classList.toggle("active", x.id === id));
    if (id === "orders" || id === "overview") fetchUserOrders();
    if (id === "addresses") fetchAddresses();
  }
  tabs.forEach((btn) => btn.addEventListener("click", () => openTab(btn.dataset.tab)));
  document.querySelectorAll("[data-open-tab]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openTab(link.dataset.openTab);
    })
  );

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.hidden = false; document.body.classList.add("modal-open"); }
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.hidden = true; document.body.classList.remove("modal-open"); }
  }
  document.querySelectorAll("[data-close-modal]").forEach((x) =>
    x.addEventListener("click", () => closeModal(x.dataset.closeModal))
  );

  async function fetchProfile() {
    try {
      const response = await window.RigForgeApi.fetch(API_PROFILE, {
        headers: authHeaders(),
      });
      const data = await readJson(response);
      if (response.status === 401) return logout();
      if (!response.ok) throw new Error(data.message || "Profil bilgileri alınamadı.");
      user = data;
      localStorage.setItem("rigforgeUser", JSON.stringify(user));
      updateUserUI();
    } catch (error) {
      console.error(error);
      updateUserUI();
    }
  }

  document.getElementById("profileForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("profileStatus");
    const submit = event.currentTarget.querySelector('button[type="submit"], button:not([type])');
    status.style.color = "#74afff";
    status.textContent = "Kaydediliyor...";
    if (submit) submit.disabled = true;

    try {
      const response = await window.RigForgeApi.fetch(API_PROFILE, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify({
          adSoyad: document.getElementById("profileName").value.trim(),
          email: document.getElementById("profileEmail").value.trim(),
          telefon: document.getElementById("profilePhone").value.trim(),
        }),
      });
      const data = await readJson(response);
      if (response.status === 401) return logout();
      if (!response.ok) throw new Error(data.message || "Bilgiler kaydedilemedi.");
      user = { name: data.name, email: data.email, phone: data.phone, role: data.role };
      localStorage.setItem("rigforgeUser", JSON.stringify(user));
      updateUserUI();
      status.style.color = "var(--green)";
      status.textContent = data.message || "Bilgiler kaydedildi.";
    } catch (error) {
      status.style.color = "var(--red)";
      status.textContent = error.message;
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  const addressList = document.getElementById("addressList");
  function renderAddresses() {
    if (!addressList) return;
    if (!addresses.length) {
      addressList.innerHTML = '<div class="empty-address">Henüz kayıtlı adresiniz yok.</div>';
      return;
    }
    addressList.innerHTML = addresses.map((a) => `
      <div class="address-card" data-address-id="${a.adresID}">
        <div>
          <strong>${escapeHtml(a.adresBasligi)}</strong>
          <p>${escapeHtml(a.ilce)} / ${escapeHtml(a.il)}</p>
          <small>${escapeHtml(a.acikAdres)}</small>
        </div>
        <div class="address-actions">
          <button class="mini-btn edit-address-btn" type="button" data-id="${a.adresID}">Düzenle</button>
          <button class="mini-btn danger-btn delete-address-btn" type="button" data-id="${a.adresID}">Sil</button>
        </div>
      </div>`).join("");
  }

  async function fetchAddresses() {
    try {
      const response = await window.RigForgeApi.fetch(`${API_PROFILE}/addresses`, {
        headers: authHeaders(),
      });
      const data = await readJson(response);
      if (response.status === 401) return logout();
      if (!response.ok) throw new Error(data.message || "Adresler alınamadı.");
      addresses = Array.isArray(data) ? data : [];
      renderAddresses();
    } catch (error) {
      if (addressList) addressList.innerHTML = `<div class="empty-address">${escapeHtml(error.message)}</div>`;
    }
  }

  document.getElementById("newAddressBtn")?.addEventListener("click", () => {
    document.getElementById("addressModalTitle").textContent = "Yeni Adres";
    document.getElementById("addressForm").reset();
    document.getElementById("addressId").value = "";
    document.getElementById("addressPhone").value = user.phone || "";
    openModal("addressModal");
  });

  addressList?.addEventListener("click", async (event) => {
    const edit = event.target.closest(".edit-address-btn");
    const del = event.target.closest(".delete-address-btn");
    if (edit) {
      const a = addresses.find((x) => String(x.adresID) === edit.dataset.id);
      if (!a) return;
      document.getElementById("addressModalTitle").textContent = "Adresi Düzenle";
      document.getElementById("addressId").value = a.adresID;
      document.getElementById("addressTitle").value = a.adresBasligi || "";
      document.getElementById("addressCity").value = a.il || "";
      document.getElementById("addressDistrict").value = a.ilce || "";
      document.getElementById("addressText").value = a.acikAdres || "";
      document.getElementById("addressPhone").value = user.phone || "";
      openModal("addressModal");
    }
    if (del && confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      try {
        const response = await window.RigForgeApi.fetch(`${API_PROFILE}/addresses/${del.dataset.id}`, {
          method: "DELETE", headers: authHeaders(),
        });
        const data = await readJson(response);
        if (!response.ok) throw new Error(data.message || "Adres silinemedi.");
        await fetchAddresses();
      } catch (error) { alert(error.message); }
    }
  });

  document.getElementById("addressForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const id = document.getElementById("addressId").value;
    const payload = {
      adresID: id ? Number(id) : 0,
      adresBasligi: document.getElementById("addressTitle").value.trim(),
      il: document.getElementById("addressCity").value.trim(),
      ilce: document.getElementById("addressDistrict").value.trim(),
      acikAdres: document.getElementById("addressText").value.trim(),
      postaKodu: null,
    };
    if (button) { button.disabled = true; button.textContent = "Kaydediliyor..."; }
    try {
      const response = await window.RigForgeApi.fetch(
        id ? `${API_PROFILE}/addresses/${id}` : `${API_PROFILE}/addresses`,
        { method: id ? "PUT" : "POST", headers: authHeaders(true), body: JSON.stringify(payload) }
      );
      const data = await readJson(response);
      if (response.status === 401) return logout();
      if (!response.ok) throw new Error(data.message || "Adres kaydedilemedi.");
      closeModal("addressModal");
      await fetchAddresses();
    } catch (error) { alert(error.message); }
    finally {
      if (button) { button.disabled = false; button.textContent = "Adresi Kaydet"; }
    }
  });

  const formatPrice = (value) => Number(value || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
  async function fetchUserOrders() {
    try {
      const response = await window.RigForgeApi.fetch(`${API_ORDERS}/my-orders`, { headers: authHeaders() });
      if (!response.ok) return;
      fetchedOrders = await response.json();
      renderOrdersTable(fetchedOrders);
    } catch (error) { console.error("Siparişler alınamadı:", error); }
  }
  function renderOrdersTable(orders) {
    const tableBody = document.querySelector("#orders table tbody");
    if (!tableBody) return;
    if (!orders?.length) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;">Henüz kayıtlı siparişiniz bulunmuyor.</td></tr>';
      return;
    }
    tableBody.innerHTML = orders.map((o) => `<tr><td><strong>${escapeHtml(o.orderNo)}</strong></td><td>${escapeHtml(o.date)}</td><td>${formatPrice(o.total)}</td><td><span class="status-warning">${escapeHtml(o.status)}</span></td><td><button class="mini-btn order-detail-btn" data-id="${o.orderId}">Detay</button></td></tr>`).join("");
  }

  function logout() {
    localStorage.removeItem("rigforgeToken");
    localStorage.removeItem("rigforgeUser");
    location.href = "login.html";
  }
  document.getElementById("logoutBtn")?.addEventListener("click", logout);

  updateUserUI();
  fetchProfile();
  fetchAddresses();
  fetchUserOrders();
})();
