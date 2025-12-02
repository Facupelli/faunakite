import { c as createComponent, d as createAstro, m as maybeRenderHead, s as spreadAttributes, b as addAttribute, r as renderTemplate, a as renderComponent, p as Fragment, u as unescapeHTML } from './astro/server_BywjSWgj.mjs';
import { getIconData, iconToSVG } from '@iconify/utils';

const icons = {"local":{"prefix":"local","lastModified":1764711584,"icons":{"check-circle":{"body":"<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m9 12 2 2 4-4\"/></g>"},"chevron-down":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.6\" d=\"m6 9 6 6 6-6\"/>"},"courses":{"body":"<path fill=\"currentColor\" stroke=\"currentColor\" d=\"M49.65 35.09c-1-1.62-1.76-2.28-1.76-2.93 0-1.06.24-2.72.89-3s2.3.16 3.13.8a28 28 0 0 1 3.38 3.64 6 6 0 0 1 .82 1.05c1.46 2.69 3 5.33 4.28 8.12.72 1.59 1.15 3.51-1.47 4.07l-.3-4.19-8.4 7.21.39.67c.81 0 1.79-.29 2.41.06 1.07.6 2.35 1.44 2.72 2.47A3.33 3.33 0 0 1 54.48 56a35.36 35.36 0 0 1-16.6 5c-2.17.12-3.67-1-3.54-3.07A3.84 3.84 0 0 1 37 55.35c4.32-.58 6.7-2.48 6.45-7.15-.17-3.15 1.87-4.59 4.71-5.09 3-.54 3.91-1.9 1.91-4.49-6.23.36-11-2.31-15.36-6.89 3.35-1 4.69 6.11 8.52 1.5l-4.91-5.51c5.37 2.51 7.08 4.91 5.62 8.79Zm-.72 12.18c-4.2-.3-3.56 2.49-3.72 4.28-.25 2.89-.59 5.18-4.44 4.42a6.55 6.55 0 0 0-3.26.61c-.61.23-1 1-1.54 1.45.65.44 1.44 1.39 1.94 1.26 5.14-1.36 10.24-2.87 15.32-4.45.41-.12.57-1 .85-1.6-.66-.26-1.52-.92-1.93-.71a30 30 0 0 0-3.8 2.75l-1.45-1.8Zm-16.55-17.6L0 2.52l.61-.73 32.46 27.07ZM13 0l23.72 24.87-.75.72Q24.15 13.13 12.32.67Z\" class=\"cls-1\"/>","width":60.94,"height":61.02},"cross":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18 18 6M6 6l12 12\"/>"},"hamburger":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 6h16M4 12h16M4 18h16\"/>"},"instagram":{"body":"<g fill=\"currentColor\"><path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0\"/><path d=\"M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881\"/></g>"},"kitecamps":{"body":"<g fill=\"currentColor\"><path d=\"m15.61 26.9 2 2.62 3.18-2.7-1.37 4.64c4.58.82 9.08 1.66 13.58 2.33.51.08 1.26-.78 1.74-1.34A6.75 6.75 0 0 1 37 30.3c-1.51 4.7 1.27 7.92 2.92 11.31 2.68 5.49 5.68 10.82 8.85 16.77l2.49-3.57c1.14 2.66 0 4.49-2.82 4.5H21.49L4 59.32c-3.13 0-3.68-.58-4-5.07l3.21 3.91a19 19 0 0 0 1.84-2.5c3.68-7.31 7.48-14.57 10.83-22 .76-1.72-.11-4.12-.27-6.76m30.86 30.8c-3.66-7.3-7-14-10.45-20.65a4.2 4.2 0 0 0-2.66-1.51c-4-.92-8.08-1.68-12.14-2.47a18 18 0 0 0-2.5 0c4 8.09 7.8 15.7 11.67 23.26a2.88 2.88 0 0 0 2.07 1.32c4.46.11 8.92.05 14.01.05m-40.3-.43c6.48 1.32 6.64 1.22 8.24-4.33.95-3.32 1.93-6.62 2.9-9.93a75.4 75.4 0 0 1 4.12 10.65c1.6 4.66 2 4.84 7.44 3.49l-11.1-23Zm8.34.2H21C19.91 54 18.93 51 17.66 47.1Zm40.62-38.18c-1.42-3.93-2.68-7.92-4.33-11.75-.89-2.07-2.61-2.55-4.59-.86A10.3 10.3 0 0 1 42.53 9c-1.12.3-2.48-.27-3.73-.46.19-1.21 0-2.68.64-3.59 4.06-5.84 14.17-6.64 19.49-1.7 5 4.66 6.26 13.67 2.73 19.57-1.22 2.05-2.66 3.81-5.33 3.18-2.92-.75-2.12-3.26-2.17-5.31v-1Zm6.58-1c2-10.49-5.3-18.7-14.29-15.95 5.64 3.72 8 9 8.27 15.58Zm-7 1.25c1 2.18 1.35 4.5 2.18 4.67 2.58.53 3.36-1.72 4.25-4.16Zm-7.88-15C44.08 2.06 41.62 3.25 40.67 8Zm-1.12 25.81c-.6 1.53-1.18 3.08-1.87 4.57 0 0-1.21-.45-1.86-.7l2.4-4.49Z\" class=\"fill-current\"/><path d=\"M38 50.14c-6.4.89-8-.55-9.12-7.75 5.57-1.12 6.21-.59 9.12 7.75m-7.62-6.24c1.25 2.53 1.26 5.72 5.31 4.61-.91-2.46-1.08-5.37-5.31-4.61\" class=\"fill-current\"/></g>","width":63.67,"height":59.35},"move-up-right":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13 5h6v6m0-6L5 19\"/>"},"rental":{"body":"<g fill=\"currentColor\"><path d=\"M46.76 19.91c4-.05 5.77 1.26 6 4.38L48.35 23c1.39 2.8 1.58 5-.4 6.84-1-2.08-1.86-4-2.8-6.06-3.08 2.44-4.4 6.26-4 11L46 35v.69H2.92l-.06-.55c.81-.07 1.62-.2 2.44-.21 9.62 0 19.24-.08 28.85 0 1.85 0 2.6-.49 2.85-2.4a15.94 15.94 0 0 1 5.62-10.28l-6-1.13c1.19-2.25 2.92-2.77 7.29-1.79L41.2 15c2.13-1 4.48.9 5.56 4.91m-5 4.49c-2.45 2.58-3.36 5.72-3.8 9-.06.41.56.91.87 1.37.33-.37.85-.7.95-1.13.71-2.99 1.32-6.02 1.99-9.24Z\" class=\"fill-current\"/><path d=\"M19.12 33.29H6.44c-1.49 0-2.06-.47-2.05-2 .05-4.64-.09-9.28 0-13.92a4.4 4.4 0 0 1 1.35-2.91c3.81-3.2 7.79-6.18 11.63-9.34 1.22-1 2.07-.84 3.22.09 3.95 3.16 8 6.17 11.93 9.36a4 4 0 0 1 1.29 2.66c.12 4.72 0 9.45 0 14.17 0 1.61-.67 1.94-2.09 1.92-4.23-.07-8.45 0-12.68 0Zm-4-10.06c2.18 0 4 .06 5.78 0 1.56-.08 2 .65 2 2.09-.06 2.2 0 4.4 0 6.84h7.83c1.4 0 1.9-.5 1.88-1.89-.07-4.31 0-8.63-.07-12.94a2.6 2.6 0 0 0-.59-1.78c-4.26-3.4-8.58-6.71-13.06-10.18-4.27 3.39-8.43 6.67-12.55 10a2.15 2.15 0 0 0-.73 1.45v15.23c3 0 5.71.08 8.4-.08.43 0 1.08-1.11 1.12-1.73.1-2.14.01-4.24.01-7.01Zm1.38 1.28v7.35h4.95v-7.35Z\" class=\"fill-current\"/><path d=\"M0 14.85 18.92 0l7.61 5.8c.24-1.56.41-2.67.61-3.95h4.77a47 47 0 0 1-.06 6 3.62 3.62 0 0 0 1.75 3.76c1.49 1.05 2.91 2.24 4.4 3.39l-.44.67a14.5 14.5 0 0 1-1.85-1.05c-5-3.9-10-7.75-14.8-11.79-1.49-1.23-2.46-1.08-3.83 0C12.2 6.75 7.3 10.59 2.41 14.44c-.58.46-1.23.82-1.85 1.23ZM28.17 3c-.66 4.17-.44 4.65 2.47 5.64V3Z\" class=\"fill-current\"/><path d=\"M19 17.12c-2.32.48-2.59-.75-2.69-2.65-.11-2.27.79-2.68 2.86-2.74 2.35-.08 2.47 1.07 2.52 2.85.02 2.06-.69 2.95-2.69 2.54m-1-4.05-.78.77 1.84 2c.46-.51 1.3-1 1.31-1.52 0-1.99-1.43-1.27-2.44-1.25Z\" class=\"fill-current\"/></g>","width":52.77,"height":35.67},"travel":{"body":"<g fill=\"currentColor\"><path d=\"M36.5 18.56c-.88 1-1.48 1.77-2.12 2.48s-1.14 1.23-2.22 2.39c-.25-2.74-.3-4.8-.68-6.8a4.22 4.22 0 0 0-1.56-2.56c-2.5-1.59-5.15-2.93-7.74-4.37-.06 0-.07-.14-.27-.62L54.82 0l.68.73c-4 7.93-8.09 15.86-12.28 24.07Zm6.17 4.94L53 3.6l-.49-.25-16.32 12.86Zm7.51-20.45-.27-.65-25.85 7.22c2.72 1.49 4.85 2.75 7.07 3.82a2.56 2.56 0 0 0 1.93-.35C36.54 11.08 40 9 43.42 7c2.24-1.37 4.5-2.65 6.76-3.95M45 8.1l-.41-.61c-3 1.79-6 3.6-9 5.37-3.32 2-3.63 2.79-2.23 7.39a8.9 8.9 0 0 1 4.19-6.5C40.21 12.09 42.56 10 45 8.1\" class=\"fill-current\"/><path d=\"M24.9 17.32c-5.95-.17-10 2.06-12.89 6.31C10.37 26 9 28.56 7.42 31A14.27 14.27 0 0 1 0 37.18a5 5 0 0 1 .61-1c2.31-2.5 4.79-4.87 6.94-7.51 1.66-2 2.76-4.55 4.38-6.63 4.11-5.28 10.8-7.14 16.26-4.53-1.07.43-2 .76-2.89 1.17a7.86 7.86 0 0 0-3.3 11.9c2.91 4.19 7.34 5.86 12 7a66.6 66.6 0 0 0 21.12 1 3.25 3.25 0 0 1 2.22.5 3.9 3.9 0 0 1-1.13.46c-8.13.7-16.29 1-24.16-1.5A27.3 27.3 0 0 1 22.89 33c-5-4.24-4.5-10.3.62-14.43.3-.22.57-.5 1.39-1.25\" class=\"fill-current\"/><path d=\"M28.61 25.93 23.33 30l-.51-.56 6.09-5.54c2.25 7 8.26 8.54 14.28 9.72 5 1 10 1.4 15.05 2a15.2 15.2 0 0 1 4.08.79c-.37.16-.73.47-1.09.46-8.14-.3-16.22-1.14-24-3.81-3.59-1.18-6.85-3.06-8.62-7.13m-16.53.46c.88 10.52 9 12.75 17.57 14.88-3.58 1.08-10.82-1.8-14.44-5.36a10.24 10.24 0 0 1-3.13-9.52\" class=\"fill-current\"/></g>","width":62.32,"height":41.5},"waves":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/>"},"whatsapp":{"body":"<path fill=\"currentColor\" d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52s.198-.298.298-.497c.099-.198.05-.371-.025-.52s-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074s2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413s.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413\"/>"},"wind":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12.8 19.6A2 2 0 1 0 14 16H2m15.5-8a2.5 2.5 0 1 1 2 4H2m7.8-7.6A2 2 0 1 1 11 8H2\"/>"},"zoom-out":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607M13.5 10.5h-6\"/>"}},"width":24,"height":24}};

