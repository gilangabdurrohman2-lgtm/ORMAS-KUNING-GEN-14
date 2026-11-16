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

  // Each program card opens the shared example juknis PDF in an accessible dialog.
  const juknisUrl = "dokumen/contoh-juknis.pdf";
  const programCards = document.querySelectorAll(".program-card");

  if (programCards.length) {
    const dialogStyles = document.createElement("style");
    dialogStyles.textContent = `
      .juknis-dialog {
        width: min(920px, calc(100% - 32px));
        max-width: none;
        max-height: min(90vh, 900px);
        padding: 0;
        border: 0;
        border-radius: 20px;
        color: #1a2437;
        box-shadow: 0 24px 80px rgba(0, 0, 0, .3);
      }
      .juknis-dialog::backdrop { background: rgba(8, 20, 40, .72); }
      .juknis-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 22px;
        background: #fffaf1;
        border-bottom: 1px solid #e7dcc0;
      }
      .juknis-dialog-header h2 { margin: 0; font-size: 1.15rem; }
      .juknis-dialog-actions { display: flex; align-items: center; gap: 12px; }
      .juknis-open-link { color: #0e2245; font-weight: 700; }
      .juknis-close {
        border: 0;
        border-radius: 10px;
        padding: 9px 13px;
        background: #0e2245;
        color: #fff;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .juknis-frame { display: block; width: 100%; height: min(72vh, 760px); border: 0; background: #f3f4f6; }
      .juknis-fallback { margin: 0; padding: 12px 20px; color: #58677b; font-size: .9rem; }
      .program-card { cursor: pointer; }
      .program-card:focus-visible { outline: 3px solid #dca81f; outline-offset: 4px; }
      .program-open-hint { display: inline-block; margin-top: 16px; color: #0e2245; font-weight: 800; }
      @media (max-width: 600px) {
        .juknis-dialog-header { align-items: flex-start; padding: 14px; }
        .juknis-dialog-actions { gap: 8px; }
        .juknis-open-link { font-size: .85rem; }
        .juknis-frame { height: 68vh; }
      }
    `;
    document.head.append(dialogStyles);

    const dialog = document.createElement("dialog");
    dialog.className = "juknis-dialog";
    dialog.setAttribute("aria-labelledby", "juknis-dialog-title");
    dialog.innerHTML = `
      <div class="juknis-dialog-header">
        <h2 id="juknis-dialog-title">Contoh Juknis Program</h2>
        <div class="juknis-dialog-actions">
          <a class="juknis-open-link" href="${juknisUrl}" target="_blank" rel="noopener noreferrer">Buka PDF ↗</a>
          <button class="juknis-close" type="button" aria-label="Tutup PDF">Tutup</button>
        </div>
      </div>
      <iframe class="juknis-frame" title="Pratinjau PDF contoh juknis"></iframe>
      <p class="juknis-fallback">Jika PDF belum tampil, pastikan file contoh juknis tersedia di <strong>${juknisUrl}</strong>, lalu coba buka PDF di tab baru.</p>
    `;
    document.body.append(dialog);

    const pdfFrame = dialog.querySelector(".juknis-frame");
    const closeButton = dialog.querySelector(".juknis-close");
    const openLink = dialog.querySelector(".juknis-open-link");

    function openJuknis(card) {
      const programName = card.querySelector("h3")?.textContent.trim() || "Program PiKIR";
      dialog.querySelector("#juknis-dialog-title").textContent = "Contoh Juknis — " + programName;
      pdfFrame.src = juknisUrl;
      dialog.showModal();
    }

    programCards.forEach(function (card) {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Buka contoh juknis PDF: " + (card.querySelector("h3")?.textContent.trim() || "Program"));

      const hint = document.createElement("span");
      hint.className = "program-open-hint";
      hint.textContent = "Lihat contoh juknis PDF →";
      hint.setAttribute("aria-hidden", "true");
      card.append(hint);

      card.addEventListener("click", function () {
        openJuknis(card);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openJuknis(card);
        }
      });
    });

    closeButton.addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      pdfFrame.src = "about:blank";
    });
    openLink.addEventListener("click", function () {
      // Keep the PDF available in the dialog while opening the separate tab.
      window.setTimeout(function () {
        if (dialog.open) pdfFrame.src = juknisUrl;
      }, 0);
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
