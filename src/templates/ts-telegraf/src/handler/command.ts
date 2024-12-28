import { type MiddlewareFn } from "telegraf"; // Importing the Telegraf module
import type { Context } from "../types";

export const start: MiddlewareFn<Context> = async (ctx) => {
  const msg = ctx.t("welcome");
  const keyboard = ctx.tkey("welcome");

  ctx.reply(msg);
};
