export type ChalkColor = "blue" | "yellow" | "green"; // Add more valid colors as needed
export type Language = "Typescript" | "Javascript" | "Python";
export type LanguageFileExtension = "ts" | "js" | "py";
export type SupportedLanguages = {
  name: Language;
  color: ChalkColor;
};

export type SupportedFramework = {
  title: string;
  name: string;
};

export type SupportedFrameworks = Omit<
  Record<Lowercase<Language>, SupportedFramework[]>,
  "typescript"
>;

export type DirectoryExistsAction = {
  description: string;
  action: "overwrite" | "skip";
};
