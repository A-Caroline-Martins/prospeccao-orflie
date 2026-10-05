function initShowcaseTabs() {
  const tabs = Array.from(document.querySelectorAll(".showcase-tab"));
  if (!tabs.length) return;

  const panels = tabs.map((tab) =>
    document.getElementById(tab.getAttribute("aria-controls")),
  );
  if (panels.some((panel) => !panel)) return;

  function select(index, focus) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    panels[index].classList.remove("is-entering");
    void panels[index].offsetWidth;
    panels[index].classList.add("is-entering");
    if (focus) tabs[index].focus();
    // No celular a barra rola de lado: mantém a aba escolhida visível
    tabs[index].scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i, false));
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      select(next, true);
    });
  });

  panels.forEach((panel, i) => {
    panel.hidden = i !== 0;
  });
}
