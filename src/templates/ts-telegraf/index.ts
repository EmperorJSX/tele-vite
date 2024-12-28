import bot from "./src/handler/register";

bot.launch(() => {
console.log("Bot is running...");
  process.on("exit", () => bot.stop("SIGINT"));
});
