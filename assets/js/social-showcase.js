function initSocialShowcase() {
  const card = document.querySelector('[data-animate="social"]');
  if (!card) return;

  const profiles = Array.from(card.querySelectorAll(".mock-profile"));
  const countEl = card.querySelector(".mock-count");
  if (!profiles.length || !countEl) return;

  const STEP_DELAY = 450;
  const HOLD_DELAY = 1800;
  const RESTART_DELAY = 500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  profiles.forEach((profile) => {
    const handleEl = profile.querySelector(".mock-profile-handle");
    const followersEl = profile.querySelector(".mock-profile-followers");
    if (handleEl) handleEl.textContent = profile.dataset.handle || "";
    if (followersEl) followersEl.textContent = profile.dataset.followers || "";
  });

  let index = 0;

  function bumpCount() {
    countEl.classList.remove("is-bumping");
    void countEl.offsetWidth;
    countEl.classList.add("is-bumping");
  }

  function reset() {
    profiles.forEach((profile) => profile.classList.remove("is-visible"));
    countEl.textContent = "0";
    index = 0;
  }

  function step() {
    if (index >= profiles.length) {
      setTimeout(() => {
        reset();
        setTimeout(step, RESTART_DELAY);
      }, HOLD_DELAY);
      return;
    }

    profiles[index].classList.add("is-visible");
    countEl.textContent = String(index + 1);
    bumpCount();

    index += 1;
    setTimeout(step, STEP_DELAY);
  }

  reset();

  if (reduceMotion) {
    profiles.forEach((profile) => profile.classList.add("is-visible"));
    countEl.textContent = String(profiles.length);
    return;
  }

  setTimeout(step, 600);
}
