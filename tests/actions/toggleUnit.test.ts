import { afterEach, describe, expect, test } from "bun:test";
import { toggleUnit } from "../../src/actions/toggleUnit.ts";
import { loadConfig, saveConfig } from "../../src/storage/configFile.ts";
import type { City, Config } from "../../src/types/index.ts";
import { captureConsoleLog, cleanConfigFile } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4, longitude: -3.7 };

afterEach(cleanConfigFile);

describe("toggleUnit", () => {
  test("switches celsius to fahrenheit and persists it", async () => {
    const config: Config = { cities: [madrid], unit: "celsius" };
    await saveConfig(config);

    const log = captureConsoleLog();
    try {
      await toggleUnit(config);
      expect(config.unit).toBe("fahrenheit");
      const persisted = await loadConfig();
      expect(persisted.unit).toBe("fahrenheit");
      expect(persisted.cities).toEqual([madrid]);
      expect(log.messages.join("\n")).toContain("°F");
    } finally {
      log.restore();
    }
  });

  test("switches fahrenheit back to celsius", async () => {
    const config: Config = { cities: [], unit: "fahrenheit" };
    await saveConfig(config);

    const log = captureConsoleLog();
    try {
      await toggleUnit(config);
      expect(config.unit).toBe("celsius");
      expect((await loadConfig()).unit).toBe("celsius");
    } finally {
      log.restore();
    }
  });
});
