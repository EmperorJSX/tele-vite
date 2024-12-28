import type { MiddlewareFn } from "telegraf";
import type { Context } from "../types";
import getTranslation from "../configs/i18n";
import { parseI18nKey } from "../utils/helper";

export const setLocale: MiddlewareFn<Context> = (
  ctx: Context,
  next: () => void
) => {
  const lang = ctx.from!.language_code!;
  ctx.i18n = getTranslation();
  ctx.i18n.locale = lang;
  ctx.t = (key: string, data?: Record<string, any>): any =>
    ctx.i18n.t(parseI18nKey(key), data);

  ctx.tkey = (key: string, data?: Record<string, any>): any =>
    ctx.i18n.t(parseI18nKey(`keyboard.${key}`), data);

  next();
};
