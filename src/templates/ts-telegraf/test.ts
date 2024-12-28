import getTranslation from "./src/configs/i18n";

type NestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? `${Prefix}${K & string}` | NestedKeys<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

// Assume `translations` object represents your localization files
const translations = {
  en: {
    text: {
      greeting: "Hello, {name}!",
      farewell: "Goodbye, {name}.",
    },
    errors: {
      notFound: "The requested resource was not found.",
    },
  },
  es: {
    text: {
      greeting: "Hola, {name}!",
      farewell: "Adiós, {name}.",
    },
    errors: {
      notFound: "El recurso solicitado no fue encontrado.",
    },
  },
};

type TranslationFile = keyof typeof translations["en"];
type TranslationKey = NestedKeys<typeof translations["en"]>;

export const Locale = (defaultLang: keyof typeof translations, file: TranslationFile = "text") => {
  return function (key: TranslationKey, vars?: Record<string, string>, lang?: keyof typeof translations): string {
    const currentLang = lang || defaultLang || "en";
    getTranslation.locale = currentLang;

    const fullKey = `${file}.${key}`;
    let translatedText = getTranslation.t(fullKey, vars);

    // Fallback in case the key isn't found
    if (!translatedText) {
      console.warn(`Missing translation for key: ${fullKey} in ${currentLang}`);
      translatedText = key; // Return the key as fallback
    }

    return translatedText;
  };
};


// Define a localized function for English
const t = Locale("en");

// Use the function to translate keys
console.log(t("text.greeting", { name: "Alice" })); // Output: "Hello, Alice!"
console.log(t("errors.notFound")); // Output: "The requested resource was not found."

// Switch to Spanish
console.log(t("text.greeting", { name: "Alice" }, "es")); // Output: "Hola, Alice!"
