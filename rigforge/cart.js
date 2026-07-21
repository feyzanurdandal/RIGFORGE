const API_CART = "http://localhost:5000/api/cart";
const API_ORDERS = "http://localhost:5000/api/orders";

const componentKeys = [
  "cpu",
  "gpu",
  "motherboard",
  "ram",
  "storage",
  "case",
  "psu",
  "cooler",
];

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

// 1. PC Builder Parçalarını Toplama
function selectedBuildItems() {
  return componentKeys
    .map((key) => {
      const selectedItem =
        readJson(`rigforgeSelected_${key}`, null) ||
        readJson(`rigforgeSelected${key.charAt(0).toUpperCase() + key.slice(1)}`, null);

      if (!selectedItem) return null;

      return {
        id: `builder-${key}`,
        source: "builder",
        componentKey: key,
        name: selectedItem.name || "Seçilen Bileşen",
        category: selectedItem.brand || key.toUpperCase(),
        price: parseFloat(String(selectedItem.price || 0).replace(/[^0-9.-]+/g, "")) || 0,
        qty: 1,
        image: "https://placehold.co/300x300/0f1320/ffffff?text=" + key.toUpperCase(),
      };
    })
    .filter(Boolean);
}

// 2. Sepet Yükleme
function loadCart() {
  const storedCart = readJson("rigforgeCart", []);
  const safeCart = Array.isArray(storedCart) ? storedCart : [];

  const normalProducts = safeCart.filter((item) => item.source !== "builder");
  const buildProducts = selectedBuildItems();

  const mergedCart = [...normalProducts, ...buildProducts];
  localStorage.setItem("rigforgeCart", JSON.stringify(mergedCart));

  return mergedCart;
}

let cart = loadCart();
let discount = 0;

function saveCart() {
  localStorage.setItem("rigforgeCart", JSON.stringify(cart));
}

// 3. Ekranı Çizme
function renderCart() {
  cart = loadCart();
  const list = document.getElementById("cartItems");
  const empty = document.getElementById("emptyCart");
  const summary = document.querySelector(".summary");
  const subtotalElement = document.getElementById("subtotal");
  const grandTotalElement = document.getElementById("grandTotal");
  const itemCount = document.getElementById("itemCount");

  if (!list || !empty) return;

  list.innerHTML = "";

  const totalItemCount = cart.reduce((tot, item) => tot + Number(item.qty || 1), 0);
  if (itemCount) itemCount.textContent = `(${totalItemCount} ürün)`;

  document.querySelectorAll("#headerCartCount").forEach((el) => {
    el.textContent = String(totalItemCount);
  });

  if (cart.length === 0) {
    empty.hidden = false;
    if (summary) summary.style.display = "none";
    return;
  }

  empty.hidden = true;
  if (summary) summary.style.display = "block";

  let subtotal = 0;

  cart.forEach((item) => {
    const quantity = Number(item.qty || 1);
    const itemTotal = Number(item.price || 0) * quantity;
    subtotal += itemTotal;

    const article = document.createElement("article");
    article.className = "cart-item card";

    article.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-meta">
        <span class="badge">${item.category}</span>
        <h3>${item.name}</h3>
        <p>Topladığınız Sistem Bileşeni • Stokta</p>
      </div>
      <div class="item-price">
        <strong>${formatPrice(itemTotal)}</strong>
        <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}">Kaldır</button>
      </div>
    `;
    list.appendChild(article);
  });

  const total = Math.max(0, subtotal - discount);

  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
  if (grandTotalElement) grandTotalElement.textContent = formatPrice(total);
}

// 4. Silme ve Güncelleme İşlemleri
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "remove") {
    const item = cart.find((x) => String(x.id) === String(id));
    cart = cart.filter((x) => String(x.id) !== String(id));

    if (item && item.source === "builder" && item.componentKey) {
      localStorage.removeItem(`rigforgeSelected_${item.componentKey}`);
      localStorage.removeItem(`rigforgeSelected${item.componentKey.charAt(0).toUpperCase() + item.componentKey.slice(1)}`);
    }

    saveCart();
    renderCart();
  }
});

// Sepeti Temizle Butonu
document.getElementById("clearCart")?.addEventListener("click", () => {
  cart = [];
  discount = 0;
  componentKeys.forEach((key) => {
    localStorage.removeItem(`rigforgeSelected_${key}`);
    localStorage.removeItem(`rigforgeSelected${key.charAt(0).toUpperCase() + key.slice(1)}`);
  });
  saveCart();
  renderCart();
});

// Kupon Kodu
document.getElementById("applyCoupon")?.addEventListener("click", () => {
  const couponInput = document.getElementById("couponInput");
  const couponMessage = document.getElementById("couponMessage");
  if (!couponInput || !couponMessage) return;

  const code = couponInput.value.trim().toUpperCase();
  const subtotal = cart.reduce((tot, item) => tot + Number(item.price || 0) * Number(item.qty || 1), 0);

  if (code === "RIG10") {
    discount = subtotal * 0.1;
    couponMessage.textContent = "%10 indirim uygulandı.";
    couponMessage.style.color = "var(--green)";
  } else {
    discount = 0;
    couponMessage.textContent = "Geçersiz kupon kodu.";
    couponMessage.style.color = "var(--red)";
  }
  renderCart();
});

// 5. C# Backend Sipariş Tamamlama (Strict JWT Authentication)
// cart.js içerisindeki checkoutBtn dinleyicisi
document.getElementById("checkoutBtn")?.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Sepetiniz boş!");
    return;
  }

  const token = localStorage.getItem("rigforgeToken");
  if (!token) {
    alert("Sipariş verebilmek için güvenli giriş yapmanız gerekmektedir.");
    location.href = "login.html";
    return;
  }

  // Sepetteki gerçek toplam tutarı hesaplıyoruz
  const subtotal = cart.reduce((tot, item) => tot + Number(item.price || 0) * Number(item.qty || 1), 0);
  const calculatedTotal = Math.max(0, subtotal - discount);

  try {
    const response = await fetch(`${API_ORDERS}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        adresID: 1,
        odemeYontemi: "Kredi Karti",
        toplamTutar: calculatedTotal // Gerçek hesaplanan toplam tutar
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`🎉 Siparişiniz başarıyla veritabanına işlendi!\nSipariş Numarası: RF-${data.orderId}`);
      
      localStorage.removeItem("rigforgeCart");
      componentKeys.forEach((key) => {
        localStorage.removeItem(`rigforgeSelected_${key}`);
        localStorage.removeItem(`rigforgeSelected${key.charAt(0).toUpperCase() + key.slice(1)}`);
      });

      location.href = "profile.html";
    } else if (response.status === 401) {
      alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      localStorage.removeItem("rigforgeToken");
      location.href = "login.html";
    } else {
      alert(data.message || "Sipariş verilemedi.");
    }
  } catch (err) {
    alert("Güvenli sunucu bağlantısı kurulamadı.");
  }
});

document.addEventListener("DOMContentLoaded", renderCart);
renderCart();