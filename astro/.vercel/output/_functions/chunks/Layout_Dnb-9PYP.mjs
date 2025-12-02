import { c as createComponent, d as createAstro, b as addAttribute, g as renderScript, r as renderTemplate, a as renderComponent, q as renderHead, f as renderSlot } from './astro/server_BywjSWgj.mjs';
import 'piccolore';
/* empty css                         */
import 'clsx';

const $$Astro$1 = createAstro();
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/node_modules/astro/components/ClientRouter.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title ?? "Fauna Kite"}</title><link rel="preload" href="/fonts/salted-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous"><link rel="preload" href="/fonts/helvetica-neue-bold.woff2" as="font" type="font/woff2" crossorigin="anonymous"><link rel="preload" href="/fonts/helvetica-neue-light.woff2" as="font" type="font/woff2" crossorigin="anonymous">${renderComponent($$result, "ClientRouter", $$ClientRouter, { "data-astro-cid-sckkx6r4": true })}${renderHead()}</head> <body class="bg-brand-light text-white font-helvetica" data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
