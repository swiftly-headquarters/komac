#!/usr/bin/env node
/**
 * Komachi CLI - Component registry and blocks distribution
 *
 * Usage:
 *   komachi init                 Initialize komachi.json configuration
 *   komachi ls                   List all components
 *   komachi doc <name>           Get documentation for a component
 *   komachi docs                 Get documentation for all components
 *   komachi help                 Show this help message
 */

import { ls } from "./commands/ls.js";
import { doc } from "./commands/doc.js";
import { init } from "./commands/init.js";
import { blocks } from "./commands/blocks.js";
import { add } from "./commands/add.js";
import { migrate } from "./commands/migrate.js";
import { ai } from "./commands/ai.js";

const HELP = `
Komachi CLI - Component registry and blocks distribution

BLOCKS:
  komachi init            Initialize komachi.json configuration file
  komachi blocks          List all available blocks for CLI installation
  komachi add <block>     Install a block to your project

COMPONENT REGISTRY:
  komachi ls              List all Komachi components with categories
  komachi doc <name>      Get detailed documentation for a component
  komachi docs            Get documentation for all components

MIGRATION:
  komachi migrate         Export token rename map for codebase migration
  komachi migrate --classes  Show class-level mappings (bg-komachi-base -> bg-komachi-base)
  komachi migrate --help     Show migration help

AI:
  komachi ai              Print the AI usage guide (component API reference)

GENERAL:
  komachi help            Show this help message

Examples:
  komachi init
  komachi blocks
  komachi add PageHeader
  komachi ls
  komachi doc Button
  komachi docs
  komachi migrate --json > rename-map.json
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  switch (command) {
    case "init":
      // Initialize komachi.json configuration
      await init();
      break;

    case "blocks":
      // List available blocks
      blocks();
      break;

    case "add":
      // Add a block to the project
      await add(args[1]);
      break;

    case "ls":
      // List components
      ls();
      break;

    case "doc":
    case "docs":
      // If no component name, show all docs; otherwise show specific component
      doc(args[1]);
      break;

    case "migrate":
      // Export token rename map for migration
      migrate(args.slice(1));
      break;

    case "ai":
      // Print AI usage guide
      ai();
      break;

    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP.trim());
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP.trim());
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
