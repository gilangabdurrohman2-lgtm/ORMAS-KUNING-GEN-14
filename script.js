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

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
