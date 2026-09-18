function initReceitaFederalShowcase() {
  const card = document.querySelector('[data-animate="rf-count"]');
  if (!card) return;

  const numberEl = card.querySelector("[data-count-target]");
  const statEl = card.querySelector(".mock-stat");
  if (!numberEl || !statEl) return;

  const target = parseInt(numberEl.dataset.countTarget, 10) || 0;
  const COUNT_DURATION = 1500;
  const HOLD_DELAY = 1800;
  const RESTART_DELAY = 400;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatNumber(value) {
    return value.toLocaleString("pt-BR");
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount() {
    statEl.setAttribute("data-counting", "start");
    numberEl.textContent = formatNumber(0);

    setTimeout(() => {
      statEl.setAttribute("data-counting", "done");
      const start = Date.now();

      function tick() {
        const progress = Math.min((Date.now() - start) / COUNT_DURATION, 1);
        const value = Math.round(easeOutCubic(progress) * target);
        numberEl.textContent = formatNumber(value);

        if (progress < 1) {
          setTimeout(tick, 30);
        } else {
          setTimeout(() => setTimeout(animateCount, RESTART_DELAY), HOLD_DELAY);
        }
      }

      tick();
    }, 20);
  }

  if (reduceMotion) {
    numberEl.textContent = formatNumber(target);
    statEl.setAttribute("data-counting", "done");
    return;
  }

  animateCount();
}
