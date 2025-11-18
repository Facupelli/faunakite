import { ui, enumTranslations, defaultLang } from "./ui";

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return key in ui[lang] ? (ui[lang] as any)[key] : ui[defaultLang][key];
  };
}

export function useEnumTranslations(lang: keyof typeof enumTranslations) {
  return function t(key: keyof (typeof enumTranslations)[typeof defaultLang]) {
    return key in enumTranslations[lang]
      ? (enumTranslations[lang] as any)[key]
      : enumTranslations[defaultLang][key];
  };
}
