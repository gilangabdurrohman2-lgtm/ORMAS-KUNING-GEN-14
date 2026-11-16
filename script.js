document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".main-nav");

  if (toggleButton && navMenu) {
    toggleButton.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("show");
      toggleButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Use the supplied PiKIR artwork in both the header and footer.
  document.querySelectorAll(".logo-mark").forEach(function (logoMark) {
    const logoImage = document.createElement("img");
    logoImage.src = "mantap/7.png";
    logoImage.alt = "Logo PiKIR";
    logoImage.style.width = "100%";
    logoImage.style.height = "100%";
    logoImage.style.objectFit = "contain";

    logoMark.replaceChildren(logoImage);
    logoMark.style.width = "76px";
    logoMark.style.height = "76px";
    logoMark.style.borderRadius = "0";
    logoMark.style.overflow = "visible";
  });

  // Turn each supervisor portrait into a link to its full-size source image.
  document.querySelectorAll(".team-photo").forEach(function (photo) {
    const imageUrl = getComputedStyle(photo).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);
    if (!imageUrl) return;

    const name = photo.parentElement.querySelector("h3")?.textContent.trim() || "Foto pembina";
    const photoLink = document.createElement("a");
    photoLink.className = photo.className;
    photoLink.href = imageUrl[1];
    photoLink.target = "_blank";
    photoLink.rel = "noopener noreferrer";
    photoLink.setAttribute("aria-label", "Buka foto " + name + " ukuran penuh");
    photoLink.title = "Klik untuk membuka foto ukuran penuh";
    photoLink.style.display = "block";
    photoLink.style.cursor = "zoom-in";
    photo.replaceWith(photoLink);
  });

  // Portfolio gallery styled as a compact editorial photo grid.
  const portfolioGrid = document.querySelector(".portfolio-grid");
  const galleryItems = [
    {
      category: "Kegiatan",
      filter: "kegiatan",
      title: "Dokumentasi Kegiatan PiKIR",
      src: "mantap/DSC00852.JPG",
      alt: "Dokumentasi kegiatan PiKIR"
    },
    {
      category: "Inovasi",
      filter: "inovasi",
      title: "Proyek dan Karya Inovatif",
      src: "mantap/DSC05908.JPG",
      alt: "Dokumentasi proyek dan karya inovatif PiKIR"
    },
    {
      category: "Galeri",
      filter: "galeri",
      title: "Momen Bersama PiKIR",
      src: "mantap/Screenshot%202026-11-16%20103637.png",
      alt: "Dokumentasi portofolio PiKIR"
    },
    {
      category: "Riset",
      filter: "riset",
      title: "Eksplorasi Ide dan Riset",
      src: "mantap/DSC00852.JPG",
      alt: "Kegiatan riset dan eksplorasi ide PiKIR"
    }
  ];

  if (portfolioGrid) {
    const section = portfolioGrid.closest("#portfolio");
    const heading = section?.querySelector(".section-heading");
    const eyebrow = heading?.querySelector(".eyebrow");
    const title = heading?.querySelector("h2");
    if (eyebrow) eyebrow.textContent = "Portofolio PiKIR";
    if (title) title.textContent = "MOMEN BERKARYA";
    if (heading) {
      const description = document.createElement("p");
      description.className = "portfolio-intro";
      description.textContent = "Sekilas perjalanan kegiatan, riset, dan inovasi PiKIR.";
      heading.append(description);
    }

    const filters = document.createElement("div");
    filters.className = "portfolio-filters";
    filters.setAttribute("role", "group");
    filters.setAttribute("aria-label", "Filter galeri portofolio");
    filters.innerHTML = `
      <button class="portfolio-filter is-active" type="button" data-filter="all" aria-pressed="true">Semua</button>
      <button class="portfolio-filter" type="button" data-filter="riset" aria-pressed="false">Riset</button>
      <button class="portfolio-filter" type="button" data-filter="inovasi" aria-pressed="false">Inovasi</button>
      <button class="portfolio-filter" type="button" data-filter="kegiatan" aria-pressed="false">Kegiatan</button>
      <button class="portfolio-filter" type="button" data-filter="galeri" aria-pressed="false">Galeri</button>
    `;
    portfolioGrid.before(filters);
    portfolioGrid.replaceChildren();

    galleryItems.forEach(function (item, index) {
      const card = document.createElement("button");
      card.className = "portfolio-card";
      card.type = "button";
      card.dataset.category = item.filter;
      card.setAttribute("aria-label", "Buka foto: " + item.title);

      const image = document.createElement("img");
      image.className = "portfolio-card-image";
      image.src = item.src;
      image.alt = item.alt;
      image.loading = "lazy";

      const caption = document.createElement("span");
      caption.className = "portfolio-card-caption";
      caption.innerHTML = `<span class="portfolio-card-category"></span><span class="portfolio-card-title"></span>`;
      caption.querySelector(".portfolio-card-category").textContent = item.category;
      caption.querySelector(".portfolio-card-title").textContent = item.title;
      card.append(image, caption);
      portfolioGrid.append(card);
      card.addEventListener("click", function () {
        openGallery(index);
      });
    });

    filters.addEventListener("click", function (event) {
      const button = event.target.closest(".portfolio-filter");
      if (!button) return;

      filters.querySelectorAll(".portfolio-filter").forEach(function (filterButton) {
        const active = filterButton === button;
        filterButton.classList.toggle("is-active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });

      portfolioGrid.querySelectorAll(".portfolio-card").forEach(function (card) {
        card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
      });
    });

    const dialog = document.createElement("dialog");
    dialog.className = "portfolio-lightbox";
    dialog.setAttribute("aria-label", "Galeri foto PiKIR");
    dialog.innerHTML = `
      <div class="portfolio-lightbox-header">
        <p class="portfolio-lightbox-title"></p>
        <button class="portfolio-lightbox-close" type="button" aria-label="Tutup galeri">Tutup ✕</button>
      </div>
      <div class="portfolio-lightbox-stage">
        <button class="portfolio-lightbox-nav portfolio-gallery-previous" type="button" aria-label="Foto sebelumnya">‹</button>
        <img class="portfolio-lightbox-image" alt="">
        <button class="portfolio-lightbox-nav portfolio-gallery-next" type="button" aria-label="Foto berikutnya">›</button>
      </div>
      <p class="portfolio-lightbox-count" aria-live="polite"></p>
    `;
    document.body.append(dialog);

    const lightboxImage = dialog.querySelector(".portfolio-lightbox-image");
    const lightboxTitle = dialog.querySelector(".portfolio-lightbox-title");
    const lightboxCount = dialog.querySelector(".portfolio-lightbox-count");
    let currentImage = 0;

    function showGalleryImage(index) {
      currentImage = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentImage];
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxTitle.textContent = item.title;
      lightboxCount.textContent = (currentImage + 1) + " / " + galleryItems.length;
    }

    function openGallery(index) {
      showGalleryImage(index);
      dialog.showModal();
    }

    dialog.querySelector(".portfolio-lightbox-close").addEventListener("click", function () {
      dialog.close();
    });
    dialog.querySelector(".portfolio-gallery-previous").addEventListener("click", function () {
      showGalleryImage(currentImage - 1);
    });
    dialog.querySelector(".portfolio-gallery-next").addEventListener("click", function () {
      showGalleryImage(currentImage + 1);
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") showGalleryImage(currentImage - 1);
      if (event.key === "ArrowRight") showGalleryImage(currentImage + 1);
    });
    dialog.addEventListener("close", function () {
      lightboxImage.removeAttribute("src");
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
