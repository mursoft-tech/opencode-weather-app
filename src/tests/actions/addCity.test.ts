import { afterEach, describe, expect, test } from "bun:test";
import { addCity } from "../../actions/addCity.ts";
import { loadCities } from "../../storage/citiesStorage.ts";
import type { Config } from "../../types/index.ts";
import {
  captureConsoleLog,
  cleanConfigFile,
  jsonResponse,
  stubFetch,
  stubPrompt,
} from "../helpers.ts";

const restores: Array<() => void> = [];

function track(restore: () => void): void {
  restores.push(restore);
}

function makeConfig(): Config {
  return { cities: [], unit: "celsius" };
}

afterEach(() => {
  restores.splice(0).forEach((restore) => restore());
  cleanConfigFile();
});

const madridResult = {
  results: [{ name: "Madrid", latitude: 40.4, longitude: -3.7, country: "España" }],
};

describe("addCity", () => {
  test("geocodes, appends and persists the city", async () => {
    track(stubFetch(() => jsonResponse(madridResult)).restore);
    track(stubPrompt(["Madrid"]).restore);
    const log = captureConsoleLog();
    track(log.restore);

    const config = makeConfig();
    await addCity(config);

    expect(config.cities.map((city) => city.name)).toEqual(["Madrid"]);
    expect(await loadCities()).toHaveLength(1);
    expect(log.messages.join("\n")).toContain("Ciudad agregada");
  });

  test("rejects a duplicate city", async () => {
    track(stubFetch(() => jsonResponse(madridResult)).restore);
    track(stubPrompt(["Madrid"]).restore);
    const log = captureConsoleLog();
    track(log.restore);

    const config = makeConfig();
    config.cities.push({ name: "Madrid", latitude: 40.4, longitude: -3.7 });
    await addCity(config);

    expect(config.cities).toHaveLength(1);
    expect(log.messages.join("\n")).toContain("ya está registrada");
  });

  test("reports geocoding failures", async () => {
    track(stubFetch(() => new Response("", { status: 500 })).restore);
    track(stubPrompt(["Nowhere"]).restore);
    const log = captureConsoleLog();
    track(log.restore);

    const config = makeConfig();
    await addCity(config);

    expect(config.cities).toHaveLength(0);
    expect(log.messages.join("\n")).toContain("No se pudo contactar");
  });

  test("does nothing when the name is empty", async () => {
    track(stubPrompt([""]).restore);
    const log = captureConsoleLog();
    track(log.restore);

    const config = makeConfig();
    await addCity(config);

    expect(config.cities).toHaveLength(0);
    expect(log.messages).toHaveLength(0);
  });
});
