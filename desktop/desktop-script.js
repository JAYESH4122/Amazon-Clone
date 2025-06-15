const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
const priceFilterDiv = document.querySelector(".price-filter-div");
const minInput = document.getElementById("min-price");
const maxInput = document.getElementById("max-price");
const clearButton = document.querySelector(".clear-filters-button");

let originalMobileLists = [];
function storeOriginalLists() {
  const mobileListDivs = document.querySelectorAll(".mobile-list-div");
  originalMobileLists = Array.from(mobileListDivs).map((div) => ({
    id: div.id,
    html: div.innerHTML,
    heading:
      div.previousElementSibling?.querySelector(".heading")?.textContent || "",
  }));
}

function setupMobileLists() {
  document.querySelectorAll(".mobile-list-div ul").forEach((ul) => {
    ul.style.display = "grid";
    ul.style.gridAutoFlow = "column";
    ul.style.gridTemplateColumns = "repeat(auto-fit, minmax(197px, 1fr))";
  });
}

function removeSeeMoreText() {
  document.querySelectorAll(".see-more").forEach((el) => el.remove());
}

function handleBrandChange() {
  const anyBrandChecked = Array.from(brandCheckboxes).some((cb) => cb.checked);
  priceFilterDiv.style.display = anyBrandChecked ? "block" : "none";

  if (!anyBrandChecked) {
    location.reload();
    return;
  }

  filterMobiles();
  updateUI();
  removeSeeMoreText();
}

function filterMobiles() {
  const selectedBrands = Array.from(
    document.querySelectorAll('input[name="brand"]:checked')
  ).map((checkbox) => checkbox.value);

  const minPrice = (+minInput.value + 20) * 50;
  const maxPrice = (+maxInput.value + 20) * 50;

  if (
    selectedBrands.length === 0 &&
    minInput.value == 0 &&
    maxInput.value == 38
  ) {
    showOriginalLists();
    return;
  }

  let filteredContainer = document.querySelector(".filtered-container");
  if (!filteredContainer) {
    filteredContainer = document.createElement("div");
    filteredContainer.className = "filtered-container";
    document
      .querySelector(".right-container")
      .insertBefore(
        filteredContainer,
        document.querySelector(".mobile-section-main")
      );
    document.querySelectorAll(".mobile-list-div").forEach((div) => {
      div.style.display = "none";
    });
  } else {
    filteredContainer.innerHTML = "";
  }

  const filteredGrid = document.createElement("ul");
  filteredGrid.className = "filtered-grid";
  filteredContainer.appendChild(filteredGrid);

  let hasResults = false;
  document.querySelectorAll(".mobile-list-div li").forEach((item) => {
    const brand = item.getAttribute("data-brand");
    const price = parseInt(item.getAttribute("data-price")) || 0;

    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(brand);
    const priceMatch = price >= minPrice && price <= maxPrice;

    if (brandMatch && priceMatch) {
      filteredGrid.appendChild(item.cloneNode(true));
      hasResults = true;
    }
  });

  if (!hasResults) {
    showNoItemsMessage(filteredContainer);
  }

  removeSeeMoreText();
}

function showOriginalLists() {
  const filteredContainer = document.querySelector(".filtered-container");
  if (filteredContainer) filteredContainer.remove();

  const filterHeading = document.querySelector(".top-filter-heading");
  if (filterHeading) filterHeading.remove();

  document.querySelectorAll(".mobile-list-div").forEach((div) => {
    div.style.display = "block";
    const original = originalMobileLists.find((list) => list.id === div.id);
    if (original) div.innerHTML = original.html;
  });

  setupMobileLists();
  removeSeeMoreText();
}

function showNoItemsMessage(container) {
  const noItemsMsg = document.createElement("div");
  noItemsMsg.className = "no-items-message";
  noItemsMsg.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <p style="font-size: 18px; color: #555;">No items match your selection</p>
    </div>
  `;
  container.appendChild(noItemsMsg);
}

function updatePriceRange() {
  const min = Math.min(+minInput.value, +maxInput.value - 1);
  const max = Math.max(+maxInput.value, +minInput.value + 1);
  minInput.value = min;
  maxInput.value = max;

  document.getElementById("price-min-label").textContent = `₹${
    (min + 20) * 50
  }`;
  document.getElementById("price-max-label").textContent = `₹${
    (max + 20) * 50
  }${max >= 38 ? "+" : ""}`;

  const track = document.querySelector(".slider-track");
  const minPercent = (min / 38) * 100;
  const maxPercent = (max / 38) * 100;
  track.style.background = `
    linear-gradient(to right,
    #bbbfbf 0%, #bbbfbf ${minPercent}%,
    #007185 ${minPercent}%, #007185 ${maxPercent}%,
    #bbbfbf ${maxPercent}%, #bbbfbf 100%)`;

  filterMobiles();
  updateUI();
}

function updateUI() {
  updateHeading();
  toggleClearButton();
}

function updateHeading() {
  const selectedBrands = Array.from(
    document.querySelectorAll('input[name="brand"]:checked')
  ).map((cb) => cb.value);

  let heading = document.querySelector(".top-filter-heading");
  if (!heading) {
    heading = document.createElement("div");
    heading.className = "top-filter-heading";
    document.querySelector(".right-container").prepend(heading);
  }

  if (
    selectedBrands.length === 0 &&
    minInput.value == 0 &&
    maxInput.value == 38
  ) {
    if (heading) heading.remove();
    originalMobileLists.forEach((list, i) => {
      const headings = document.querySelectorAll(".heading");
      if (headings[i]) {
        headings[i].style.display = "block";
        headings[i].textContent = list.heading;
      }
    });
  } else {
    heading.innerHTML = `<h2>${
      selectedBrands.length
        ? `Results (${selectedBrands.join(", ")})`
        : "No Results"
    }</h2>`;
    document
      .querySelectorAll(".heading")
      .forEach((h) => (h.style.display = "none"));
  }
}

function toggleClearButton() {
  const anyBrandChecked = Array.from(brandCheckboxes).some((cb) => cb.checked);
  const priceChanged = minInput.value != 0 || maxInput.value != 38;
  document.querySelector(".clear-filters-container").style.display =
    anyBrandChecked || priceChanged ? "block" : "none";
}

function clearFilters() {
  brandCheckboxes.forEach((cb) => (cb.checked = false));
  minInput.value = 0;
  maxInput.value = 38;
  updatePriceRange();
  priceFilterDiv.style.display = "none";
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  storeOriginalLists();
  setupMobileLists();
  updateUI();
  updatePriceRange();
  priceFilterDiv.style.display = "none";
  removeSeeMoreText();
});

brandCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleBrandChange);
});

minInput.addEventListener("input", updatePriceRange);
maxInput.addEventListener("input", updatePriceRange);
clearButton.addEventListener("click", clearFilters);
