import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CsHAUEXe.mjs';
import { manifest } from './manifest_BUy4r2Fe.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/_actions/_---path_.astro.mjs');
const _page2 = () => import('./pages/_locale_/3.astro.mjs');
const _page3 = () => import('./pages/_locale_/allies.astro.mjs');
const _page4 = () => import('./pages/_locale_/booked.astro.mjs');
const _page5 = () => import('./pages/_locale_/booked-success.astro.mjs');
const _page6 = () => import('./pages/_locale_/news/_slug_.astro.mjs');
const _page7 = () => import('./pages/_locale_/news.astro.mjs');
const _page8 = () => import('./pages/_locale_/qr.astro.mjs');
const _page9 = () => import('./pages/_locale_/verify/_bookingid_.astro.mjs');
const _page10 = () => import('./pages/_locale_.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["node_modules/astro/dist/actions/runtime/route.js", _page1],
    ["src/pages/[locale]/3/index.astro", _page2],
    ["src/pages/[locale]/allies.astro", _page3],
    ["src/pages/[locale]/booked.astro", _page4],
    ["src/pages/[locale]/booked-success.astro", _page5],
    ["src/pages/[locale]/news/[slug].astro", _page6],
    ["src/pages/[locale]/news.astro", _page7],
    ["src/pages/[locale]/qr.astro", _page8],
    ["src/pages/[locale]/verify/[bookingId].astro", _page9],
    ["src/pages/[locale]/index.astro", _page10],
    ["src/pages/index.astro", _page11]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "b0db3547-7c80-4227-bf38-7d563dc4f7ff",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
