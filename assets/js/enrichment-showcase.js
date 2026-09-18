function initEnrichmentShowcase() {
  const card = document.querySelector('[data-animate="enrich"]');
  if (!card) return;

  const fields = Array.from(card.querySelectorAll(".mock-field"));
  const bar = card.querySelector(".mock-stat-bar");
  const success = card.querySelector(".mock-success");
  if (!fields.length || !bar || !success) return;

  const FIELD_DELAY = 750;
  const STEP_GAP = 250;
  const HOLD_DELAY = 2200;
  const RESTART_DELAY = 500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setFieldText(field, text) {
    const textEl = field.querySelector(".mock-field-text");
    if (textEl) textEl.textContent = text;
  }

  function reset() {
    fields.forEach((field) => {
      field.classList.remove("is-loading", "is-done");
      setFieldText(field, "—");
    });
    bar.style.transform = "scaleX(0)";
    success.classList.remove("is-visible");
  }

  function processField(index) {
    if (index >= fields.length) {
      success.classList.add("is-visible");
      setTimeout(() => {
        reset();
        setTimeout(() => processField(0), RESTART_DELAY);
      }, HOLD_DELAY);
      return;
    }

    const field = fields[index];
    field.classList.add("is-loading");
    setFieldText(field, "Buscando...");

    setTimeout(() => {
      field.classList.remove("is-loading");
      field.classList.add("is-done");
      setFieldText(field, field.dataset.value || "");
      bar.style.transform = `scaleX(${(index + 1) / fields.length})`;

      setTimeout(() => processField(index + 1), STEP_GAP);
    }, FIELD_DELAY);
  }

  if (reduceMotion) {
    fields.forEach((field) => {
      field.classList.add("is-done");
      setFieldText(field, field.dataset.value || "");
    });
    bar.style.transform = "scaleX(1)";
    success.classList.add("is-visible");
    return;
  }

  reset();
  setTimeout(() => processField(0), 600);
}
