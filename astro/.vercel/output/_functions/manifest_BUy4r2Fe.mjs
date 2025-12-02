import 'piccolore';
import { v as decodeKey } from './chunks/astro/server_BywjSWgj.mjs';
import 'clsx';
import 'cookie';
import './chunks/astro-designed-error-pages_D-PdiQqQ.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_BjqedzJH.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/","cacheDir":"file:///C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/node_modules/.astro/","outDir":"file:///C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/dist/","srcDir":"file:///C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/","publicDir":"file:///C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/public/","buildClientDir":"file:///C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/dist/client/","buildServerDir":"file:///C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"fallback","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_actions/[...path]","pattern":"^\\/_actions(?:\\/(.*?))?\\/?$","segments":[[{"content":"_actions","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"node_modules/astro/dist/actions/runtime/route.js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DBxK6_5P.css"},{"type":"inline","content":"@keyframes astroFadeInOut{0%{opacity:1}to{opacity:0}}@keyframes astroFadeIn{0%{opacity:0;mix-blend-mode:plus-lighter}to{opacity:1;mix-blend-mode:plus-lighter}}@keyframes astroFadeOut{0%{opacity:1;mix-blend-mode:plus-lighter}to{opacity:0;mix-blend-mode:plus-lighter}}@keyframes astroSlideFromRight{0%{transform:translate(100%)}}@keyframes astroSlideFromLeft{0%{transform:translate(-100%)}}@keyframes astroSlideToRight{to{transform:translate(100%)}}@keyframes astroSlideToLeft{to{transform:translate(-100%)}}@media(prefers-reduced-motion){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}[data-astro-transition-scope]{animation:none!important}}\n"}],"routeData":{"route":"/[locale]/booked","isIndex":false,"type":"page","pattern":"^\\/([^/]+?)\\/booked\\/?$","segments":[[{"content":"locale","dynamic":true,"spread":false}],[{"content":"booked","dynamic":false,"spread":false}]],"params":["locale"],"component":"src/pages/[locale]/booked.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DBxK6_5P.css"}],"routeData":{"route":"/[locale]/verify/[bookingid]","isIndex":false,"type":"page","pattern":"^\\/([^/]+?)\\/verify\\/([^/]+?)\\/?$","segments":[[{"content":"locale","dynamic":true,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}],[{"content":"bookingId","dynamic":true,"spread":false}]],"params":["locale","bookingId"],"component":"src/pages/[locale]/verify/[bookingId].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/booked.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/[locale]/booked@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/3/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/allies.astro",{"propagation":"none","containsHead":true}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/booked-success.astro",{"propagation":"none","containsHead":true}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/news.astro",{"propagation":"none","containsHead":true}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/news/[slug].astro",{"propagation":"none","containsHead":true}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/qr.astro",{"propagation":"none","containsHead":true}],["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/pages/[locale]/verify/[bookingId].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/entrypoint":"entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:node_modules/astro/dist/actions/runtime/route@_@js":"pages/_actions/_---path_.astro.mjs","\u0000@astro-page:src/pages/[locale]/3/index@_@astro":"pages/_locale_/3.astro.mjs","\u0000@astro-page:src/pages/[locale]/allies@_@astro":"pages/_locale_/allies.astro.mjs","\u0000@astro-page:src/pages/[locale]/booked@_@astro":"pages/_locale_/booked.astro.mjs","\u0000@astro-page:src/pages/[locale]/booked-success@_@astro":"pages/_locale_/booked-success.astro.mjs","\u0000@astro-page:src/pages/[locale]/news/[slug]@_@astro":"pages/_locale_/news/_slug_.astro.mjs","\u0000@astro-page:src/pages/[locale]/news@_@astro":"pages/_locale_/news.astro.mjs","\u0000@astro-page:src/pages/[locale]/qr@_@astro":"pages/_locale_/qr.astro.mjs","\u0000@astro-page:src/pages/[locale]/verify/[bookingId]@_@astro":"pages/_locale_/verify/_bookingid_.astro.mjs","\u0000@astro-page:src/pages/[locale]/index@_@astro":"pages/_locale_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BUy4r2Fe.mjs","C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_-3qo_T2R.mjs","C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/components/nav.astro?astro&type=script&index=0&lang.ts":"_astro/nav.astro_astro_type_script_index_0_lang.B1ZG_qoW.js","C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/components/newsletter.astro?astro&type=script&index=0&lang.ts":"_astro/newsletter.astro_astro_type_script_index_0_lang.BCsEZU3z.js","C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CwlK1e6z.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/src/components/nav.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"mobile-menu-button\"),o=document.getElementById(\"mobile-menu-close\"),e=document.getElementById(\"mobile-menu\"),s=e?.querySelectorAll(\"a\");function c(){e?.classList.remove(\"hidden\"),t?.setAttribute(\"aria-expanded\",\"true\"),document.body.style.overflow=\"hidden\"}function d(){e?.classList.add(\"hidden\"),t?.setAttribute(\"aria-expanded\",\"false\"),document.body.style.overflow=\"\"}t?.addEventListener(\"click\",c);o?.addEventListener(\"click\",d);s?.forEach(n=>{n.addEventListener(\"click\",d)});document.addEventListener(\"keydown\",n=>{n.key===\"Escape\"&&!e?.classList.contains(\"hidden\")&&d()});"]],"assets":["/_astro/FaunaKite_LogoBlanco-03.Da3Ycs54.png","/_astro/about-us-photo.8r1tCCqr.webp","/_astro/kite-camps.BrAu-Uhx.webp","/_astro/courses.MM60VH98.webp","/_astro/rental.d2hECat2.webp","/_astro/travels.CGApjyfj.webp","/_astro/the-spot-photo.VjvItGsj.svg","/_astro/community-photo.CXAz14nM.svg","/_astro/index.DBxK6_5P.css","/cuesta-del-viento.svg","/donde-siempre-sopla.svg","/favicon.svg","/fonts/gt-america.woff2","/fonts/helvetica-neue-bold.woff2","/fonts/helvetica-neue-light.woff2","/fonts/salted-regular.woff2","/logos/logo-blanco-square.png","/videos/about.webm","/_astro/client.B9YBqyHK.js","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CwlK1e6z.js","/_astro/newsletter.astro_astro_type_script_index_0_lang.BCsEZU3z.js","/index.html","/index.html"],"i18n":{"fallbackType":"redirect","strategy":"pathname-prefix-always","locales":["en","es"],"defaultLocale":"es","domainLookupTable":{}},"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"BY+4gOdoAynQYL3HfLj84BPX5Fm2BrlVioFA3jw8uMQ="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
