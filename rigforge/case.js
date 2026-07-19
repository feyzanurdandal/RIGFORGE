const sizeFilter = document.getElementById("sizeFilter");
const brandFilter = document.getElementById("brandFilter");
const sideFilter = document.getElementById("sideFilter");
const resetFilters = document.getElementById("resetFilters"),
  cards = [...document.querySelectorAll(".product-card")],
  resultCount = document.getElementById("resultCount"),
  emptyState = document.getElementById("emptyState"),
  selectedCount = document.getElementById("selectedCount");
function applyFilters() {
  let count = 0;
  cards.forEach((card) => {
    const show =
      (sizeFilter.value === "all" || card.dataset.size === sizeFilter.value) &&
      (brandFilter.value === "all" ||
        card.dataset.brand === brandFilter.value) &&
      (sideFilter.value === "all" || card.dataset.side === sideFilter.value);
    card.hidden = !show;
    if (show) count++;
  });
  resultCount.textContent = count;
  emptyState.hidden = count !== 0;
}
[sizeFilter, brandFilter, sideFilter].forEach((f) =>
  f.addEventListener("change", applyFilters),
);
resetFilters.addEventListener("click", () => {
  sizeFilter.value = "all";
  brandFilter.value = "all";
  sideFilter.value = "all";
  applyFilters();
});
cards.forEach((card) =>
  card.querySelector(".select-button").addEventListener("click", () => {
    cards.forEach((x) => {
      x.classList.remove("selected");
      x.querySelector(".select-button").textContent = "Select";
    });
    card.classList.add("selected");
    card.querySelector(".select-button").textContent = "Selected";
    selectedCount.textContent = "6 / 8";
    localStorage.setItem(
      "rigforgeSelectedCase",
      JSON.stringify({
        brand: card.querySelector(".product-brand").textContent,
        name: card.querySelector("h2").textContent,
        price: card.querySelector(".price").textContent,
      }),
    );
  }),
);
applyFilters();
