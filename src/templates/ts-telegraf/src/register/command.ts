import { Telegraf } from "telegraf"; // Importing the Telegraf module
import type { Context } from "../types";
import { start } from "../handler/command";

const registerCommand = (bot: Telegraf<Context>) => {
  bot.command("start", start);
};

export default registerCommand;
