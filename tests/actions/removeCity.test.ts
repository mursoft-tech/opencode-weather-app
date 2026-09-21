import { afterEach, describe, expect, test } from "bun:test";
import { removeCity } from "../../src/actions/removeCity.ts";
import { loadDefaultCity } from "../../src/storage/citiesStorage.ts";
import { saveConfig } from "../../src/storage/configFile.ts";
import type { City, Config } from "../../src/types/index.ts";
import { captureConsoleLog, cleanConfigFile, stubPrompt } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4, longitude: -3.7 };
const ottawa: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7 };

afterEach(cleanConfigFile);

describe("removeCity", () => {
  test("removes a city and clears it as default", async () => {
    const config: Config = { cities: [madrid, ottawa], unit: "celsius", defaultCity: "Madrid" };
    await saveConfig(config);

    const prompt = stubPrompt(["madrid"]);
    const log = captureConsoleLog();
    try {
      await removeCity(config);
      expect(config.cities.map((city) => city.name)).toEqual(["Ottawa"]);
      expect(config.defaultCity).toBeUndefined();
      expect(await loadDefaultCity()).toBeUndefined();
      expect(log.messages.join("\n")).toContain("Ciudad eliminada");
    } finally {
      prompt.restore();
      log.restore();
    }
  });

  test("keeps the default when another city is removed", async () => {
    const config: Config = { cities: [madrid, ottawa], unit: "celsius", defaultCity: "Madrid" };
    await saveConfig(config);

    const prompt = stubPrompt(["Ottawa"]);
    const log = captureConsoleLog();
    try {
      await removeCity(config);
      expect(config.defaultCity).toBe("Madrid");
    } finally {
      prompt.restore();
      log.restore();
    }
  });

  test("warns when the list is empty", async () => {
    const log = captureConsoleLog();
    try {
      await removeCity({ cities: [], unit: "celsius" });
      expect(log.messages.join("\n")).toContain("No hay ciudades para eliminar");
    } finally {
      log.restore();
    }
  });

  test("reports a city that is not registered", async () => {
    const config: Config = { cities: [madrid], unit: "celsius" };
    const prompt = stubPrompt(["Nowhere"]);
    const log = captureConsoleLog();
    try {
      await removeCity(config);
      expect(config.cities).toHaveLength(1);
      expect(log.messages.join("\n")).toContain("No se encontró");
    } finally {
      prompt.restore();
      log.restore();
    }
  });
});
