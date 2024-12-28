import type {
  Language,
  LanguageFileExtension,
  SupportedFramework,
  SupportedFrameworks,
} from "../../types";
import { supportedFrameworks } from "./data";

const languageFileExtensions: Record<
  Lowercase<Language>,
  LanguageFileExtension
> = {
  typescript: "ts",
  javascript: "js",
  python: "py",
};

export const getLanguageFileExtension = (
  language: Lowercase<Language>
): LanguageFileExtension => {
  return languageFileExtensions[language];
};

export const getTemplate = (
  language: Lowercase<Language>,
  frameworkTitle: string,
  isJsOrTs: boolean
): string => {
  const languageFileExtension = getLanguageFileExtension(language);
  let frameworks: SupportedFramework[];
  if (isJsOrTs) {
    frameworks = supportedFrameworks.javascript;
  } else {
    frameworks = supportedFrameworks[language as keyof SupportedFrameworks];
  }

  const totalFrameworks = frameworks.length;
  for (let i = 0; i < totalFrameworks; i++) {
    const framework = frameworks[i];
    if (framework.title === frameworkTitle) {
      return `${languageFileExtension}-${framework.name}`;
    }
  }
  return "";
};
