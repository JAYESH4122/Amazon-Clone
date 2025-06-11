const brandCheckboxes = document.querySelectorAll(
  'input[type="checkbox"][name="brand"]'
);

let userHasInteracted = false;
let originalMobileLists = [];


function storeOriginalLists() {
  originalMobileLists = Array.from(document.querySelectorAll('.mobile-list-div')).map(div => ({
    id: div.id,
    html: div.innerHTML,
    heading: div.previousElementSibling?.querySelector('.heading')?.textContent || ''
  }));
}


function initializeMobileLists() {
  document.querySelectorAll('.mobile-list-div ul').forEach(ul => {
    ul.style.display = 'grid';
    ul.style.gridAutoFlow = 'column';
    ul.style.gridTemplateColumns = 'repeat(auto-fit, minmax(197px, 1fr))';
    ul.style.scrollSnapType = 'x mandatory';
    ul.style.gap = '0';
    ul.style.padding = '0';
    ul.style.margin = '0';
  });
}

brandCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    userHasInteracted = true;
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

  if (userHasInteracted) {
    filterMobilesByBrand();
    checkNoResults();
    toggleClearButton();
  }
}

minInput.addEventListener("input", () => {
  userHasInteracted = true;
  updateRange();
});

maxInput.addEventListener("input", () => {
  userHasInteracted = true;
  updateRange();
});

function filterMobilesByBrand() {
  const filterDiv = document.querySelector('.price-filter-div');
  filterDiv.style.display = 'block';

  const selectedBrands = Array.from(
    document.querySelectorAll('input[type="checkbox"][name="brand"]:checked')
  ).map((checkbox) => checkbox.value);

  const minPrice = priceMap(+minInput.value);
  const maxPrice = priceMap(+maxInput.value);


  if (selectedBrands.length === 0 && minInput.value == 0 && maxInput.value == 38) {
    restoreOriginalLists();
    return;
  }


  let filteredContainer = document.querySelector('.filtered-container');
  if (!filteredContainer) {
    filteredContainer = document.createElement('div');
    filteredContainer.className = 'filtered-container';
    document.querySelector('.right-container').insertBefore(filteredContainer, document.querySelector('.mobile-section-main'));
    

    document.querySelectorAll('.mobile-list-div').forEach(div => {
      div.style.display = 'none';
    });
  } else {
    filteredContainer.innerHTML = '';
  }


  const filteredGrid = document.createElement('ul');
  filteredGrid.className = 'filtered-grid';
  filteredContainer.appendChild(filteredGrid);


  let anyFiltered = false;
  document.querySelectorAll('.mobile-list-div li').forEach(item => {
    const itemBrand = item.getAttribute("data-brand");
    const priceAttr = item.getAttribute("data-price");
    const itemPrice = priceAttr ? parseInt(priceAttr) : null;

    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
    const priceMatch = itemPrice === null || (itemPrice >= minPrice && itemPrice <= maxPrice);

    if (brandMatch && priceMatch) {
      const clone = item.cloneNode(true);
      filteredGrid.appendChild(clone);
      anyFiltered = true;
    }
  });

  if (!anyFiltered) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No results found';
    filteredContainer.appendChild(noResults);
  }
}

function restoreOriginalLists() {
  const filteredContainer = document.querySelector('.filtered-container');
  if (filteredContainer) {
    filteredContainer.remove();
  }


  const topFilterHeading = document.querySelector('.top-filter-heading');
  if (topFilterHeading) {
    topFilterHeading.remove();
  }

  document.querySelectorAll('.mobile-list-div').forEach(div => {
    div.style.display = 'block';
    const original = originalMobileLists.find(list => list.id === div.id);
    if (original) {
      div.innerHTML = original.html;
    }
  });

  initializeMobileLists();
}

function updateHeadingText() {
  const selectedBrands = Array.from(
    document.querySelectorAll('input[type="checkbox"][name="brand"]:checked')
  ).map((checkbox) => checkbox.value);


  let topFilterHeading = document.querySelector('.top-filter-heading');
  if (!topFilterHeading) {
    topFilterHeading = document.createElement('div');
    topFilterHeading.className = 'top-filter-heading';
    document.querySelector('.right-container').prepend(topFilterHeading);
  }

  if (selectedBrands.length === 0 && minInput.value == 0 && maxInput.value == 38) {

    if (topFilterHeading) {
      topFilterHeading.remove();
    }

    originalMobileLists.forEach((list, index) => {
      const headings = document.querySelectorAll(".heading");
      if (headings[index]) {
        headings[index].style.display = "block";
        headings[index].textContent = list.heading;
      }
    });
  } else {

    const filterText = selectedBrands.length > 0 
      ? `Filtered Mobiles (${selectedBrands.join(", ")})`
      : "Filtered Mobiles";
    topFilterHeading.innerHTML = `<h2 class="filtered-heading">${filterText}</h2>`;
    

    document.querySelectorAll(".heading").forEach(heading => {
      heading.style.display = "none";
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
  const visibleItems = document.querySelectorAll('.filtered-grid li, .mobile-list-div li[style*="display: block"], .mobile-list-div li:not([style])');
  const noResultsElement = document.querySelector(".no-results");

  if (visibleItems.length === 0) {
    if (!noResultsElement) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = "No results found";
      const container = document.querySelector('.filtered-container') || document.querySelector('.mobile-list-div');
      container.appendChild(noResults);
    }
  } else if (noResultsElement) {
    noResultsElement.remove();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  storeOriginalLists();
  initializeMobileLists();
  updateHeadingText();
  handleSeeMoreText();
  checkNoResults();
  toggleClearButton();
  updateRange();
});

const clearButton = document.querySelector(".clear-filters-button");

clearButton.addEventListener("click", () => {
  userHasInteracted = false;

  document.querySelectorAll('input[type="checkbox"][name="brand"]').forEach((cb) => {
    cb.checked = false;
  });

  minInput.value = 0;
  maxInput.value = 38;

  updateRange();
  restoreOriginalLists();
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