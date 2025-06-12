const filterButton = document.querySelector(".button-outter button");
const filterSection = document.querySelector(".filter-section");
const overlay = document.querySelector(".overlay");
const closeFilter = document.querySelector(".close-filter");
const showResultsBtn = document.querySelector(".show-results-btn");
const clearFilterBtn = document.querySelector(".clear-results-btn");
const brandTags = document.querySelectorAll(".brand-tag");
const productItems = document.querySelectorAll(".main-content-section");
const filterTitle = document.querySelector(".filter-title");

let selectedBrands = new Set();

filterButton.addEventListener("click", function () {
  filterSection.classList.add("show");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
});

function closeFilterPanel() {
  filterSection.classList.remove("show");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}

overlay.addEventListener("click", closeFilterPanel);
closeFilter.addEventListener("click", closeFilterPanel);

function updateFilterCount() {
  const count = selectedBrands.size;
  filterTitle.textContent = `Filters (${count})`;
  document.querySelector(".num-text").textContent = `(${count})`;
}

clearFilterBtn.addEventListener("click", function clearResults() {
  selectedBrands.clear();
  brandTags.forEach((tag) => {
    tag.classList.remove("selected");
  });
  updateFilterCount();
  applyFilters();
});

function applyFilters() {
  productItems.forEach((item) => {
    const itemBrand = item.getAttribute("data-brand")?.toLowerCase();
    if (selectedBrands.size === 0 || selectedBrands.has(itemBrand)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
  showResultsBtn.textContent = `Show ${getVisibleProductCount()} results`;
}

function getVisibleProductCount() {
  return document.querySelectorAll(
    '.main-content-section[style="display: block;"], .main-content-section:not([style])'
  ).length;
}

brandTags.forEach((tag) => {
  tag.addEventListener("click", function () {
    const brandName = this.textContent.trim().toLowerCase();

    if (this.classList.contains("selected")) {
      selectedBrands.delete(brandName);
      this.classList.remove("selected");
    } else {
      selectedBrands.add(brandName);
      this.classList.add("selected");
    }

    updateFilterCount();

    applyFilters();
  });
});

showResultsBtn.addEventListener("click", closeFilterPanel);

updateFilterCount();
applyFilters();
