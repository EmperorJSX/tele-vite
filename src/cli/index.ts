import inquirer from "inquirer";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk"; // Import chalk for coloring
import stripAnsi from "strip-ansi";
import { getTemplate } from "./helpers";
import type {
  Language,
  SupportedFramework,
  SupportedFrameworks,
} from "../types";
import {
  directoryExistsAction,
  supportedFrameworks,
  supportedLanguages,
} from "./helpers/data";

const templatesDir = path.resolve(__dirname, "../templates");

const args = process.argv.slice(2);
// Define a type for the valid chalk color methods

// Function to initialize a new project
const initProject = async () => {
  let language: Lowercase<Language>;
  let framework = "";
  let projectDir = "";
  let projectName = "";

  const useCurrentDir =
    args.includes("--current-dir") ||
    args.includes("-c") ||
    args[1] === "." ||
    args[1] === "./";

  if (useCurrentDir) {
    console.log(
      chalk.yellow("⚠️  Using the current directory as the project directory.")
    );
    projectDir = process.cwd();
    projectName = path.basename(projectDir);
  } else {
    // Ask user for project name
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter your project name:",
        default: "my-telegram-bot",
        validate: (input: string) => {
          if (input.length > 64) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    projectName = answer.projectName;
    projectDir = path.resolve(process.cwd(), projectName);
  }

  if (fs.existsSync(projectDir)) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message:
          "⚠️ Current directory is not empty. Please choose how to proceed:",
        choices: directoryExistsAction.map(({ description }) => description),
      },
    ]);

    if (choice.toLowerCase().includes("cancel")) {
      console.log("❌ Operation cancelled");
      process.exit(0);
    }
    if (choice.toLowerCase().includes("delete")) {
      console.log("🗑️  Deleting existing files...");
      await fs.emptyDir(projectDir);
      console.log("✅ Existing files deleted successfully!");
    }
  }

  const languageAns = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "What programming language do you want to use?",
      choices: supportedLanguages.map(({ name, color }) => chalk[color](name)),
    },
  ]);

  language = stripAnsi(
    languageAns.language
  ).toLowerCase() as Lowercase<Language>; // Normalize to lowercase
  //   unchalk the language

  const jsOrTs = ["javascript", "typescript"];
  let frameworkChoices: SupportedFramework[];
  const isJsOrTs = jsOrTs.includes(language);
  if (isJsOrTs) {
    frameworkChoices = supportedFrameworks.javascript;
  } else {
    frameworkChoices =
      supportedFrameworks[language as keyof SupportedFrameworks];
  }

  const frameworkAns = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Which framework do you want to use?",
      choices: frameworkChoices.map(({ title }) => title),
    },
  ]);
  framework = frameworkAns.framework;

  const template = getTemplate(language, framework, isJsOrTs);
  if (!template) {
    console.error(
      chalk.red(
        `❌ Error: The specified template "${template}" could not be found.`
      )
    );
    return;
  }

  const templateDir = path.resolve(templatesDir, template);

  // Check if the selected template exists
  if (!fs.existsSync(templateDir)) {
    console.error(
      chalk.red(
        `❌ Error: The specified template "${template}" directory does not exist.`
      )
    );
    return;
  }

  // Create the new project directory

  try {
    // Check if the directory already exists

    // Create the directory and copy the selected template
    console.log(
      chalk.blue(
        `⏳ Initiating the creation of a ${framework} project named ${projectName}...`
      )
    );
    await fs.ensureDir(projectDir);
    await fs.copy(templateDir, projectDir);
    console.log(
      chalk.green(
        `✅ The project ${projectName} has been created successfully!`
      )
    );

    console.log(
      chalk.blue(
        `Run  \`cd ${projectName}\` to navigate to the project directory.
         Then, run \`npm install\` to install the project dependencies.  
        `
      )
    );

    console.log(
      chalk.green(
        "🚀 You can now start working on your project! Please run `tele-vite docs` to read the documetations."
      )
    );
  } catch (error: any) {
    console.error(
      chalk.red(
        "❌ An error occurred while creating the project:",
        error.message
      )
    );
  }
};

const openDocs = () => {
  console.log(
    chalk.blue("📚 Opening the documentation in your browser. Please wait...")
  );
};

const displayHelp = () => {
  const commands = [
    {
      command: "init",
      description: "Create a new project",
    },
    // {
    //   command: "docs",
    //   description: "Open the documentation in your browser",
    // },
    {
      command: "version",
      description: "Display the current version",
    },
    {
      command: "help",
      description: "Display this help message",
    },
  ];

  console.log(
    chalk.yellow(
      "📚 Tele-Vite CLI\n\n" +
        "🚀 Usage:\n" +
        commands
          .map(
            ({ command, description }) =>
              `tele-vite ${command} - ${description}`
          )
          .join("\n")
    )
  );
};

const displayVersion = () => {
  console.log("v0.0.1");
};

switch (args[0]?.toLowerCase()) {
  case "init":
    initProject();
    break;
  case "create":
    initProject();
    break;
  // case "docs":
  //   openDocs();
  //   break;
  case "help":
    displayHelp();
    break;
  case "--help":
    displayHelp();
    break;
  case "-h":
    displayHelp();
    break;

  case "version":
    displayVersion();
    break;
  case "--version":
    displayVersion();
    break;
  case "-v":
    displayVersion();
    break;

  default:
    console.log(
      chalk.red(
        "❌ Invalid command. Please run `tele-vite help` to see the available commands."
      )
    );
    break;
}

// Run the initialization
// initProject();
