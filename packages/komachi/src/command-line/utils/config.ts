/**
 * Komachi CLI configuration utilities
 * Handles reading and writing komachi.json config files
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Configuration schema for komachi.json
 */
export interface KomachiConfig {
  /**
   * Directory where blocks will be installed (relative to project root)
   * @default "src/components/komachi"
   */
  blocksDir: string;

  /**
   * Version of the config schema
   * @default "1.0.0"
   */
  version?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<KomachiConfig> = {
  blocksDir: "src/components/komachi",
  version: "1.0.0",
};

/**
 * Read komachi.json from the specified directory
 * @param projectRoot - Path to project root (defaults to cwd)
 * @returns Parsed config or null if not found
 */
export function readConfig(
  projectRoot: string = process.cwd(),
): KomachiConfig | null {
  const configPath = join(projectRoot, "komachi.json");

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const config = JSON.parse(content) as KomachiConfig;

    // Merge with defaults to ensure all fields are present
    return {
      ...DEFAULT_CONFIG,
      ...config,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse komachi.json: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}

/**
 * Write komachi.json to the specified directory
 * @param config - Configuration to write
 * @param projectRoot - Path to project root (defaults to cwd)
 */
export function writeConfig(
  config: KomachiConfig,
  projectRoot: string = process.cwd(),
): void {
  const configPath = join(projectRoot, "komachi.json");

  // Merge with defaults
  const fullConfig: Required<KomachiConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  try {
    const content = JSON.stringify(fullConfig, null, 2) + "\n";
    writeFileSync(configPath, content, "utf-8");
  } catch (error) {
    throw new Error(
      `Failed to write komachi.json: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}

/**
 * Check if komachi.json exists in the specified directory
 * @param projectRoot - Path to project root (defaults to cwd)
 * @returns true if komachi.json exists
 */
export function configExists(projectRoot: string = process.cwd()): boolean {
  const configPath = join(projectRoot, "komachi.json");
  return existsSync(configPath);
}
