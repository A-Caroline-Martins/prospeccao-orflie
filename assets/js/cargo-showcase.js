function initCargoShowcase() {
  const card = document.querySelector('[data-animate="cargo"]');
  if (!card) return;

  const steps = Array.from(card.querySelectorAll(".mock-step"));
  const person = card.querySelector(".mock-person");
  const avatarEl = card.querySelector(".mock-person-avatar");
  const nameEl = card.querySelector(".mock-person-name");
  const roleEl = card.querySelector(".mock-person-role");
  const guesses = Array.from(card.querySelectorAll(".mock-guess"));
  const countEl = card.querySelector(".mock-count");
  if (!steps.length || !person || !guesses.length || !countEl) return;

  // Cada pessoa: o e-mail certo é o que tem `valid: true`
  const PEOPLE = [
    {
      initials: "MC",
      name: "Mariana Costa",
      role: "Gerente de RH · TransLog Cargas",
      emails: [
        { text: "mcosta@translog.com.br" },
        { text: "mariana@translog.com.br" },
        { text: "mariana.costa@translog.com.br", valid: true },
      ],
    },
    {
      initials: "RL",
      name: "Rafael Lima",
      role: "Diretor de TI · Rota Sul Logística",
      emails: [
        { text: "rafael.lima@rotasul.com.br" },
        { text: "rlima@rotasul.com.br", valid: true },
        { text: "rafael@rotasul.com.br" },
      ],
    },
    {
      initials: "JA",
      name: "Juliana Alves",
      role: "Supervisora de RH · Expresso PR",
      emails: [
        { text: "juliana@expressopr.com.br", valid: true },
        { text: "jalves@expressopr.com.br" },
        { text: "juliana.alves@expressopr.com.br" },
      ],
    },
  ];

  const STEP_DELAY = 700;
  const GUESS_DELAY = 650;
  const HOLD_DELAY = 1600;
  const RESTART_DELAY = 500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let personIndex = 0;
  let found = 0;

  function setStep(active) {
    steps.forEach((step, i) => {
      step.classList.toggle("is-active", i + 1 === active);
      step.classList.toggle("is-done", i + 1 < active);
    });
  }

  function fillPerson(data) {
    avatarEl.textContent = data.initials;
    nameEl.textContent = data.name;
    roleEl.textContent = data.role;
    guesses.forEach((guess, i) => {
      guess.className = "mock-guess";
      guess.querySelector(".mock-guess-text").textContent = data.emails[i].text;
      guess.querySelector(".mock-guess-icon").className = "mock-guess-icon";
    });
  }

  function markGuess(guess, valid) {
    guess.classList.remove("is-testing");
    guess.classList.add(valid ? "is-valid" : "is-invalid");
    guess.querySelector(".mock-guess-icon").className =
      "mock-guess-icon fa-solid " + (valid ? "fa-circle-check" : "fa-xmark");
  }

  function bumpCount() {
    countEl.classList.remove("is-bumping");
    void countEl.offsetWidth;
    countEl.classList.add("is-bumping");
  }

  function testGuess(data, i) {
    if (i >= guesses.length) {
      guesses.forEach((guess) => {
        if (!guess.classList.contains("is-valid") && !guess.classList.contains("is-invalid")) {
          guess.classList.add("is-skipped");
        }
      });
      setStep(4);
      found += 1;
      countEl.textContent = String(found);
      bumpCount();
      setTimeout(nextPerson, HOLD_DELAY);
      return;
    }

    const guess = guesses[i];
    guess.classList.add("is-testing");
    guess.querySelector(".mock-guess-icon").className =
      "mock-guess-icon fa-solid fa-circle-notch";

    setTimeout(() => {
      const valid = Boolean(data.emails[i].valid);
      markGuess(guess, valid);
      // Achou o válido: os palpites restantes nem precisam ser testados
      setTimeout(() => testGuess(data, valid ? guesses.length : i + 1), GUESS_DELAY / 2);
    }, GUESS_DELAY);
  }

  function runPerson() {
    const data = PEOPLE[personIndex];
    person.classList.remove("is-visible");
    fillPerson(data);
    setStep(1);

    setTimeout(() => {
      setStep(2);
      person.classList.add("is-visible");
      setTimeout(() => {
        setStep(3);
        testGuess(data, 0);
      }, STEP_DELAY);
    }, STEP_DELAY);
  }

  function nextPerson() {
    personIndex += 1;
    if (personIndex >= PEOPLE.length) {
      personIndex = 0;
      found = 0;
      countEl.textContent = "0";
      setTimeout(runPerson, RESTART_DELAY);
      return;
    }
    runPerson();
  }

  if (reduceMotion) {
    const data = PEOPLE[0];
    fillPerson(data);
    person.classList.add("is-visible");
    guesses.forEach((guess, i) => markGuess(guess, Boolean(data.emails[i].valid)));
    setStep(4);
    countEl.textContent = String(PEOPLE.length);
    return;
  }

  fillPerson(PEOPLE[0]);
  setTimeout(runPerson, 600);
}
