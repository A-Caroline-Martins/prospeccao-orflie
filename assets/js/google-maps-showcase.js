function initGoogleMapsShowcase() {
  const card = document.querySelector('[data-animate="gmaps"]');
  if (!card) return;

  const pins = Array.from(card.querySelectorAll(".mock-map-pin"));
  const countEl = card.querySelector(".mock-count");
  const statusWrap = card.querySelector(".mock-status");
  const statusNameEl = card.querySelector(".mock-status-name");

  if (!pins.length || !countEl || !statusWrap || !statusNameEl) return;

  const STEP_DELAY = 550;
  const HOLD_DELAY = 1800;
  const RESTART_DELAY = 500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;

  function bumpCount() {
    countEl.classList.remove("is-bumping");
    void countEl.offsetWidth;
    countEl.classList.add("is-bumping");
  }

  function reset() {
    pins.forEach((pin) => pin.classList.remove("is-visible"));
    countEl.textContent = "0";
    statusNameEl.textContent = "Iniciando...";
    statusWrap.classList.remove("has-check");
    index = 0;
  }

  function step() {
    if (index >= pins.length) {
      setTimeout(() => {
        reset();
        setTimeout(step, RESTART_DELAY);
      }, HOLD_DELAY);
      return;
    }

    const pin = pins[index];
    pin.classList.add("is-visible");
    countEl.textContent = String(index + 1);
    statusNameEl.textContent = pin.dataset.name || "";
    statusWrap.classList.add("has-check");
    bumpCount();

    index += 1;
    setTimeout(step, STEP_DELAY);
  }

  reset();

  if (reduceMotion) {
    pins.forEach((pin) => pin.classList.add("is-visible"));
    countEl.textContent = String(pins.length);
    statusNameEl.textContent = pins[pins.length - 1].dataset.name || "";
    statusWrap.classList.add("has-check");
    return;
  }

  setTimeout(step, 700);
}
