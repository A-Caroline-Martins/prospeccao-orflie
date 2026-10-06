// Navbar com sombra ao rolar + elementos que surgem ao entrar na tela
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const update = () => navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!items.length || reduceMotion || !("IntersectionObserver" in window)) return;

  // Cards lado a lado entram em cascata
  document.querySelectorAll(".features-cards, .comparison-grid").forEach((group) => {
    group.querySelectorAll("[data-reveal]").forEach((el, i) => {
      el.style.animationDelay = i * 90 + "ms";
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  items.forEach((el) => {
    el.classList.add("will-reveal");
    observer.observe(el);
  });
}
