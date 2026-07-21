// // (() => {
// //   "use strict";
// //   const rawUser = localStorage.getItem("rigforgeUser");
// //   if (!rawUser) {
// //     location.replace("login.html");
// //     return;
// //   }
// //   const user = JSON.parse(rawUser);
// //   const tabs = document.querySelectorAll(".tab-btn[data-tab]");
// //   const panels = document.querySelectorAll(".tab-panel");

// //   function openTab(id) {
// //     tabs.forEach((x) => x.classList.toggle("active", x.dataset.tab === id));
// //     panels.forEach((x) => x.classList.toggle("active", x.id === id));
// //   }
// //   tabs.forEach((btn) =>
// //     btn.addEventListener("click", () => openTab(btn.dataset.tab)),
// //   );
// //   document.querySelectorAll("[data-open-tab]").forEach((link) =>
// //     link.addEventListener("click", (event) => {
// //       event.preventDefault();
// //       openTab(link.dataset.openTab);
// //     }),
// //   );

// //   document.getElementById("welcomeName").textContent =
// //     `Hoş geldin, ${user.name}`;
// //   document.getElementById("welcomeMail").textContent = user.email;
// //   document.getElementById("avatar").textContent = (user.name || "RF")
// //     .split(" ")
// //     .map((x) => x[0])
// //     .slice(0, 2)
// //     .join("")
// //     .toUpperCase();
// //   document.getElementById("profileName").value = user.name || "";
// //   document.getElementById("profileEmail").value = user.email || "";
// //   document.getElementById("profilePhone").value = user.phone || "";

// //   document
// //     .getElementById("profileForm")
// //     ?.addEventListener("submit", (event) => {
// //       event.preventDefault();
// //       const updated = {
// //         name: document.getElementById("profileName").value.trim(),
// //         email: document.getElementById("profileEmail").value.trim(),
// //         phone: document.getElementById("profilePhone").value.trim(),
// //       };
// //       localStorage.setItem("rigforgeUser", JSON.stringify(updated));
// //       localStorage.setItem("rigforgeRegisteredUser", JSON.stringify(updated));
// //       const status = document.getElementById("profileStatus");
// //       status.style.color = "var(--green)";
// //       status.textContent = "Bilgiler kaydedildi.";
// //     });

// //   const defaultAddresses = [
// //     {
// //       id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
// //       title: "Ev Adresi",
// //       city: "Bursa",
// //       district: "Nilüfer",
// //       text: "",
// //       phone: "",
// //     },
// //   ];
// //   let addresses;
// //   try {
// //     addresses =
// //       JSON.parse(localStorage.getItem("rigforgeAddresses")) || defaultAddresses;
// //   } catch {
// //     addresses = defaultAddresses;
// //   }
// //   const addressList = document.getElementById("addressList");

// //   function saveAddresses() {
// //     localStorage.setItem("rigforgeAddresses", JSON.stringify(addresses));
// //   }
// //   function renderAddresses() {
// //     if (!addressList) return;
// //     if (!addresses.length) {
// //       addressList.innerHTML =
// //         '<div class="empty-address">Henüz kayıtlı adresiniz yok.</div>';
// //       return;
// //     }
// //     addressList.innerHTML = addresses
// //       .map(
// //         (a) => `
// //       <div class="address-card" data-address-id="${a.id}">
// //         <div><strong>${escapeHtml(a.title)}</strong><p>${escapeHtml(a.district)} / ${escapeHtml(a.city)}</p>${a.text ? `<small>${escapeHtml(a.text)}</small>` : ""}</div>
// //         <div class="address-actions"><button class="mini-btn edit-address-btn" type="button" data-id="${a.id}">Düzenle</button><button class="mini-btn danger-btn delete-address-btn" type="button" data-id="${a.id}">Sil</button></div>
// //       </div>`,
// //       )
// //       .join("");
// //   }
// //   function escapeHtml(v = "") {
// //     return String(v).replace(
// //       /[&<>'"]/g,
// //       (c) =>
// //         ({
// //           "&": "&amp;",
// //           "<": "&lt;",
// //           ">": "&gt;",
// //           "'": "&#39;",
// //           '"': "&quot;",
// //         })[c],
// //     );
// //   }
// //   function openModal(id) {
// //     const el = document.getElementById(id);
// //     if (el) {
// //       el.hidden = false;
// //       document.body.classList.add("modal-open");
// //     }
// //   }
// //   function closeModal(id) {
// //     const el = document.getElementById(id);
// //     if (el) {
// //       el.hidden = true;
// //       document.body.classList.remove("modal-open");
// //     }
// //   }

