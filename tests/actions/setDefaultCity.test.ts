import { afterEach, describe, expect, test } from "bun:test";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import { loadDefaultCity } from "../../src/storage/citiesStorage.ts";
import { saveConfig } from "../../src/storage/configFile.ts";
import type { City, Config } from "../../src/types/index.ts";
import { captureConsoleLog, cleanConfigFile, stubPrompt } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4, longitude: -3.7 };

afterEach(cleanConfigFile);

describe("setDefaultCity", () => {
  test("sets and persists the default city", async () => {
    const config: Config = { cities: [madrid], unit: "celsius" };
    await saveConfig(config);

    const prompt = stubPrompt(["Madrid"]);
    const log = captureConsoleLog();
    try {
      await setDefaultCity(config);
      expect(config.defaultCity).toBe("Madrid");
      expect(await loadDefaultCity()).toBe("Madrid");
      expect(log.messages.join("\n")).toContain("Ciudad default");
    } finally {
      prompt.restore();
      log.restore();
    }
  });

  test("warns when there are no registered cities", async () => {
    const log = captureConsoleLog();
    try {
      await setDefaultCity({ cities: [], unit: "celsius" });
      expect(log.messages.join("\n")).toContain("No hay ciudades registradas");
    } finally {
      log.restore();
    }
  });

  test("reports an unregistered city", async () => {
    const config: Config = { cities: [madrid], unit: "celsius" };
    const prompt = stubPrompt(["Nowhere"]);
    const log = captureConsoleLog();
    try {
      await setDefaultCity(config);
      expect(config.defaultCity).toBeUndefined();
      expect(log.messages.join("\n")).toContain("No se encontró");
    } finally {
      prompt.restore();
      log.restore();
    }
  });
});
