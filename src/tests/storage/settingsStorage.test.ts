import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { loadConfig, saveConfig } from "../../storage/configFile.ts";
import { loadSettings, saveSettings } from "../../storage/settingsStorage.ts";
import type { City } from "../../types/index.ts";
import { cleanConfigFile } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4, longitude: -3.7 };

beforeEach(cleanConfigFile);
afterEach(cleanConfigFile);

describe("settingsStorage", () => {
  test("loads the current unit", async () => {
    await saveConfig({ cities: [], unit: "fahrenheit" });
    expect(await loadSettings()).toEqual({ unit: "fahrenheit" });
  });

  test("saves the unit while preserving cities and default", async () => {
    await saveConfig({ cities: [madrid], unit: "celsius", defaultCity: "Madrid" });
    await saveSettings({ unit: "fahrenheit" });

    const config = await loadConfig();
    expect(config.unit).toBe("fahrenheit");
    expect(config.cities).toEqual([madrid]);
    expect(config.defaultCity).toBe("Madrid");
  });
});
