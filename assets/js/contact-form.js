// Orflie CRM - Captura de Formulário
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  const buttonHtml = button.innerHTML;
  const WEBHOOK_URL =
    "https://orflia.ai/api/webhooks/formulario/82a7480a-3ca9-4995-87ab-08828ece3600";

  function showStatus(type, text) {
    status.className = "form-status is-" + type;
    status.textContent = text;
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
    status.className = "form-status";
    status.textContent = "";

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
