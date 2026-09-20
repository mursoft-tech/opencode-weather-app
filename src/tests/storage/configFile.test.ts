import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { loadConfig, saveConfig } from "../../storage/configFile.ts";
import { CONFIG_PATH } from "../../utils/constants.ts";
import { cleanConfigFile } from "../helpers.ts";

beforeEach(cleanConfigFile);
afterEach(cleanConfigFile);

describe("configFile", () => {
  test("returns defaults when the file does not exist", async () => {
    const config = await loadConfig();
    expect(config).toEqual({ cities: [], unit: "celsius" });
    expect(config.defaultCity).toBeUndefined();
  });

  test("round-trips a saved config", async () => {
    await saveConfig({
      defaultCity: "Madrid",
      cities: [{ name: "Madrid", latitude: 40.4, longitude: -3.7 }],
      unit: "fahrenheit",
    });

    const config = await loadConfig();
    expect(config.unit).toBe("fahrenheit");
    expect(config.defaultCity).toBe("Madrid");
    expect(config.cities).toHaveLength(1);
  });

  test("falls back to defaults when the JSON is malformed", async () => {
    await Bun.write(CONFIG_PATH, "{ not valid json");
    expect(await loadConfig()).toEqual({ cities: [], unit: "celsius" });
  });

  test("normalizes an unknown unit and non-array cities", async () => {
    await Bun.write(CONFIG_PATH, JSON.stringify({ unit: "kelvin", cities: "nope" }));
    const config = await loadConfig();
    expect(config.unit).toBe("celsius");
    expect(config.cities).toEqual([]);
  });
});
