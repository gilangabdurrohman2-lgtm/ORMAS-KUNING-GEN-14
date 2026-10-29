document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".main-nav");

  if (toggleButton && navMenu) {
    toggleButton.addEventListener("click", function () {
      navMenu.classList.toggle("show");
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});