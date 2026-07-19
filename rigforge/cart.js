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

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`${key} okunamadı:`, error);
    return fallback;
  }
}

function selectedBuildItems() {
  return componentKeys
    .map((key) => {
      const selectedItem = readJson(`rigforgeSelected_${key}`, null);

      if (!selectedItem) {
        return null;
      }

      return {
        id: `builder-${key}`,
        source: "builder",
        componentKey: key,
        name: selectedItem.name || "Bileşen",
        category: selectedItem.label || key,
        price: Number(selectedItem.price || 0),
        qty: 1,
        image: `https://placehold.co/300x300/0f1320/ffffff?text=${encodeURIComponent(
          (selectedItem.label || "RF").slice(0, 8),
        )}`,
      };
    })
    .filter(Boolean);
}

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

function updateHeaderCount() {
  const count = cart.reduce((total, item) => total + Number(item.qty || 1), 0);

  document.querySelectorAll("#headerCartCount").forEach((element) => {
    element.textContent = String(count);
  });
}

function showMessage(message) {
  alert(message);
}

function renderCart() {
  const list = document.getElementById("cartItems");
  const empty = document.getElementById("emptyCart");
  const summary = document.querySelector(".summary");
  const itemCount = document.getElementById("itemCount");
  const subtotalElement = document.getElementById("subtotal");
  const grandTotalElement = document.getElementById("grandTotal");

  if (!list || !empty) {
    console.error("Sepet HTML alanları bulunamadı.");
    return;
  }

  list.innerHTML = "";

  const totalItemCount = cart.reduce(
    (total, item) => total + Number(item.qty || 1),
    0,
  );

  if (itemCount) {
    itemCount.textContent = `(${totalItemCount} ürün)`;
  }

  updateHeaderCount();

  if (cart.length === 0) {
    empty.hidden = false;

    if (summary) {
      summary.style.display = "none";
    }

    return;
  }

  empty.hidden = true;

  if (summary) {
    summary.style.display = "block";
  }

  cart.forEach((item) => {
    const article = document.createElement("article");

    article.className = "cart-item card";

    const isBuilderItem = item.source === "builder";
    const quantity = Number(item.qty || 1);
    const itemTotal = Number(item.price || 0) * quantity;

    article.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.name}"
      >

      <div class="item-meta">
        <span class="badge">
          ${item.category}
        </span>

        <h3>${item.name}</h3>

        <p>
          ${
            isBuilderItem
              ? "Topladığınız sistem bileşeni"
              : "Stokta • 2 yıl garanti"
          }
        </p>

        <div class="item-bottom">
          <div class="quantity">
            <button
              type="button"
              data-action="decrease"
              data-id="${item.id}"
              aria-label="Adedi azalt"
            >
              −
            </button>

            <span>${quantity}</span>

            <button
              type="button"
              data-action="increase"
              data-id="${item.id}"
              aria-label="Adedi artır"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div class="item-price">
        <strong>
          ${formatPrice(itemTotal)}
        </strong>

        <button
          type="button"
          class="remove-btn"
          data-action="remove"
          data-id="${item.id}"
        >
          Kaldır
        </button>
      </div>
    `;

    list.appendChild(article);
  });

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const total = Math.max(0, subtotal - discount);

  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(subtotal);
  }

  if (grandTotalElement) {
    grandTotalElement.textContent = formatPrice(total);
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const id = button.dataset.id;

  const item = cart.find((cartItem) => String(cartItem.id) === String(id));

  if (!item) {
    return;
  }

  if (action === "increase") {
    if (item.source === "builder") {
      showMessage("Sistem toplama bileşenlerinde maksimum alım adedi 1'dir.");
      return;
    }

    item.qty = Number(item.qty || 1) + 1;
  }

  if (action === "decrease") {
    if (item.source === "builder") {
      showMessage("Sistem toplama bileşenlerinde minimum alım adedi 1'dir.");
      return;
    }

    item.qty = Math.max(1, Number(item.qty || 1) - 1);
  }

  if (action === "remove") {
    cart = cart.filter((cartItem) => String(cartItem.id) !== String(id));

    if (item.source === "builder" && item.componentKey) {
      localStorage.removeItem(`rigforgeSelected_${item.componentKey}`);
    }
  }

  saveCart();
  renderCart();
});

const clearCartButton = document.getElementById("clearCart");

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    cart = [];
    discount = 0;

    componentKeys.forEach((key) => {
      localStorage.removeItem(`rigforgeSelected_${key}`);
    });

    saveCart();
    renderCart();
  });
}

const applyCouponButton = document.getElementById("applyCoupon");

if (applyCouponButton) {
  applyCouponButton.addEventListener("click", () => {
    const couponInput = document.getElementById("couponInput");

    const couponMessage = document.getElementById("couponMessage");

    if (!couponInput || !couponMessage) {
      return;
    }

    const code = couponInput.value.trim().toUpperCase();

    const subtotal = cart.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
      0,
    );

    if (code === "RIG10") {
      discount = subtotal * 0.1;

      couponMessage.textContent = "%10 indirim uygulandı.";

      couponMessage.style.color = "";
    } else {
      discount = 0;

      couponMessage.textContent = "Geçersiz kupon kodu.";

      couponMessage.style.color = "var(--red)";
    }

    renderCart();
  });
}

const checkoutButton = document.getElementById("checkoutBtn");

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    alert("Ödeme sayfası backend aşamasında bağlanacaktır.");
  });
}

renderCart();