// //   document.getElementById("newAddressBtn")?.addEventListener("click", () => {
// //     document.getElementById("addressModalTitle").textContent = "Yeni Adres";
// //     document.getElementById("addressForm").reset();
// //     document.getElementById("addressId").value = "";
// //     openModal("addressModal");
// //   });
// //   addressList?.addEventListener("click", (e) => {
// //     const edit = e.target.closest(".edit-address-btn");
// //     const del = e.target.closest(".delete-address-btn");
// //     if (edit) {
// //       const a = addresses.find((x) => x.id === edit.dataset.id);
// //       if (!a) return;
// //       document.getElementById("addressModalTitle").textContent =
// //         "Adresi Düzenle";
// //       document.getElementById("addressId").value = a.id;
// //       document.getElementById("addressTitle").value = a.title;
// //       document.getElementById("addressCity").value = a.city;
// //       document.getElementById("addressDistrict").value = a.district;
// //       document.getElementById("addressText").value = a.text || "";
// //       document.getElementById("addressPhone").value = a.phone || "";
// //       openModal("addressModal");
// //     }
// //     if (del && confirm("Bu adresi silmek istediğinize emin misiniz?")) {
// //       addresses = addresses.filter((x) => x.id !== del.dataset.id);
// //       saveAddresses();
// //       renderAddresses();
// //     }
// //   });
// //   document.getElementById("addressForm")?.addEventListener("submit", (e) => {
// //     e.preventDefault();
// //     const data = {
// //       id:
// //         document.getElementById("addressId").value ||
// //         (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
// //       title: document.getElementById("addressTitle").value.trim(),
// //       city: document.getElementById("addressCity").value.trim(),
// //       district: document.getElementById("addressDistrict").value.trim(),
// //       text: document.getElementById("addressText").value.trim(),
// //       phone: document.getElementById("addressPhone").value.trim(),
// //     };
// //     const i = addresses.findIndex((x) => x.id === data.id);
// //     if (i >= 0) addresses[i] = data;
// //     else addresses.push(data);
// //     saveAddresses();
// //     renderAddresses();
// //     closeModal("addressModal");
// //   });

// //   const orderDetails = {
// //     "RF-10482": {
// //       date: "12.07.2026",
// //       status: "Hazırlanıyor",
// //       total: "₺56.840",
// //       items: [
// //         ["Ryzen 7 7800X3D", 1, "₺16.999"],
// //         ["RTX 5070", 1, "₺34.999"],
// //         ["32 GB DDR5 Bellek", 1, "₺4.842"],
// //       ],
// //     },
// //     "RF-10291": {
// //       date: "24.06.2026",
// //       status: "Teslim edildi",
// //       total: "₺8.499",
// //       items: [
// //         ["1 TB NVMe SSD", 1, "₺3.499"],
// //         ["750W Güç Kaynağı", 1, "₺5.000"],
// //       ],
// //     },
// //   };
// //   document.querySelectorAll(".order-detail-btn").forEach((btn) =>
// //     btn.addEventListener("click", () => {
// //       const o = orderDetails[btn.dataset.order];
// //       if (!o) return;
// //       document.getElementById("orderDetailContent").innerHTML =
// //         `<div class="order-detail-meta"><span><b>Sipariş:</b> ${btn.dataset.order}</span><span><b>Tarih:</b> ${o.date}</span><span><b>Durum:</b> ${o.status}</span></div><div class="order-detail-items">${o.items.map((i) => `<div><span>${i[0]} × ${i[1]}</span><strong>${i[2]}</strong></div>`).join("")}</div><div class="order-detail-total"><span>Toplam</span><strong>${o.total}</strong></div>`;
// //       openModal("orderModal");
// //     }),
// //   );

// //   document
// //     .querySelectorAll("[data-close-modal]")
// //     .forEach((x) =>
// //       x.addEventListener("click", () => closeModal(x.dataset.closeModal)),
// //     );
// //   document.addEventListener("keydown", (e) => {
// //     if (e.key === "Escape")
// //       document
// //         .querySelectorAll(".profile-modal:not([hidden])")
// //         .forEach((m) => closeModal(m.id));
// //   });
// //   renderAddresses();
// //   saveAddresses();

// //   document.getElementById("logoutBtn")?.addEventListener("click", () => {
// //     localStorage.removeItem("rigforgeUser");
// //     location.href = "login.html";
// //   });
// // })();


// (() => {
//   "use strict";
//   const token = localStorage.getItem("rigforgeToken");
//   const rawUser = localStorage.getItem("rigforgeUser");

//   if (!token || !rawUser) {
//     location.replace("login.html");
//     return;
//   }

//   const user = JSON.parse(rawUser);

//   document.getElementById("welcomeName").textContent = `Hoş geldin, ${user.name}`;
//   document.getElementById("welcomeMail").textContent = user.email;

//   // Çıkış Yap Butonu
//   document.getElementById("logoutBtn")?.addEventListener("click", () => {
//     localStorage.removeItem("rigforgeToken");
//     localStorage.removeItem("rigforgeUser");
//     location.href = "login.html";
//   });
// })();

