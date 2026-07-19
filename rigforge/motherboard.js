const platformFilter = document.getElementById("platformFilter");
const formFactorFilter = document.getElementById("formFactorFilter");
const brandFilter = document.getElementById("brandFilter");
const resetFilters = document.getElementById("resetFilters");
const cards = [...document.querySelectorAll(".product-card")];
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const selectedCount = document.getElementById("selectedCount");

function applyFilters() {
  const platform = platformFilter.value;
  const formFactor = formFactorFilter.value;
  const brand = brandFilter.value;

  let visibleProducts = 0;

  cards.forEach((card) => {
    const platformMatches =
      platform === "all" || card.dataset.platform === platform;

    const formFactorMatches =
      formFactor === "all" || card.dataset.formFactor === formFactor;

    const brandMatches = brand === "all" || card.dataset.brand === brand;

    const shouldShow = platformMatches && formFactorMatches && brandMatches;

    card.hidden = !shouldShow;

    if (shouldShow) {
      visibleProducts += 1;
    }
  });

  resultCount.textContent = visibleProducts;
  emptyState.hidden = visibleProducts !== 0;
}

[platformFilter, formFactorFilter, brandFilter].forEach((filter) => {
  filter.addEventListener("change", applyFilters);
});

resetFilters.addEventListener("click", () => {
  platformFilter.value = "all";
  formFactorFilter.value = "all";
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
    selectedCount.textContent = "3 / 8";

    const selectedProduct = {
      brand: card.querySelector(".product-brand").textContent,
      name: card.querySelector("h2").textContent,
      price: card.querySelector(".price").textContent,
    };

    localStorage.setItem(
      "rigforgeSelectedMotherboard",
      JSON.stringify(selectedProduct),
    );
  });
});

applyFilters();
