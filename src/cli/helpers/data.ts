import type {
  DirectoryExistsAction,
  SupportedFrameworks,
  SupportedLanguages,
} from "../../types";

export const supportedLanguages: SupportedLanguages[] = [
  { name: "Typescript", color: "blue" },
  { name: "Javascript", color: "yellow" },
  { name: "Python", color: "green" },
  // Add more languages here if needed
];

export const supportedFrameworks: SupportedFrameworks = {
  javascript: [
    {
      title: "Telegraf.js",
      name: "telegraf",
    },
    {
      title: "Node.js Telegram Bot API",
      name: "node-telegram-bot-api",
    },
  ],
  python: [
    {
      title: "Python-telegram-bot",
      name: "python-telegram-bot",
    },
    {
      title: "AIOGram",
      name: "aiogram",
    },
    {
      title: "PyTelegramBotAPI",
      name: "py-telegram-bot-api",
    },
  ],
};

export const directoryExistsAction: DirectoryExistsAction[] = [
  {
    description: "Cancel operation",
    action: "skip",
  },
  {
    description: "Delete existing files and continue",
    action: "overwrite",
  },
];
