import { INSTRUCTORS_PHONE } from "../../constants";

export function getRandomInstructor() {
  return Math.random() < 0.5 ? INSTRUCTORS_PHONE.lucca : INSTRUCTORS_PHONE.facu;
}

export function createWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function initializeWhatsAppButtons(messageMap: Record<string, string>) {
  const courses = document.querySelectorAll("[data-course-type]");
  const phone = getRandomInstructor(); // One instructor for all buttons on this page load

  courses.forEach((course) => {
    const courseType = course.dataset.courseType;
    const whatsappBtn = course.querySelector(".whatsapp-btn");
    const message = messageMap[courseType];

    if (whatsappBtn && message) {
      whatsappBtn.href = createWhatsAppLink(phone, message);
    }
  });
}

export function initializeWhatsAppButton(selector: string, message: string) {
  const button = document.querySelector<HTMLAnchorElement>(selector);
  if (button) {
    const phone = getRandomInstructor();
    button.href = createWhatsAppLink(phone, message);
  }
}
