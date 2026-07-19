const navButtons = document.querySelectorAll(".admin-nav");
const panels = document.querySelectorAll(".admin-panel");
const titles = {
  dashboard: "Dashboard",
  products: "Ürün Yönetimi",
  orders: "Sipariş Yönetimi",
  users: "Kullanıcı Yönetimi",
  messages: "Destek Mesajları",
  settings: "Ayarlar",
};
navButtons.forEach(
  (btn) =>
    (btn.onclick = () => {
      navButtons.forEach((x) => x.classList.toggle("active", x === btn));
      panels.forEach((x) =>
        x.classList.toggle("active", x.id === btn.dataset.adminTab),
      );
      document.getElementById("adminTitle").textContent =
        titles[btn.dataset.adminTab];
    }),
);

const modal = document.getElementById("productModal");
document.getElementById("newProductBtn").onclick = () => (modal.hidden = false);
document.getElementById("closeModal").onclick = () => (modal.hidden = true);
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.hidden = true;
});

document.getElementById("productSearch").addEventListener("input", (e) => {
  const q = e.target.value.toLocaleLowerCase("tr-TR");
  document.querySelectorAll("#productTable tbody tr").forEach((row) => {
    row.hidden = !row.textContent.toLocaleLowerCase("tr-TR").includes(q);
  });
});

function closeProductModal() {
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
}
document
  .getElementById("closeModal")
  ?.addEventListener("click", closeProductModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProductModal();
});
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeProductModal();
});

(() => {
  const modal = document.querySelector(
    ".modal, #productModal, [data-product-modal]",
  );
  if (!modal) return;
  const close = () => {
    modal.classList.remove("open", "active", "show");
    modal.hidden = true;
    document.body.style.overflow = "";
  };
  modal
    .querySelectorAll(".modal-close, .close-modal, [data-close-modal], .close")
    .forEach((btn) => btn.addEventListener("click", close));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();
