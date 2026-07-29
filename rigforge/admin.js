// const navButtons = document.querySelectorAll(".admin-nav");
// const panels = document.querySelectorAll(".admin-panel");
// const titles = {
//   dashboard: "Dashboard",
//   products: "Ürün Yönetimi",
//   orders: "Sipariş Yönetimi",
//   users: "Kullanıcı Yönetimi",
//   messages: "Destek Mesajları",
//   settings: "Ayarlar",
// };
// navButtons.forEach(
//   (btn) =>
//     (btn.onclick = () => {
//       navButtons.forEach((x) => x.classList.toggle("active", x === btn));
//       panels.forEach((x) =>
//         x.classList.toggle("active", x.id === btn.dataset.adminTab),
//       );
//       document.getElementById("adminTitle").textContent =
//         titles[btn.dataset.adminTab];
//     }),
// );

// const modal = document.getElementById("productModal");
// document.getElementById("newProductBtn").onclick = () => (modal.hidden = false);
// document.getElementById("closeModal").onclick = () => (modal.hidden = true);
// modal.addEventListener("click", (e) => {
//   if (e.target === modal) modal.hidden = true;
// });

// document.getElementById("productSearch").addEventListener("input", (e) => {
//   const q = e.target.value.toLocaleLowerCase("tr-TR");
//   document.querySelectorAll("#productTable tbody tr").forEach((row) => {
//     row.hidden = !row.textContent.toLocaleLowerCase("tr-TR").includes(q);
//   });
// });

// function closeProductModal() {
//   if (modal) {
//     modal.hidden = true;
//     document.body.style.overflow = "";
//   }
// }
// document
//   .getElementById("closeModal")
//   ?.addEventListener("click", closeProductModal);
// document.addEventListener("keydown", (e) => {
//   if (e.key === "Escape") closeProductModal();
// });
// modal?.addEventListener("click", (e) => {
//   if (e.target === modal) closeProductModal();
// });

// (() => {
//   const modal = document.querySelector(
//     ".modal, #productModal, [data-product-modal]",
//   );
//   if (!modal) return;
//   const close = () => {
//     modal.classList.remove("open", "active", "show");
//     modal.hidden = true;
//     document.body.style.overflow = "";
//   };
//   modal
//     .querySelectorAll(".modal-close, .close-modal, [data-close-modal], .close")
//     .forEach((btn) => btn.addEventListener("click", close));
//   modal.addEventListener("click", (e) => {
//     if (e.target === modal) close();
//   });
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape" && !modal.hidden) close();
//   });
// })();
const API_ADMIN = "/api/admin";

document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".admin-nav");
  const panels = document.querySelectorAll(".admin-panel");
  const title = document.getElementById("adminTitle");

  const modal = document.getElementById("productModal");
  const newProductBtn = document.getElementById("newProductBtn");
  const closeModalBtn = document.getElementById("closeModal");
  const productSearch = document.getElementById("productSearch");
  const saveProductBtn = document.getElementById("saveProductBtn");

  const titles = {
    dashboard: "Dashboard",
    products: "Ürünler",
    orders: "Siparişler",
    users: "Kullanıcılar",
    messages: "Mesajlar",
    settings: "Ayarlar"
  };

  // Dashboard istatistikleri
  async function loadDashboardStats() {
    try {
      const response = await window.RigForgeApi.fetch(`${API_ADMIN}/stats`);

      if (!response.ok) {
        throw new Error(`İstatistik hatası: ${response.status}`);
      }

      const stats = await response.json();
      const metrics = document.querySelectorAll(".metric strong");

      if (metrics.length >= 4) {
        metrics[0].textContent =
          `₺${Number(stats.toplamGelir).toLocaleString("tr-TR")}`;
        metrics[1].textContent = stats.toplamSiparis;
        metrics[2].textContent = stats.toplamKullanici;
        metrics[3].textContent = stats.dusukStokUrunSayisi;
      }
    } catch (error) {
      console.error("Admin istatistikleri çekilemedi:", error);
    }
  }

  // Admin menü geçişleri
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.adminTab;

      navButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      panels.forEach((panel) => {
        panel.classList.remove("active");
      });

      const targetPanel = document.getElementById(targetTab);

      if (!targetPanel) {
        console.error(`Admin panel bulunamadı: #${targetTab}`);
        return;
      }

      targetPanel.classList.add("active");

      if (title) {
        title.textContent = titles[targetTab] || "Yönetim Paneli";
      }
    });
  });

  // Modal açma
  function openProductModal() {
    if (!modal) {
      console.error("productModal bulunamadı.");
      return;
    }

    modal.hidden = false;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  // Modal kapatma
  function closeProductModal() {
    if (!modal) return;

    modal.hidden = true;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  newProductBtn?.addEventListener("click", openProductModal);
  closeModalBtn?.addEventListener("click", closeProductModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeProductModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProductModal();
    }
  });

  // Ürün arama
  productSearch?.addEventListener("input", (event) => {
    const query = event.target.value.toLocaleLowerCase("tr-TR");

    document.querySelectorAll("#productTable tbody tr").forEach((row) => {
      const rowText = row.textContent.toLocaleLowerCase("tr-TR");
      row.hidden = !rowText.includes(query);
    });
  });

  // Düzenle butonları
  document.querySelectorAll(".mini-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openProductModal();
    });
  });

  // Yeni ürün kaydetme
  saveProductBtn?.addEventListener("click", async () => {
    const productName = document.getElementById("productName");
    const productCategory = document.getElementById("productCategory");
    const productPrice = document.getElementById("productPrice");
    const productStock = document.getElementById("productStock");

    if (
      !productName ||
      !productCategory ||
      !productPrice ||
      !productStock
    ) {
      alert("Ürün formundaki alanlar bulunamadı.");
      return;
    }

    const urunAdi = productName.value.trim();
    const kategoriID = Number(productCategory.value);
    const fiyat = Number(productPrice.value);
    const stok = Number(productStock.value);

    if (!urunAdi) {
      alert("Ürün adını gir.");
      return;
    }

    if (!Number.isInteger(kategoriID) || kategoriID <= 0) {
      alert("Geçerli bir kategori seç.");
      return;
    }

    if (!Number.isFinite(fiyat) || fiyat <= 0) {
      alert("Geçerli bir fiyat gir.");
      return;
    }

    if (!Number.isInteger(stok) || stok < 0) {
      alert("Geçerli bir stok miktarı gir.");
      return;
    }

    const yeniUrun = {
      urunAdi,
      aciklama: "",
      fiyat,
      stok,
      resimURL: "",
      kategoriID,
      markaID: 1
    };

    try {
      saveProductBtn.disabled = true;
      saveProductBtn.textContent = "Kaydediliyor...";

      const response = await window.RigForgeApi.fetch(`${API_ADMIN}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(yeniUrun)
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
          `Ürün eklenemedi. HTTP kodu: ${response.status}`
        );
      }

      alert(result?.message || "Ürün başarıyla eklendi.");

      productName.value = "";
      productPrice.value = "";
      productStock.value = "";

      closeProductModal();
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      alert(`Hata: ${error.message}`);
    } finally {
      saveProductBtn.disabled = false;
      saveProductBtn.textContent = "Ürünü Kaydet";
    }
  });

  loadDashboardStats();
});

