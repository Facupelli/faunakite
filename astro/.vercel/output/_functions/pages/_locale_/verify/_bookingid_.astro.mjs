import '../../../chunks/page-ssr_Dpf2ClkG.mjs';
import { c as createComponent, d as createAstro, m as maybeRenderHead, a as renderComponent, r as renderTemplate, b as addAttribute } from '../../../chunks/astro/server_BywjSWgj.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_Dnb-9PYP.mjs';
import { G as GoogleSheetsBookingRepository } from '../../../chunks/google-sheet-booking.repository_C_AjDjB3.mjs';
import { $ as $$Icon } from '../../../chunks/Icon_CfcXjacy.mjs';
import { u as useTranslations } from '../../../chunks/utils_Be16LUB3.mjs';
import 'clsx';
export { renderers } from '../../../renderers.mjs';

async function getBookingByIdUseCase(dependencies, bookingId) {
  const { bookingRepository } = dependencies;
  const booking = await bookingRepository.findById(bookingId);
  return booking;
}
function getBookingUseCaseFactory(dependencies) {
  return (bookingId) => getBookingByIdUseCase(dependencies, bookingId);
}
const getBookingById = getBookingUseCaseFactory({
  bookingRepository: GoogleSheetsBookingRepository
});

const $$Astro$3 = createAstro();
const $$BookingNotFound = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$BookingNotFound;
  const { bookingId } = Astro2.props;
  const lang = Astro2.params.locale;
  const t = useTranslations(lang);
  return renderTemplate`${maybeRenderHead()}<div> <div class="flex justify-center pb-10"> <span class="font-salted text-4xl text-white">FAUNA KITE</span> </div> <div class="flex flex-col items-center justify-center rounded-4xl bg-white p-12 text-center shadow-sm"> ${renderComponent($$result, "Icon", $$Icon, { "name": "zoom-out", "class": "text-brand-blue/50 size-12" })} <h3 class="mt-2 text-lg font-bold text-gray-900"> ${t("booking-not-found.title")} </h3> <p class="mt-1 text-sm text-gray-500"> ${t("booking-not-found.subtitle")} </p> ${bookingId && renderTemplate`<p class="mt-4 font-mono text-xs text-gray-400">${bookingId}</p>`} </div> </div>`;
}, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/components/verify/booking-not-found.astro", void 0);

const $$Astro$2 = createAstro();
const $$DataField = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DataField;
  const { label, value } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4"> <dt class="text-sm font-bold text-gray-500 uppercase">${label}</dt> <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">${value}</dd> </div>`;
}, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/components/verify/data-field.astro", void 0);

const $$Astro$1 = createAstro();
const $$VerificationCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$VerificationCard;
  const { studentName, courseName, expiryDate } = Astro2.props;
  const expiry = new Date(expiryDate);
  const isValid = expiry > /* @__PURE__ */ new Date();
  function formatDate(date) {
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return renderTemplate`${maybeRenderHead()}<section> <div class="py-10"> <h1 class="font-salted text-center text-4xl uppercase">Fauna Kite</h1> </div> <div class="overflow-hidden rounded-4xl bg-white max-w-2xl mx-auto"> <div class="border-b border-gray-200 px-4 py-5 sm:px-6 text-center"> <h3${addAttribute(`text-2xl font-bold leading-6 uppercase ${isValid ? "text-green-600" : "text-red-600"}`, "class")}> ${isValid ? "\u2705 Alumno V\xE1lido" : "\u274C Expirado"} </h3> </div> <div class="border-b border-gray-200 px-4 py-5 sm:px-6"> <dl class="divide-y divide-gray-200"> ${renderComponent($$result, "DataField", $$DataField, { "label": "Nombre", "value": studentName })} ${renderComponent($$result, "DataField", $$DataField, { "label": "Curso", "value": courseName })} ${renderComponent($$result, "DataField", $$DataField, { "label": "V\xE1lido Hasta", "value": formatDate(expiry) })} </dl> </div> </div> </section>`;
}, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/components/verify/verification-card.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$bookingId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$bookingId;
  const { bookingId } = Astro2.params;
  let booking = null;
  if (bookingId) {
    booking = await getBookingById(bookingId);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Verificar Alumno" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"> ${booking ? renderTemplate`${renderComponent($$result2, "VerificationCard", $$VerificationCard, { "studentName": booking.customerName, "courseName": booking.courseType, "expiryDate": booking.departureDate.toISOString() })}` : renderTemplate`${renderComponent($$result2, "BookingNotFound", $$BookingNotFound, { "bookingId": bookingId })}`} </div> ` })}`;
}, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/verify/[bookingId].astro", void 0);

const $$file = "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/verify/[bookingId].astro";
const $$url = "/[locale]/verify/[bookingId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$bookingId,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
