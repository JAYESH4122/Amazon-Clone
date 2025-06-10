const brandCheckboxes = document.querySelectorAll(
  'input[type="checkbox"][name="brand"]'
);

console.log("Got it");


brandCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    filterMobilesByBrand();
    updateHeadingText();
    handleSeeMoreText();
    checkNoResults();
    toggleClearButton(); 
  });
});

const minInput = document.getElementById("min-price");
const maxInput = document.getElementById("max-price");
const minLabel = document.getElementById("price-min-label");
const maxLabel = document.getElementById("price-max-label");
const track = document.querySelector(".slider-track");

const priceMap = (value) => (value + 20) * 50;

function updateRange() {
  const min = Math.min(+minInput.value, +maxInput.value - 1);
  const max = Math.max(+maxInput.value, +minInput.value + 1);
  minInput.value = min;
  maxInput.value = max;

  const minPrice = priceMap(min);
  const maxPrice = priceMap(max);

  minLabel.textContent = `₹${minPrice}`;
  maxLabel.textContent = `₹${maxPrice}${max >= 38 ? "+" : ""}`;

  const percentMin = (min / 38) * 100;
  const percentMax = (max / 38) * 100;

  track.style.background = `
    linear-gradient(to right, 
      #bbbfbf 0%, 
      #bbbfbf ${percentMin}%, 
      #007185 ${percentMin}%, 
      #007185 ${percentMax}%, 
      #bbbfbf ${percentMax}%, 
      #bbbfbf 100%)`;

  filterMobilesByBrand();
  checkNoResults();
  toggleClearButton();
}

minInput.addEventListener("input", updateRange);
maxInput.addEventListener("input", updateRange);

updateRange();

function filterMobilesByBrand() {
  const filterDiv = document.querySelector('.price-filter-div');
  filterDiv.style.display = 'block';

  const selectedBrands = Array.from(
    document.querySelectorAll('input[type="checkbox"][name="brand"]:checked')
  ).map((checkbox) => checkbox.value);

  const mobileItems = document.querySelectorAll(".mobile-list-div li");
  const minPrice = priceMap(+minInput.value);
  const maxPrice = priceMap(+maxInput.value);

  mobileItems.forEach((item) => {
    const itemBrand = item.getAttribute("data-brand");
    const itemPriceAttr = item.getAttribute("data-price");

    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(itemBrand);


    let priceMatch = true;
    if (itemPriceAttr !== null) {
      const itemPrice = parseInt(itemPriceAttr);
      priceMatch = itemPrice >= minPrice && itemPrice <= maxPrice;
    }

    item.style.display = brandMatch && priceMatch ? "block" : "none";
  });
}


function updateHeadingText() {
  const selectedBrands = Array.from(
    document.querySelectorAll('input[type="checkbox"][name="brand"]:checked')
  ).map((checkbox) => checkbox.value);

  const headings = document.querySelectorAll(".heading");

  if (selectedBrands.length === 0) {
    headings.forEach((heading, index) => {
      heading.style.display = "block";
      if (index === 0) {
        heading.textContent = "Results";
      } else {
        heading.textContent = "";
      }
    });
  } else {
    headings.forEach((heading, index) => {
      if (index === 0) {
        heading.style.display = "block";
        heading.textContent = `Filtered Mobiles (${selectedBrands.join(", ")})`;
      } else {
        heading.style.display = "none";
      }
    });
  }
}

function handleSeeMoreText() {
  const seeMoreElements = document.querySelectorAll(".see-more");
  seeMoreElements.forEach((element) => {
    element.remove();
  });
}

function checkNoResults() {
  const mobileItems = document.querySelectorAll(".mobile-list-div li");
  const visibleItems = Array.from(mobileItems).filter(
    (item) =>
      item.style.display !== "none" &&
      window.getComputedStyle(item).display !== "none"
  );

  const noResultsElement = document.querySelector(".no-results");

  if (visibleItems.length === 0) {
    if (!noResultsElement) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = "No results found";
      document.querySelector(".mobile-list-div").appendChild(noResults);
    } else {
      noResultsElement.style.display = "block";
    }
  } else {
    if (noResultsElement) {
      noResultsElement.style.display = "none";
    }
  }
}


document.addEventListener("DOMContentLoaded", function () {
  updateHeadingText();
  handleSeeMoreText();
  checkNoResults();
  toggleClearButton(); 
});


const clearButton = document.querySelector(".clear-filters-button");

clearButton.addEventListener("click", () => {

  document.querySelectorAll('input[type="checkbox"][name="brand"]').forEach((cb) => {
    cb.checked = false;
  });

  minInput.value = 0;
  maxInput.value = 38;
  updateRange();

  filterMobilesByBrand();
  updateHeadingText();
  handleSeeMoreText();
  checkNoResults();
  toggleClearButton();
});

function toggleClearButton() {
  const anyBrandChecked = [...document.querySelectorAll('input[name="brand"]')].some(cb => cb.checked);
  const rangeNotDefault = minInput.value != 0 || maxInput.value != 38;

  const btnContainer = document.querySelector(".clear-filters-container");
  if (btnContainer) {
    btnContainer.style.display = anyBrandChecked || rangeNotDefault ? "block" : "none";
  }
}
