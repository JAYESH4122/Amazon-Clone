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
  });
});

function filterMobilesByBrand() {
  const selectedBrands = Array.from(
    document.querySelectorAll('input[type="checkbox"][name="brand"]:checked')
  ).map((checkbox) => checkbox.value);

  const mobileItems = document.querySelectorAll(".mobile-list-div li");

  if (selectedBrands.length === 0) {
    mobileItems.forEach((item) => {
      item.style.display = "block";
    });
    return;
  }

  mobileItems.forEach((item) => {
    const itemBrand = item.getAttribute("data-brand");
    if (selectedBrands.includes(itemBrand)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
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
        heading.textContent = "All Mobiles";
      } else {
        heading.textContent = "More Mobiles";
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
});
