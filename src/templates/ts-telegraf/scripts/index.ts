import { resolve } from "path";
import translateAll from "../src/i18n/locale/translate";
import chalk from "chalk";
import chokidar from "chokidar";
type TranslateText = {
  watch?: boolean;
};

const onTranslateFileChange = async () => {
  console.log(chalk.bgBlue.black(" => Starting translation process... "));
  await translateAll().catch((err) => {
    console.error(err);
    process.exit(1);
  });
  console.log(chalk.bgGreen.black(" => Translation completed successfully! "));
};

const translateFiles = async ({ watch }: TranslateText = {}): Promise<void> => {
  await onTranslateFileChange();
  if (!watch) process.exit(0);
  console.log(chalk.bgYellow.black(" => Watching for locale file changes... "));
  const watcher = chokidar.watch(resolve(__dirname, "../src/i18n/locale"));
  watcher.on("change", async () => {
    console.log(chalk.bgMagenta.black(" => Locale file changed! "));
    await onTranslateFileChange();
  });
};

const args = process.argv.slice(2);
const command = args[0];
const watchFile = args[1]?.includes("--watch") || args[1]?.includes("-w");

switch (command) {
  case "translate":
    await translateFiles({ watch: watchFile });
    break;
  default:
    console.error("No command provided!");
    break;
}
