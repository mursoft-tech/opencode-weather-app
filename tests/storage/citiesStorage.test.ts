import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { loadConfig, saveConfig } from "../../src/storage/configFile.ts";
import { loadCities, loadDefaultCity, saveCities } from "../../src/storage/citiesStorage.ts";
import type { City } from "../../src/types/index.ts";
import { cleanConfigFile } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4, longitude: -3.7 };

beforeEach(cleanConfigFile);
afterEach(cleanConfigFile);

describe("citiesStorage", () => {
  test("saves and loads cities plus the default city", async () => {
    await saveCities({ cities: [madrid], defaultCity: "Madrid" });
    expect(await loadCities()).toEqual([madrid]);
    expect(await loadDefaultCity()).toBe("Madrid");
  });

  test("preserves the configured unit when saving cities", async () => {
    await saveConfig({ cities: [], unit: "fahrenheit" });
    await saveCities({ cities: [madrid] });

    const config = await loadConfig();
    expect(config.unit).toBe("fahrenheit");
    expect(config.cities).toEqual([madrid]);
    expect(config.defaultCity).toBeUndefined();
  });
});
