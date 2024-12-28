import { Context as TelegrafContext } from "telegraf"; // Import Telegraf's context type
import type {
  Convenience,
  Message as TgMessage,
  InlineKeyboardButton,
  KeyboardButton,
} from "telegraf/types"; // Import Telegram Message type from telegraf/types
import type { TetxsTypes } from "../i18n/locale";
import type { ResolveType } from "./utility";
import type { I18n } from "i18n-js";
// Import Telegram Message type from typegram

interface ExtraReplyMessage extends Convenience.ExtraReplyMessage {
  reply_to_message_id?: number | undefined;
  disable_web_page_preview?: boolean;
}

// Extended context interface, inherits Telegraf's context and adds custom properties
export interface Context extends TelegrafContext {
  transferData?: {
    // Holds transfer-related data for the session
    data?: any;
  };
  session: {
    // Session management with state setters and getters
    state?: string;
    /**
     * Stores a value in the session storage associated with the given key.
     *
     * If the key is an object, the first key-value pair is extracted and used.
     *
     * @param {string | object} key - The key used to identify the session data, or an object with a single key-value pair.
     * @param {any} value - The value to be stored in the session.
     * @returns {Promise<any>} - The stored value.
     */
    set(key: string, value: any, expiry?: number): Promise<any>;
    /**
     * Retrieves a value from the session storage based on the provided key.
     *
     * @param {string} key - The key used to identify the session data.
     * @returns {Promise<number | any>} - The value associated with the key, converted to a number if applicable, or parsed from JSON if possible.
     */
    get(key: string): Promise<any>;

    /**
     * Retrieves multiple values from the session storage based on the provided keys.
     *
     * @param {string[]} keys - An array of keys used to identify the session data.
     * @returns {Promise<any>} - An array of values associated with the keys, converted to numbers if applicable, or parsed from JSON if possible.
     */
    getAll(keys: string[]): Promise<any>;
    /**
     * Deletes a value from the session storage based on the provided key.
     *
     * @param {string} key - The key used to identify the session data.
     * @returns {Promise<number>} - The number of keys deleted.
     */
    delete(key: string): Promise<number>;
    /**
     * Deletes all keys value from the session storage.
     *
     * @param {string} redisKeyPattern - The key used to identify the session data.
     * @returns {Promise<number>} - The number of keys deleted.
     */
    deleteAll(redisKeyPattern: string): Promise<number>;
  };
  i18n: I18n; // i18n instance
  t<ObjecType extends TetxsTypes, Path extends string>(
    path: Path,
    data?: object
  ): ResolveType<ObjecType, Path>; // Translation method
  tkey(key: string): KeyboardButton[][] | InlineKeyboardButton[][]; // TODO - Fix this type
  match(regex: RegExp): RegExpMatchArray; // Method for regex-based matching
  replyWithMarkdownV2( // Reply method using MarkdownV2 format
    text: string,
    extra?: ExtraReplyMessage // Additional options for reply
  ): Promise<TgMessage.TextMessage>; // Returns a promise with the message object
}

export * from "./utility"; // Export utility types
