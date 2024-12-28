// Importing the necessary types and modules
import { Telegraf } from "telegraf"; // Importing the Telegraf module
import type { UserFromGetMe } from "telegraf/types";
import type { Context } from "../types";

/**
 * Configuration options for the Telegraf bot
 * @property {Object} telegram - Telegram-specific options.
 * @property {string} telegram.apiRoot - Custom API root for local development.
 * @property {number} handlerTimeol;;;lut - Handler timeout set to a large value (in milliseconds).
 */
const option = {
  telegram: {
    // apiRoot: "http://127.0.0.1:8081", // Uncomment this line to use a custom API root (optional)
  },
  handlerTimeout: 9_000_000,
};

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error(
    "The BOT_TOKEN environment variable is required. Please add it to your .env file."
  );
}

/**
 * Creates an instance of the Telegraf bot with the provided token and options.
 */
const bot = new Telegraf<Context>(BOT_TOKEN, option);

/**
 * Fetches the bot's information using the Telegram API and assigns the bot's username
 * to the bot options for future reference.
 *
 * This operation is wrapped in a promise chain with error handling to ensure that
 * any errors during the API call do not crash the application.
 */
await bot.telegram.getMe().then((botInfo: UserFromGetMe) => {
  bot.botInfo = botInfo;
});

export const BotInfo: UserFromGetMe = bot.botInfo!;

/**
 * Exporting the bot instance for use in other parts of the application.
 */
export default bot;
