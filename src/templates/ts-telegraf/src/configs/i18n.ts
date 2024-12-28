import path from "path";
import { I18n } from "i18n-js";
import { supportedLanguages } from "../i18n/locale";
import { lang } from "../i18n/locale/text";

/**
 * Retrieves the list of supported languages from the SL object.
 * This is an array of language codes that the application supports.
 */
const supported_languages = Object.keys(supportedLanguages);

/**
 * Loads the translation files for the supported languages.
 *
 * This function dynamically imports the text and keyboard translation files for each supported language.
 * It catches and rethrows any errors encountered during the loading process.
 *
 * @param {string[]} sp - Array of supported language codes.
 * @returns {Object} - An object containing the loaded translations for each language.
 */
const translations = ((sp) => {
  const transactions: Record<string, any> = {};

  sp.forEach((lang: string) => {
    try {
      transactions[lang] = require(path.resolve(__dirname, `../i18n/translate/${lang}.json`));
    } catch (error) {
      throw error;
    }
  });

  return transactions;
})(supported_languages);

/**
 * Initializes the I18n instance with the loaded translations.
 *
 * The `I18n` instance is configured to handle the application's localization and internationalization needs.
 */
const getTranslation = () => new I18n(translations);

/**
 * Exports the configured I18n instance for use throughout the application.
 */
export default getTranslation;

