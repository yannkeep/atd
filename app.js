(function () {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const themeLabel = document.querySelector("[data-theme-label]");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem("qd-theme", theme); } catch (_) {}
    const dark = theme === "dark";
    if (themeIcon) themeIcon.textContent = dark ? "☼" : "◐";
    if (themeLabel) themeLabel.textContent = dark ? "Clair" : "Sombre";
    if (themeButton) themeButton.setAttribute("aria-label", dark ? "Activer le thème clair" : "Activer le thème sombre");
  }

  if (themeButton) themeButton.addEventListener("click", function () {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
  applyTheme(root.dataset.theme === "light" ? "light" : "dark");

  document.querySelectorAll(".accordion-item button").forEach(function (button) {
    button.addEventListener("click", function () {
      const item = button.closest(".accordion-item");
      const answer = item && item.querySelector(".accordion-answer");
      if (!item || !answer) return;
      const willOpen = !item.classList.contains("is-open");
      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      answer.hidden = !willOpen;
    });
  });

  let completed = [];
  try {
    const parsed = JSON.parse(localStorage.getItem("qd-actions") || "[]");
    if (Array.isArray(parsed)) completed = parsed.filter(function (value) { return Number.isInteger(value) && value >= 0 && value < 5; });
  } catch (_) {}

  function renderProgress() {
    document.querySelectorAll("[data-action]").forEach(function (button) {
      const index = Number(button.dataset.action);
      const done = completed.includes(index);
      const item = button.closest("[data-action-item]");
      button.setAttribute("aria-pressed", String(done));
      button.setAttribute("aria-label", (done ? "Décocher : " : "Cocher : ") + (item.querySelector("h3") || {}).textContent);
      const marker = button.querySelector("span");
      if (marker) marker.textContent = done ? "✓" : String(index + 1);
      if (item) item.classList.toggle("is-done", done);
    });
    const percent = Math.round(completed.length / 5 * 100);
    const ring = document.querySelector("[data-progress-ring]");
    const number = document.querySelector("[data-progress]");
    const count = document.querySelector("[data-progress-count]");
    if (ring) ring.style.setProperty("--progress", (percent * 3.6) + "deg");
    if (number) number.textContent = percent + "%";
    if (count) count.textContent = completed.length + "/5";
  }

  document.querySelectorAll("[data-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.dataset.action);
      completed = completed.includes(index) ? completed.filter(function (value) { return value !== index; }) : completed.concat(index);
      try { localStorage.setItem("qd-actions", JSON.stringify(completed)); } catch (_) {}
      renderProgress();
    });
  });
  renderProgress();

  const note = document.querySelector("#gratitude-note");
  const noteCount = document.querySelector("[data-note-count]");
  const saveNote = document.querySelector("[data-save-note]");
  try { if (note) note.value = localStorage.getItem("qd-note") || ""; } catch (_) {}
  function renderNoteCount() { if (noteCount && note) noteCount.textContent = note.value.length + "/420"; }
  if (note) note.addEventListener("input", renderNoteCount);
  if (saveNote && note) saveNote.addEventListener("click", function () {
    try { localStorage.setItem("qd-note", note.value.trim()); } catch (_) {}
    saveNote.textContent = "C’est gardé ✓";
    window.setTimeout(function () { saveNote.textContent = "Garder ma note"; }, 1800);
  });
  renderNoteCount();

  const countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let target = new Date(now.getFullYear(), 9, 17);
    if (target < today) target = new Date(now.getFullYear() + 1, 9, 17);
    const days = Math.ceil((target.getTime() - today.getTime()) / 86400000);
    countdown.textContent = days === 0 ? "Aujourd’hui" : "J−" + days;
  }
})();
