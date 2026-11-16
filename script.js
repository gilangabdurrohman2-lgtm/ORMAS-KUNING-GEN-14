document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".main-nav");

  if (toggleButton && navMenu) {
    toggleButton.addEventListener("click", function () {
      navMenu.classList.toggle("show");
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

  // Keep the program cards as informational cards; portfolio cards form the gallery.
  const portfolioCards = Array.from(document.querySelectorAll(".portfolio-card"));
  const galleryImages = [
    {
      src: "mantap/DSC00852.JPG",
      alt: "Dokumentasi kegiatan PiKIR"
    },
    {
      src: "mantap/DSC05908.JPG",
      alt: "Dokumentasi kegiatan dan proyek PiKIR"
    },
    {
      src: "mantap/Screenshot%202026-11-16%20103637.png",
      alt: "Dokumentasi portofolio PiKIR"
    },
    {
      src: "mantap/Screenshot%202026-11-16%20103637.png",
      alt: "Foto kegiatan PiKIR"
    }
  ];

  if (portfolioCards.length) {
    const galleryStyles = document.createElement("style");
    galleryStyles.textContent = `
      .portfolio-card { cursor: zoom-in; transition: transform .2s ease, box-shadow .2s ease; }
      .portfolio-card:hover { transform: translateY(-4px); box-shadow: 0 24px 42px rgba(14, 34, 69, .16); }
      .portfolio-card:focus-visible { outline: 3px solid #dca81f; outline-offset: 4px; }
      .portfolio-gallery-image { display: block; width: 100%; height: 210px; margin: 0 0 20px; object-fit: cover; border-radius: 16px; background: #f3f4f6; }
      .portfolio-gallery-hint { display: inline-block; margin-top: 16px; color: #0e2245; font-weight: 800; }
      .portfolio-lightbox { width: min(1000px, calc(100% - 32px)); max-width: none; max-height: 92vh; padding: 18px; border: 0; border-radius: 20px; color: #fff; background: #0d1d36; box-shadow: 0 24px 80px rgba(0,0,0,.4); }
      .portfolio-lightbox::backdrop { background: rgba(8, 20, 40, .82); }
      .portfolio-lightbox-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
      .portfolio-lightbox-title { margin: 0; font-size: 1.1rem; }
      .portfolio-lightbox-close, .portfolio-lightbox-nav { border: 0; border-radius: 10px; padding: 10px 14px; color: #0e2245; background: #fffaf1; font: inherit; font-weight: 800; cursor: pointer; }
      .portfolio-lightbox-stage { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 14px; }
      .portfolio-lightbox-image { display: block; width: 100%; height: min(70vh, 680px); object-fit: contain; }
      .portfolio-lightbox-count { margin: 12px 0 0; text-align: center; color: rgba(255,255,255,.75); font-size: .9rem; }
      @media (max-width: 600px) {
        .portfolio-lightbox { padding: 12px; }
        .portfolio-lightbox-stage { gap: 6px; }
        .portfolio-lightbox-nav { padding: 9px; }
        .portfolio-lightbox-image { height: 62vh; }
      }
    `;
    document.head.append(galleryStyles);

    const dialog = document.createElement("dialog");
    dialog.className = "portfolio-lightbox";
    dialog.setAttribute("aria-label", "Galeri portofolio PiKIR");
    dialog.innerHTML = `
      <div class="portfolio-lightbox-header">
        <h2 class="portfolio-lightbox-title"></h2>
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
      currentImage = (index + galleryImages.length) % galleryImages.length;
      const image = galleryImages[currentImage];
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxTitle.textContent = portfolioCards[currentImage % portfolioCards.length]
        .querySelector("h3")?.textContent.trim() || "Portofolio PiKIR";
      lightboxCount.textContent = (currentImage + 1) + " / " + galleryImages.length;
    }

    function openGallery(index) {
      showGalleryImage(index);
      dialog.showModal();
    }

    portfolioCards.forEach(function (card, index) {
      const image = document.createElement("img");
      image.className = "portfolio-gallery-image";
      image.src = galleryImages[index % galleryImages.length].src;
      image.alt = galleryImages[index % galleryImages.length].alt;
      image.loading = "lazy";
      card.prepend(image);

      const hint = document.createElement("span");
      hint.className = "portfolio-gallery-hint";
      hint.textContent = "Buka galeri foto →";
      card.append(hint);
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Buka galeri: " + (card.querySelector("h3")?.textContent.trim() || "Portofolio"));
      card.addEventListener("click", function () {
        openGallery(index);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openGallery(index);
        }
      });
    });

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
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
