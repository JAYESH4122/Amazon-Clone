        const filterButton = document.querySelector(".button-outter button");
        const filterSection = document.querySelector(".filter-section");
        const overlay = document.querySelector(".overlay");
        const closeFilter = document.querySelector(".close-filter");
        const applyBtn = document.querySelector(".apply-btn");
        const resetBtn = document.querySelector(".reset-btn");

        const brandCheckboxes = document.querySelectorAll(
          ".brand-option input"
        );
        const productItems = document.querySelectorAll(".main-content-section");

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

        applyBtn.addEventListener("click", function () {
          const selectedBrands = Array.from(brandCheckboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value);

          productItems.forEach((item) => {
            const itemBrand = item.getAttribute("data-brand");
            if (
              selectedBrands.length === 0 ||
              selectedBrands.includes(itemBrand)
            ) {
              item.style.display = "block";
            } else {
              item.style.display = "none";
            }
          });

          const numText = document.querySelector(".num-text");
          const checkedCount = Array.from(brandCheckboxes).filter(
            (cb) => cb.checked
          ).length;
          numText.textContent = `(${checkedCount})`;

          closeFilterPanel();
        });

        resetBtn.addEventListener("click", function () {
          brandCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
          });
        });

        const numText = document.querySelector(".num-text");
        numText.textContent = `(${brandCheckboxes.length})`;
        