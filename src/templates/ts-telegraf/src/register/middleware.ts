import { Telegraf } from "telegraf"; // Importing the Telegraf module
import type { Context } from "../types";
import { setLocale } from "../handler/middleware";

const registerMiddleware = (bot: Telegraf<Context>) => {
  bot.use(setLocale);
};

export default registerMiddleware;
