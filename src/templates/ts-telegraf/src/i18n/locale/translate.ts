import { resolve } from "path";
import { lang as mainLang, supportedLanguages } from ".";
import fs from "fs-extra";
import { trimLines } from "trim-lines";
import _, { has } from "lodash";
import NodeCache from "node-cache";

type TranslateText = {
  text: string;
  from?: string;
  to: string;
};

const getTranslateHistory = (lang: keyof typeof supportedLanguages) => {
  const cached = translationHistoryCache.get(lang);
  if (cached) {
    return cached;
  }
  const translateHistoryPath = resolve(translateLogHistoryPath, `${lang}.json`);

  if (!fs.existsSync(translateHistoryPath)) {
    fs.writeFileSync(translateHistoryPath, "{}");
  }

  const translateHistory = JSON.parse(
    fs.readFileSync(translateHistoryPath, "utf-8")
  );
  translationHistoryCache.set(lang, translateHistory);
  return translateHistory;
};

const textHasChanged = (
  objectPath: string,
  mainTranslateHistory: any,
  texts: any
) => {
  return (
    _.get(mainTranslateHistory, objectPath) !==
    trimLines(_.get(texts, objectPath)).trim()
  );
};

const translateText = async ({
  text,
  from = mainLang,
  to,
}: TranslateText): Promise<string> => {
  if (from === to) {
    return trimLines(text).trim();
  }
  const res = await fetch("http://localhost:5000/translate", {
    method: "POST",
    body: JSON.stringify({
      q: text,
      source: from,
      target: to,
      format: "text",
    }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data.translatedText;
};

async function translateJSON(
  lang: keyof typeof supportedLanguages,
  texts: any
): Promise<string> {
  const tasks: Array<Promise<{ path: string; value: string }>> = [];
  const result: Record<string, unknown> = {};
  const oldTranslation = getTranslateHistory(lang);
  const mainTranslateHistory = getTranslateHistory(mainLang);
  function collectTasks(obj: any, prefix = "") {
    if (typeof obj === "number") {
      obj = obj.toString();
    }
    if (typeof obj === "string") {
      const objectPath = prefix;
      const textChanged = textHasChanged(
        objectPath,
        mainTranslateHistory,
        texts
      );
      if (!textChanged && has(oldTranslation, objectPath)) {
        tasks.push(
          Promise.resolve({
            path: objectPath,
            value: _.get(oldTranslation, objectPath),
          })
        );
      } else {
        tasks.push(
          translateText({
            text: obj,
            to: lang,
          }).then((translated) => ({
            path: objectPath,
            value: translated,
          }))
        );
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        collectTasks(item, `${prefix}[${index}]`);
      });
    } else if (obj && typeof obj === "object") {
      for (const k in obj) {
        collectTasks(obj[k], prefix ? `${prefix}.${k}` : k);
      }
    } else {
      throw new Error("Invalid locale format");
    }
  }

  collectTasks(texts);

  const translations = await Promise.all(tasks);
  translations.forEach(({ path, value }) => {
    _.set(result, path, value);
  });

  return JSON.stringify(result, null, 2);
}

function requireUncached(module: string) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

const translateAll = async () => {
  await fs.ensureDir(resolve(__dirname, "../translate"));

  await fs.ensureDir(translateLogHistoryPath);
  const texts = requireUncached("./text.ts").default;

  await Promise.all(
    Object.keys(supportedLanguages).map(async (fileLang) => {
      const outPath = resolve(__dirname, `../translate/${fileLang}.json`);
      const translateHistoryPath = resolve(
        translateLogHistoryPath,
        `${fileLang}.json`
      );
      const json = await translateJSON(
        fileLang as keyof typeof supportedLanguages,
        texts
      );
      translationHistoryCache.set(fileLang, JSON.parse(json));
      await Promise.all([
        fs.writeFile(outPath, json),
        fs.writeFile(translateHistoryPath, json),
      ]);
    })
  );
};

const translateLogHistoryPath = resolve(
  __dirname,
  `../../../.i18n/translate/history`
);
const translationHistoryCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 7 });

export default translateAll;
