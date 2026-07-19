(() => {
  "use strict";
  const rawUser = localStorage.getItem("rigforgeUser");
  if (!rawUser) {
    location.replace("login.html");
    return;
  }
  const user = JSON.parse(rawUser);
  const tabs = document.querySelectorAll(".tab-btn[data-tab]");
  const panels = document.querySelectorAll(".tab-panel");

  function openTab(id) {
    tabs.forEach((x) => x.classList.toggle("active", x.dataset.tab === id));
    panels.forEach((x) => x.classList.toggle("active", x.id === id));
  }
  tabs.forEach((btn) =>
    btn.addEventListener("click", () => openTab(btn.dataset.tab)),
  );
  document.querySelectorAll("[data-open-tab]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openTab(link.dataset.openTab);
    }),
  );

  document.getElementById("welcomeName").textContent =
    `Hoş geldin, ${user.name}`;
  document.getElementById("welcomeMail").textContent = user.email;
  document.getElementById("avatar").textContent = (user.name || "RF")
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  document.getElementById("profileName").value = user.name || "";
  document.getElementById("profileEmail").value = user.email || "";
  document.getElementById("profilePhone").value = user.phone || "";

  document
    .getElementById("profileForm")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const updated = {
        name: document.getElementById("profileName").value.trim(),
        email: document.getElementById("profileEmail").value.trim(),
        phone: document.getElementById("profilePhone").value.trim(),
      };
      localStorage.setItem("rigforgeUser", JSON.stringify(updated));
      localStorage.setItem("rigforgeRegisteredUser", JSON.stringify(updated));
      const status = document.getElementById("profileStatus");
      status.style.color = "var(--green)";
      status.textContent = "Bilgiler kaydedildi.";
    });

  const defaultAddresses = [
    {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: "Ev Adresi",
      city: "Bursa",
      district: "Nilüfer",
      text: "",
      phone: "",
    },
  ];
  let addresses;
  try {
    addresses =
      JSON.parse(localStorage.getItem("rigforgeAddresses")) || defaultAddresses;
  } catch {
    addresses = defaultAddresses;
  }
  const addressList = document.getElementById("addressList");

  function saveAddresses() {
    localStorage.setItem("rigforgeAddresses", JSON.stringify(addresses));
  }
  function renderAddresses() {
    if (!addressList) return;
    if (!addresses.length) {
      addressList.innerHTML =
        '<div class="empty-address">Henüz kayıtlı adresiniz yok.</div>';
      return;
    }
    addressList.innerHTML = addresses
      .map(
        (a) => `
      <div class="address-card" data-address-id="${a.id}">
        <div><strong>${escapeHtml(a.title)}</strong><p>${escapeHtml(a.district)} / ${escapeHtml(a.city)}</p>${a.text ? `<small>${escapeHtml(a.text)}</small>` : ""}</div>
        <div class="address-actions"><button class="mini-btn edit-address-btn" type="button" data-id="${a.id}">Düzenle</button><button class="mini-btn danger-btn delete-address-btn" type="button" data-id="${a.id}">Sil</button></div>
      </div>`,
      )
      .join("");
  }
  function escapeHtml(v = "") {
    return String(v).replace(
      /[&<>'"]/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[c],
    );
  }
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.hidden = false;
      document.body.classList.add("modal-open");
    }
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.hidden = true;
      document.body.classList.remove("modal-open");
    }
  }

  document.getElementById("newAddressBtn")?.addEventListener("click", () => {
    document.getElementById("addressModalTitle").textContent = "Yeni Adres";
    document.getElementById("addressForm").reset();
    document.getElementById("addressId").value = "";
    openModal("addressModal");
  });
  addressList?.addEventListener("click", (e) => {
    const edit = e.target.closest(".edit-address-btn");
    const del = e.target.closest(".delete-address-btn");
    if (edit) {
      const a = addresses.find((x) => x.id === edit.dataset.id);
      if (!a) return;
      document.getElementById("addressModalTitle").textContent =
        "Adresi Düzenle";
      document.getElementById("addressId").value = a.id;
      document.getElementById("addressTitle").value = a.title;
      document.getElementById("addressCity").value = a.city;
      document.getElementById("addressDistrict").value = a.district;
      document.getElementById("addressText").value = a.text || "";
      document.getElementById("addressPhone").value = a.phone || "";
      openModal("addressModal");
    }
    if (del && confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      addresses = addresses.filter((x) => x.id !== del.dataset.id);
      saveAddresses();
      renderAddresses();
    }
  });
  document.getElementById("addressForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      id:
        document.getElementById("addressId").value ||
        (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      title: document.getElementById("addressTitle").value.trim(),
      city: document.getElementById("addressCity").value.trim(),
      district: document.getElementById("addressDistrict").value.trim(),
      text: document.getElementById("addressText").value.trim(),
      phone: document.getElementById("addressPhone").value.trim(),
    };
    const i = addresses.findIndex((x) => x.id === data.id);
    if (i >= 0) addresses[i] = data;
    else addresses.push(data);
    saveAddresses();
    renderAddresses();
    closeModal("addressModal");
  });

  const orderDetails = {
    "RF-10482": {
      date: "12.07.2026",
      status: "Hazırlanıyor",
      total: "₺56.840",
      items: [
        ["Ryzen 7 7800X3D", 1, "₺16.999"],
        ["RTX 5070", 1, "₺34.999"],
        ["32 GB DDR5 Bellek", 1, "₺4.842"],
      ],
    },
    "RF-10291": {
      date: "24.06.2026",
      status: "Teslim edildi",
      total: "₺8.499",
      items: [
        ["1 TB NVMe SSD", 1, "₺3.499"],
        ["750W Güç Kaynağı", 1, "₺5.000"],
      ],
    },
  };
  document.querySelectorAll(".order-detail-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const o = orderDetails[btn.dataset.order];
      if (!o) return;
      document.getElementById("orderDetailContent").innerHTML =
        `<div class="order-detail-meta"><span><b>Sipariş:</b> ${btn.dataset.order}</span><span><b>Tarih:</b> ${o.date}</span><span><b>Durum:</b> ${o.status}</span></div><div class="order-detail-items">${o.items.map((i) => `<div><span>${i[0]} × ${i[1]}</span><strong>${i[2]}</strong></div>`).join("")}</div><div class="order-detail-total"><span>Toplam</span><strong>${o.total}</strong></div>`;
      openModal("orderModal");
    }),
  );

  document
    .querySelectorAll("[data-close-modal]")
    .forEach((x) =>
      x.addEventListener("click", () => closeModal(x.dataset.closeModal)),
    );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      document
        .querySelectorAll(".profile-modal:not([hidden])")
        .forEach((m) => closeModal(m.id));
  });
  renderAddresses();
  saveAddresses();

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("rigforgeUser");
    location.href = "login.html";
  });
})();
