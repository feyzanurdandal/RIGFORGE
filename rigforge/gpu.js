const cards = document.querySelectorAll(".component-card");
const selectedGpuName = document.getElementById("selectedGpuName");
const estimatedWattage = document.getElementById("estimatedWattage");
const gpuPrice = document.getElementById("gpuPrice");
const buildTotal = document.getElementById("buildTotal");
const addToBuildButton = document.getElementById("addToBuildButton");
const resetButton = document.getElementById("resetButton");
let selectedGpu = null;
cards.forEach((card) => {
  const button = card.querySelector(".select-button");
  button.addEventListener("click", () => {
    cards.forEach((item) => {
      item.classList.remove("selected");
      item.querySelector(".select-button").textContent = "Select Component";
    });
    card.classList.add("selected");
    button.textContent = "Selected ✓";
    selectedGpu = {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      wattage: Number(card.dataset.wattage),
    };
    updateSummary();
  });
});
function updateSummary() {
  if (!selectedGpu) {
    selectedGpuName.textContent = "No GPU selected";
    estimatedWattage.textContent = "0W";
    gpuPrice.textContent = "$0.00";
    buildTotal.textContent = "$0.00";
    addToBuildButton.disabled = true;
    updatePerformance(0);
    return;
  }
  selectedGpuName.textContent = selectedGpu.name;
  estimatedWattage.textContent = `${selectedGpu.wattage}W`;
  gpuPrice.textContent = `$${selectedGpu.price.toLocaleString("en-US")}`;
  buildTotal.textContent = `$${selectedGpu.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  addToBuildButton.disabled = false;
  updatePerformance(selectedGpu.price);
}
function updatePerformance(price) {
  let a = 0,
    b = 0,
    c = 0;
  if (price >= 1700) {
    a = 240;
    b = 190;
    c = 125;
  } else if (price >= 900) {
    a = 190;
    b = 145;
    c = 92;
  }
  document.getElementById("fps1080").textContent = a ? `${a} FPS` : "-- FPS";
  document.getElementById("fps1440").textContent = b ? `${b} FPS` : "-- FPS";
  document.getElementById("fps4k").textContent = c ? `${c} FPS` : "-- FPS";
  document.getElementById("bar1080").style.width = a ? "95%" : "0";
  document.getElementById("bar1440").style.width = b ? "78%" : "0";
  document.getElementById("bar4k").style.width = c ? "58%" : "0";
}
resetButton.addEventListener("click", () => {
  selectedGpu = null;
  cards.forEach((card) => {
    card.classList.remove("selected");
    card.querySelector(".select-button").textContent = "Select Component";
  });
  updateSummary();
});
addToBuildButton.addEventListener("click", () => {
  if (selectedGpu) alert(`${selectedGpu.name} build'e eklendi.`);
});
updateSummary();
