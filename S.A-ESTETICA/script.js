const CONFIG = {
  whatsapp: "55 41 8833-2794",
  empresa: "S.A Estética Automotiva"
};

const form = document.querySelector("#booking-form");
const phoneInput = document.querySelector("#phone");
const dateInput = document.querySelector("#date");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
dateInput.min = localDate;

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function setFieldError(fieldId, message) {
  const field = document.querySelector(`#${fieldId}`);
  const wrapper = field.closest(".field");
  const error = document.querySelector(`#${fieldId}-error`);
  wrapper.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", Boolean(message));
  error.textContent = message;
}

function validateForm() {
  const values = new FormData(form);
  const phoneDigits = values.get("phone").replace(/\D/g, "");
  const errors = {
    name: values.get("name").trim() ? "" : "Informe seu nome.",
    phone: phoneDigits.length === 11 ? "" : "Informe um WhatsApp válido.",
    vehicle: values.get("vehicle") ? "" : "Selecione seu veículo.",
    service: values.get("service") ? "" : "Selecione um serviço.",
    date: values.get("date") ? (values.get("date") < dateInput.min ? "Escolha uma data válida." : "") : "Informe a data desejada."
  };

  Object.entries(errors).forEach(([fieldId, message]) => setFieldError(fieldId, message));
  return Object.values(errors).every((message) => !message);
}

phoneInput.addEventListener("input", (event) => {
  event.target.value = formatPhone(event.target.value);
  setFieldError("phone", "");
});

form.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    const error = document.querySelector(`#${field.id}-error`);
    if (error && error.textContent) setFieldError(field.id, "");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const feedback = document.querySelector("#form-feedback");
  feedback.textContent = "";

  if (!validateForm()) {
    const firstInvalid = form.querySelector("[aria-invalid='true']");
    firstInvalid?.focus();
    return;
  }

  const values = new FormData(form);
  const note = values.get("note").trim() || "Não informada";
  const message = [
    `Olá! Gostaria de solicitar um agendamento na ${CONFIG.empresa}.`,
    "",
    `Nome: ${values.get("name").trim()}`,
    `WhatsApp: ${values.get("phone")}`,
    `Veículo: ${values.get("vehicle")}`,
    `Serviço: ${values.get("service")}`,
    `Data desejada: ${values.get("date").split("-").reverse().join("/")}`,
    `Observação: ${note}`
  ].join("\n");

  if (CONFIG.whatsapp === "SEU_NUMERO_AQUI") {
    feedback.textContent = "Configure o número do WhatsApp no script.js para continuar.";
    return;
  }

  const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  feedback.textContent = "Abrindo o WhatsApp com seu pedido...";
});

function closeMenu() {
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
