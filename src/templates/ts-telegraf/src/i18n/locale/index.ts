import keyboard from "./keyboard";
import texts from "./text";

export const lang = "en";
export const supportedLanguages = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ru: "Russian",
};

export const validateLang = (lang: string) => {
  return Object.keys(supportedLanguages).includes(lang) ? lang : "en";
};

export type TetxsTypes = typeof texts;
export type KeyboardTypes = typeof keyboard;

export default { texts, keyboard };
