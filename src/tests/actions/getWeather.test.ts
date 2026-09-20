import { afterEach, describe, expect, test } from "bun:test";
import { showWeather, weatherAll, weatherDefault } from "../../actions/getWeather.ts";
import type { City, Config } from "../../types/index.ts";
import { captureConsoleLog, jsonResponse, stubFetch } from "../helpers.ts";
import type { FetchHandler } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4, longitude: -3.7 };
const ottawa: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7 };

let fetchStub: ReturnType<typeof stubFetch> | undefined;

function useFetch(handler: FetchHandler): ReturnType<typeof stubFetch> {
  fetchStub = stubFetch(handler);
  return fetchStub;
}

afterEach(() => {
  fetchStub?.restore();
  fetchStub = undefined;
});

describe("showWeather", () => {
  test("prints the city and formatted temperature", async () => {
    useFetch(() => jsonResponse({ current: { temperature_2m: 21.5 } }));
    const log = captureConsoleLog();
    try {
      await showWeather(madrid, { cities: [], unit: "celsius" });
      expect(log.messages.join("\n")).toContain("Madrid");
      expect(log.messages.join("\n")).toContain("21.5 °C");
    } finally {
      log.restore();
    }
  });

  test("prints an error when the request fails", async () => {
    useFetch(() => new Response("", { status: 500 }));
    const log = captureConsoleLog();
    try {
      await showWeather(madrid, { cities: [], unit: "celsius" });
      expect(log.messages.join("\n")).toContain("No se pudo contactar");
    } finally {
      log.restore();
    }
  });
});

describe("weatherDefault", () => {
  test("does not fetch when there is no default city", async () => {
    const stub = useFetch(() => jsonResponse({ current: { temperature_2m: 10 } }));
    const log = captureConsoleLog();
    try {
      await weatherDefault({ cities: [], unit: "celsius" });
      expect(stub.calls).toHaveLength(0);
      expect(log.messages.join("\n")).toContain("No hay una ciudad default");
    } finally {
      log.restore();
    }
  });

  test("fetches the default city", async () => {
    useFetch(() => jsonResponse({ current: { temperature_2m: 15 } }));
    const log = captureConsoleLog();
    try {
      await weatherDefault({ cities: [madrid], unit: "celsius", defaultCity: "Madrid" });
      expect(log.messages.join("\n")).toContain("15.0 °C");
    } finally {
      log.restore();
    }
  });
});

describe("weatherAll", () => {
  test("warns when there are no cities", async () => {
    const stub = useFetch(() => jsonResponse({ current: { temperature_2m: 10 } }));
    const log = captureConsoleLog();
    try {
      await weatherAll({ cities: [], unit: "celsius" });
      expect(stub.calls).toHaveLength(0);
      expect(log.messages.join("\n")).toContain("No hay ciudades registradas");
    } finally {
      log.restore();
    }
  });

  test("fetches every registered city", async () => {
    const stub = useFetch(() => jsonResponse({ current: { temperature_2m: 12 } }));
    const log = captureConsoleLog();
    try {
      await weatherAll({ cities: [madrid, ottawa], unit: "celsius" });
      expect(stub.calls).toHaveLength(2);
      const text = log.messages.join("\n");
      expect(text).toContain("Madrid");
      expect(text).toContain("Ottawa");
    } finally {
      log.restore();
    }
  });
});
