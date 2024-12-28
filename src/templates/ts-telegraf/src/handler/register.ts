// Import necessary modules and configurations
import bot from "../configs/bot"; // Bot configuration
import registerAction from "../register/action";
import registerCommand from "../register/command";
import registerKeyboard from "../register/keyboard";
import registerMiddleware from "../register/middleware";
import registerOther from "../register/other";

registerMiddleware(bot); // Register the middleware with the bot

registerCommand(bot); // Register the command with the bot

registerKeyboard(bot); // Register the keyboard with the bot

registerAction(bot); // Register the action with the bot

registerOther(bot); // Register other handlers with the bot

// Export the configured bot
export default bot;
