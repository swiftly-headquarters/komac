#!/usr/bin/env node
/**
 * Initialize komachi.json configuration file
 * Usage: komachi init
 */

import { createInterface } from "node:readline/promises";
import {
  configExists,
  writeConfig,
  type KomachiConfig,
  DEFAULT_CONFIG,
} from "../utils/config.js";

/**
 * Prompt user for input
 */
export async function prompt(
  question: string,
  defaultValue?: string,
): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const suffix = defaultValue ? ` (${defaultValue})` : "";
    const answer = await rl.question(`${question}${suffix}: `);
    return answer.trim() || defaultValue || "";
  } finally {
    rl.close();
  }
}

/**
 * Prompt user for yes/no confirmation
 */
export async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = await rl.question(`${question} (y/n): `);
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
}

/**
 * Initialize komachi.json configuration
 */
export async function init(): Promise<void> {
  try {
    const projectRoot = process.cwd();

    // Check if komachi.json already exists
    if (configExists(projectRoot)) {
      console.log("⚠️  komachi.json already exists in this directory.");
      const shouldOverwrite = await confirm("Do you want to overwrite it?");

      if (!shouldOverwrite) {
        console.log("Initialization cancelled.");
        process.exit(0);
      }
    }

    console.log("\n🚀 Initializing Komachi configuration...\n");

    // Prompt for blocks directory
    const blocksDir = await prompt(
      "Where should blocks be installed?",
      DEFAULT_CONFIG.blocksDir,
    );

    // Create config - ensure blocksDir has a value
    const config: KomachiConfig = {
      blocksDir: blocksDir || DEFAULT_CONFIG.blocksDir,
      version: DEFAULT_CONFIG.version,
    };

    // Write config file
    writeConfig(config, projectRoot);

    console.log("\n✅ Created komachi.json with the following configuration:");
    console.log(`   📁 Blocks directory: ${config.blocksDir}`);
    console.log("\nNext steps:");
    console.log("  • Run `komachi blocks` to see available blocks");
    console.log("  • Run `komachi add <block>` to install a block");
  } catch (error) {
    console.error("Error initializing configuration:", error);
    process.exit(1);
  }
}
