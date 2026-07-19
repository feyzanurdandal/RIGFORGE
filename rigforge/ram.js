const typeFilter = document.getElementById("typeFilter");
const capacityFilter = document.getElementById("capacityFilter");
const brandFilter = document.getElementById("brandFilter");
const resetFilters = document.getElementById("resetFilters");
const cards = [...document.querySelectorAll(".product-card")];
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const selectedCount = document.getElementById("selectedCount");

function applyFilters() {
  const type = typeFilter.value;
  const capacity = capacityFilter.value;
  const brand = brandFilter.value;

  let visibleProducts = 0;

  cards.forEach((card) => {
    const typeMatches = type === "all" || card.dataset.type === type;
    const capacityMatches =
      capacity === "all" || card.dataset.capacity === capacity;
    const brandMatches = brand === "all" || card.dataset.brand === brand;

    const shouldShow = typeMatches && capacityMatches && brandMatches;

    card.hidden = !shouldShow;

    if (shouldShow) {
      visibleProducts += 1;
    }
  });

  resultCount.textContent = visibleProducts;
  emptyState.hidden = visibleProducts !== 0;
}

[typeFilter, capacityFilter, brandFilter].forEach((filter) => {
  filter.addEventListener("change", applyFilters);
});

resetFilters.addEventListener("click", () => {
  typeFilter.value = "all";
  capacityFilter.value = "all";
  brandFilter.value = "all";
  applyFilters();
});

cards.forEach((card) => {
  const button = card.querySelector(".select-button");

  button.addEventListener("click", () => {
    cards.forEach((item) => {
      item.classList.remove("selected");
      item.querySelector(".select-button").textContent = "Select";
    });

    card.classList.add("selected");
    button.textContent = "Selected";
    selectedCount.textContent = "4 / 8";

    const selectedProduct = {
      brand: card.querySelector(".product-brand").textContent,
      name: card.querySelector("h2").textContent,
      price: card.querySelector(".price").textContent,
    };

    localStorage.setItem(
      "rigforgeSelectedRam",
      JSON.stringify(selectedProduct),
    );
  });
});

applyFilters();
