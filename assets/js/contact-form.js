// Orflie CRM - Captura de Formulário
function initContactForm() {
  document.querySelectorAll(".js-contact-form").forEach(setupContactForm);
}

function setupContactForm(form) {
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  const buttonHtml = button.innerHTML;
  const WEBHOOK_URL =
    "https://orflia.ai/api/webhooks/formulario/82a7480a-3ca9-4995-87ab-08828ece3600";

  const SUCCESS_DURATION = 3000;
  let hideTimer;

  function clearStatus() {
    clearTimeout(hideTimer);
    status.className = "form-status";
    status.textContent = "";
  }

  function showStatus(type, text) {
    clearTimeout(hideTimer);
    status.className = "form-status is-" + type;
    status.textContent = text;
    if (type === "success") {
      hideTimer = setTimeout(clearStatus, SUCCESS_DURATION);
    }
  }

  function setSending(sending) {
    button.disabled = sending;
    button.innerHTML = sending
      ? 'Enviando... <i class="fa-solid fa-circle-notch fa-spin"></i>'
      : buttonHtml;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (button.disabled) return;

    const data = {};
    new FormData(form).forEach((v, k) => {
      data[k] = v;
    });

    setSending(true);
    clearStatus();

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.ok) throw new Error("Resposta sem ok do CRM");
        showStatus("success", "Obrigado! Entraremos em contato em breve.");
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        showStatus(
          "error",
          "Não foi possível enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.",
        );
      })
      .finally(() => setSending(false));
  });
}
