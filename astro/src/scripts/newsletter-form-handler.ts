import { actions } from "astro:actions";

export function initNewsletter() {
  const form = document.getElementById("newsletter-form") as HTMLFormElement;
  const dialog = document.getElementById(
    "newsletter-dialog"
  ) as HTMLDialogElement;
  const dialogIcon = document.getElementById("dialog-icon") as HTMLDivElement;
  const dialogTitle = document.getElementById(
    "dialog-title"
  ) as HTMLHeadingElement;
  const dialogMessage = document.getElementById(
    "dialog-message"
  ) as HTMLParagraphElement;
  const dialogClose = document.getElementById(
    "dialog-close"
  ) as HTMLButtonElement;

  if (!form || !dialog) return;

  function showDialog(success: boolean, title: string, message: string) {
    if (success) {
      dialogIcon.className =
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-green-100";
      dialogIcon.innerHTML = `
        <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      `;
    } else {
      dialogIcon.className =
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-red-100";
      dialogIcon.innerHTML = `
        <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      `;
    }

    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    dialog.showModal();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    const emailInput = form.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
      const formData = new FormData(form);
      const { data, error } = await actions.newsletter.subscribe(formData);

      if (error) {
        showDialog(
          false,
          "La suscripción falló",
          error.message || "Error al suscribir. Por favor, inténtelo de nuevo."
        );
      } else {
        showDialog(
          true,
          "¡Suscripción exitosa!",
          data?.message || "Gracias por suscribirte a nuestro boletín"
        );
        form.reset();
      }
    } catch (err) {
      showDialog(
        false,
        "La suscripción falló",
        "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send";
    }
  });

  dialogClose.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (e) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (clickedOutside) {
      dialog.close();
    }
  });
}
