/**
 * Integración del formulario de newsletter de saravrai.com con MailerLite
 *
 * Este script conecta el formulario existente (.nl-form) con la API de MailerLite
 * usando su Universal JavaScript snippet.
 *
 * Grupo: "Lista de Espera — Sara Vrai" (ID: 181330492199536147)
 * Formulario: "Newsletter — Sara Vrai" (ID: 181330494966728632)
 * Cuenta: 2170745
 */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".nl-form");
  const emailInput = form?.querySelector(".email-input");
  const submitBtn = form?.querySelector(".subscribe-btn");

  if (!form || !emailInput || !submitBtn) {
    console.warn("[MailerLite] No se encontró el formulario de newsletter.");
    return;
  }

  // ID del grupo en MailerLite donde se añadirán los suscriptores
  const MAILERLITE_GROUP_ID = "181330492199536147";

  // ── Manejo del envío ──────────────────────────────────────────────
  form.addEventListener("submit", handleSubscribe);
  submitBtn.addEventListener("click", function (e) {
    // Si el formulario no es un <form>, manejamos el click directamente
    if (form.tagName !== "FORM") {
      e.preventDefault();
      handleSubscribe(e);
    }
  });

  async function handleSubscribe(e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Validación básica del email
    if (!email || !isValidEmail(email)) {
      showMessage("Por favor, introduce un email válido.", "error");
      return;
    }

    // Deshabilitar botón mientras se envía
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(
        "https://assets.mailerlite.com/jsonp/2170745/forms/181330494966728632/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fields: { email: email },
            groups: [MAILERLITE_GROUP_ID],
            ml_submit: 1,
            anticsrf: true,
          }),
        },
      );

      if (response.ok) {
        showMessage(
          "¡Gracias! Te has suscrito correctamente a la Lista de Espera.",
          "success",
        );
        emailInput.value = "";
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("[MailerLite] Error:", error);

      // Fallback: intentar con el método universal de MailerLite
      try {
        if (typeof ml === "function") {
          ml("subscribe", {
            formId: "181330494966728632",
            fields: { email: email },
          });
          showMessage(
            "¡Gracias! Te has suscrito correctamente a la Lista de Espera.",
            "success",
          );
          emailInput.value = "";
        } else {
          showMessage("Hubo un error. Por favor, inténtalo de nuevo.", "error");
        }
      } catch (fallbackError) {
        showMessage("Hubo un error. Por favor, inténtalo de nuevo.", "error");
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  // ── Utilidades ────────────────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMessage(text, type) {
    // Eliminar mensaje anterior si existe
    const existing = form.querySelector(".nl-message");
    if (existing) existing.remove();

    const msg = document.createElement("div");
    msg.className = "nl-message";
    msg.textContent = text;
    msg.style.cssText = `
      margin-top: 12px;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
      animation: fadeIn 0.3s ease;
      color: ${type === "success" ? "#d4edda" : "#f8d7da"};
      background: ${type === "success" ? "rgba(40, 167, 69, 0.15)" : "rgba(220, 53, 69, 0.15)"};
      border: 1px solid ${type === "success" ? "rgba(40, 167, 69, 0.3)" : "rgba(220, 53, 69, 0.3)"};
    `;
    form.appendChild(msg);

    // Desaparece después de 5 segundos
    setTimeout(() => {
      msg.style.opacity = "0";
      msg.style.transition = "opacity 0.3s ease";
      setTimeout(() => msg.remove(), 300);
    }, 5000);
  }
});