const cache = /* @__PURE__ */ new WeakMap();

const $$Astro = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Icon;
  class AstroIconError extends Error {
    constructor(message) {
      super(message);
      this.hint = "";
    }
  }
  const req = Astro2.request;
  const { name = "", title, desc, "is:inline": inline = false, ...props } = Astro2.props;
  const map = cache.get(req) ?? /* @__PURE__ */ new Map();
  const i = map.get(name) ?? 0;
  map.set(name, i + 1);
  cache.set(req, map);
  const includeSymbol = !inline && i === 0;
  let [setName, iconName] = name.split(":");
  if (!setName && iconName) {
    const err = new AstroIconError(`Invalid "name" provided!`);
    throw err;
  }
  if (!iconName) {
    iconName = setName;
    setName = "local";
    if (!icons[setName]) {
      const err = new AstroIconError('Unable to load the "local" icon set!');
      throw err;
    }
    if (!(iconName in icons[setName].icons)) {
      const err = new AstroIconError(`Unable to locate "${name}" icon!`);
      throw err;
    }
  }
  const collection = icons[setName];
  if (!collection) {
    const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
    throw err;
  }
  const iconData = getIconData(collection, iconName ?? setName);
  if (!iconData) {
    const err = new AstroIconError(`Unable to locate "${name}" icon!`);
    throw err;
  }
  const id = `ai:${collection.prefix}:${iconName ?? setName}`;
  if (props.size) {
    props.width = props.size;
    props.height = props.size;
    delete props.size;
  }
  const renderData = iconToSVG(iconData);
  const normalizedProps = { ...renderData.attributes, ...props };
  const normalizedBody = renderData.body;
  const { viewBox } = normalizedProps;
  if (includeSymbol) {
    delete normalizedProps.viewBox;
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${desc && renderTemplate`<desc>${desc}</desc>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": ($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}${addAttribute(viewBox, "viewBox")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "href")}></use> ` })}`} </svg>`;
}, "C:/Users/facup/FREELANCE/fauna-kite/faunakiteweb/astro/node_modules/astro-icon/components/Icon.astro", void 0);

export { $$Icon as $ };
