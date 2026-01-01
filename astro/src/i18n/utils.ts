import {
  ui,
  enumTranslations,
  defaultLang,
  type UIKeys,
  type Lang,
  type EnumKeys,
} from "./ui";

// Updated translation function that works with the new structure
export function useTranslations(lang: Lang) {
  return function t(key: UIKeys): string {
    const translation = ui[key];
    return translation[lang] ?? translation[defaultLang];
  };
}

// Separate function for enum translations
export function useEnumTranslations(lang: Lang) {
  return function t(key: EnumKeys): string {
    const translation = enumTranslations[key];
    return translation[lang] ?? translation[defaultLang];
  };
}
