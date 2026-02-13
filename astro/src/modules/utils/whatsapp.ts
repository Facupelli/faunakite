import { INSTRUCTORS_PHONE } from "../../constants";

export function getRandomInstructor() {
  return Math.random() < 0.5 ? INSTRUCTORS_PHONE.lucca : INSTRUCTORS_PHONE.facu;
}

export function createWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function initializeWhatsAppButtons(
  messageMap: Record<string, Record<string, string>>,
  lang: string,
) {
  const phone = getRandomInstructor(); // One instructor for all buttons on this page load

  // Use more specific selector to get all whatsapp buttons
  const whatsappButtons =
    document.querySelectorAll<HTMLAnchorElement>(".whatsapp-btn");

  whatsappButtons.forEach((btn) => {
    const courseCard = btn.closest("[data-course-type]");

    if (!courseCard) {
      console.warn("WhatsApp button found without parent course card", btn);
      return;
    }

    const courseType = courseCard.getAttribute("data-course-type");

    if (!courseType) {
      console.warn("Course card missing data-course-type", courseCard);
      return;
    }

    const message = messageMap[courseType]?.[lang];

    if (!message) {
      console.warn(
        `No message found for courseType: ${courseType}, lang: ${lang}`,
      );
      return;
    }

    const whatsappUrl = createWhatsAppLink(phone, message);
    btn.href = whatsappUrl;
  });
}

export function initializeWhatsAppButton(selector: string, message: string) {
  const button = document.querySelector<HTMLAnchorElement>(selector);
  if (button) {
    const phone = getRandomInstructor();
    button.href = createWhatsAppLink(phone, message);
  }
}
