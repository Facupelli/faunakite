import {
  ui,
  enumTranslations,
  defaultLang,
  type UIKeys,
  type Lang,
  type EnumKeys,
} from "./ui";

export function useTranslations(lang: Lang) {
  return function t(key: UIKeys): string {
    const translation = ui[key];
    return translation[lang] ?? translation[defaultLang];
  };
}

export function useEnumTranslations(lang: Lang) {
  return function t(key: EnumKeys): string {
    const translation = enumTranslations[key];
    return translation[lang] ?? translation[defaultLang];
  };
}

export function getLocalizedValue<T>(
  field: Array<{ _key: string; value: T }> | undefined,
  language: "es" | "en",
): T | undefined {
  if (!field || !Array.isArray(field)) {
    return undefined;
  }

  const localized = field.find((item) => item._key === language);
  if (localized) return localized.value;

  const fallback = field.find((item) => item._key === "es");
  return fallback?.value;
}
