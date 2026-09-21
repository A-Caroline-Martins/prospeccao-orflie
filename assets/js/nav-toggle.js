function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  const icon = toggle.querySelector("i");
  const MOBILE_BREAKPOINT = 900;

  function setIcon(isOpen) {
    if (!icon) return;
    icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    setIcon(false);
  }

  function toggleMenu() {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    setIcon(isOpen);
  }

  toggle.addEventListener("click", toggleMenu);

  menu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
  });
}
