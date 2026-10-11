/**
 * Tests for config utilities
 */

import { afterEach, beforeEach, describe, expect, it } from "vite-plus/test";
import { mkdirSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  readConfig,
  writeConfig,
  configExists,
  DEFAULT_CONFIG,
  type KomachiConfig,
} from "./config";

describe("config utilities", () => {
  let testDir: string;

  beforeEach(() => {
    // Create a temporary test directory
    testDir = join(tmpdir(), `komachi-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("configExists", () => {
    it("returns false when komachi.json does not exist", () => {
      expect(configExists(testDir)).toBe(false);
    });

    it("returns true when komachi.json exists", () => {
      writeConfig({ blocksDir: "test" }, testDir);
      expect(configExists(testDir)).toBe(true);
    });
  });

  describe("writeConfig", () => {
    it("creates komachi.json with provided config", () => {
      const config: KomachiConfig = {
        blocksDir: "src/my-blocks",
      };

      writeConfig(config, testDir);

      const configPath = join(testDir, "komachi.json");
      expect(existsSync(configPath)).toBe(true);

      const content = readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(content);
      expect(parsed.blocksDir).toBe("src/my-blocks");
      expect(parsed.version).toBe(DEFAULT_CONFIG.version);
    });

    it("merges with defaults", () => {
      const config: KomachiConfig = {
        blocksDir: "custom",
      };

      writeConfig(config, testDir);

      const configPath = join(testDir, "komachi.json");
      const content = readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(content);

      expect(parsed.blocksDir).toBe("custom");
      expect(parsed.version).toBe(DEFAULT_CONFIG.version);
    });

    it("formats JSON with 2-space indent", () => {
      writeConfig({ blocksDir: "test" }, testDir);

      const configPath = join(testDir, "komachi.json");
      const content = readFileSync(configPath, "utf-8");

      // Should be pretty-printed
      expect(content).toContain("\n");
      expect(content).toContain("  ");
    });
  });

  describe("readConfig", () => {
    it("returns null when komachi.json does not exist", () => {
      const config = readConfig(testDir);
      expect(config).toBeNull();
    });

    it("reads and parses komachi.json", () => {
      const original: KomachiConfig = {
        blocksDir: "src/custom-dir",
      };

      writeConfig(original, testDir);
      const read = readConfig(testDir);

      expect(read).not.toBeNull();
      expect(read?.blocksDir).toBe("src/custom-dir");
      expect(read?.version).toBe(DEFAULT_CONFIG.version);
    });

    it("merges with defaults when reading", () => {
      // Write minimal config
      const configPath = join(testDir, "komachi.json");
      const content = JSON.stringify({ blocksDir: "custom" });
      require("node:fs").writeFileSync(configPath, content);

      const config = readConfig(testDir);

      expect(config).not.toBeNull();
      expect(config?.blocksDir).toBe("custom");
      expect(config?.version).toBe(DEFAULT_CONFIG.version);
    });

    it("throws error for invalid JSON", () => {
      const configPath = join(testDir, "komachi.json");
      require("node:fs").writeFileSync(configPath, "{ invalid json }");

      expect(() => readConfig(testDir)).toThrow("Failed to parse komachi.json");
    });
  });

  describe("round-trip", () => {
    it("preserves config through write and read", () => {
      const original: KomachiConfig = {
        blocksDir: "src/my-custom-blocks",
        version: "1.0.0",
      };

      writeConfig(original, testDir);
      const read = readConfig(testDir);

      expect(read).toEqual(original);
    });
  });
});