(() => {
  "use strict";

  const API_ORDERS = "http://localhost:5000/api/orders";

  // 1. JWT ve Kullanıcı Kontrolü
  const token = localStorage.getItem("rigforgeToken");
  const rawUser = localStorage.getItem("rigforgeUser");

  if (!token || !rawUser) {
    location.replace("login.html");
    return;
  }

  const user = JSON.parse(rawUser);

  // 2. Sekme (Tab) Değiştirme Mantığı
  const tabs = document.querySelectorAll(".tab-btn[data-tab]");
  const panels = document.querySelectorAll(".tab-panel");

  function openTab(id) {
    tabs.forEach((x) => x.classList.toggle("active", x.dataset.tab === id));
    panels.forEach((x) => x.classList.toggle("active", x.id === id));
    
    // Siparişlerim sekmesi açıldığında veritabanından güncel veriyi çek
    if (id === "orders" || id === "overview") {
      fetchUserOrders();
    }
  }

  tabs.forEach((btn) =>
    btn.addEventListener("click", () => openTab(btn.dataset.tab))
  );

  document.querySelectorAll("[data-open-tab]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openTab(link.dataset.openTab);
    })
  );

  // 3. Kullanıcı Bilgilerini Arayüze Basma
  document.getElementById("welcomeName").textContent = `Hoş geldin, ${user.name || "Kullanıcı"}`;
  document.getElementById("welcomeMail").textContent = user.email || "";
  
  const avatar = document.getElementById("avatar");
  if (avatar) {
    avatar.textContent = (user.name || "RF")
      .split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  document.getElementById("profileName").value = user.name || "";
  document.getElementById("profileEmail").value = user.email || "";
  document.getElementById("profilePhone").value = user.phone || "";

  // 4. C# BACKEND'DEN GERÇEK SİPARİŞLERİ ÇEKME (Zero Mock Data)
  let fetchedOrders = [];

  async function fetchUserOrders() {
    try {
      const response = await fetch(`${API_ORDERS}/my-orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchedOrders = await response.json();
        renderOrdersTable(fetchedOrders);
      } else if (response.status === 401) {
        localStorage.removeItem("rigforgeToken");
        location.href = "login.html";
      }
    } catch (error) {
      console.error("Siparişler çekilirken hata oluştu:", error);
    }
  }

  const formatPrice = (val) =>
    Number(val || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

  function renderOrdersTable(orders) {
    const tableBody = document.querySelector("#orders table tbody");
    if (!tableBody) return;

    if (!orders || orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem;">Henüz veritabanında kayıtlı bir siparişiniz bulunmuyor.</td></tr>`;
      return;
    }

    tableBody.innerHTML = orders
      .map(
        (o) => `
      <tr>
        <td><strong>${o.orderNo}</strong></td>
        <td>${o.date}</td>
        <td>${formatPrice(o.total)}</td>
        <td><span class="status-warning">${o.status}</span></td>
        <td>
          <button class="mini-btn order-detail-btn" data-id="${o.orderId}">Detay</button>
        </td>
      </tr>`
      )
      .join("");

    // Detay Buton Dinleyicileri
    document.querySelectorAll(".order-detail-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.dataset.id;
        const selectedOrder = fetchedOrders.find((x) => x.orderId == orderId);
        if (selectedOrder) openOrderDetailModal(selectedOrder);
      });
    });
  }

  function openOrderDetailModal(order) {
    const content = document.getElementById("orderDetailContent");
    if (!content) return;

    content.innerHTML = `
      <div class="order-detail-meta" style="margin-bottom: 1rem;">
        <p><b>Sipariş No:</b> ${order.orderNo}</p>
        <p><b>Tarih:</b> ${order.date}</p>
        <p><b>Durum:</b> ${order.status}</p>
      </div>
      <hr style="border-color: var(--border); margin: 1rem 0;" />
      <div class="order-detail-items">
        ${
          order.items && order.items.length > 0
            ? order.items
                .map(
                  (i) => `
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
              <span>${i.productName} × ${i.quantity}</span>
              <strong>${formatPrice(i.price)}</strong>
            </div>`
                )
                .join("")
            : "<p>Sistem toplama siparişi detaylandırılıyor...</p>"
        }
      </div>
      <hr style="border-color: var(--border); margin: 1rem 0;" />
      <div class="order-detail-total" style="display:flex; justify-content:space-between; font-size:1.1rem;">
        <span>Toplam Tutar:</span>
        <strong>${formatPrice(order.total)}</strong>
      </div>`;

    openModal("orderModal");
  }

  // 5. Modal Fonksiyonları
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

  document.querySelectorAll("[data-close-modal]").forEach((x) =>
    x.addEventListener("click", () => closeModal(x.dataset.closeModal))
  );

  // 6. Çıkış Yap
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("rigforgeToken");
    localStorage.removeItem("rigforgeUser");
    location.href = "login.html";
  });

  // Sayfa ilk yüklendiğinde verileri çek
  fetchUserOrders();
})();