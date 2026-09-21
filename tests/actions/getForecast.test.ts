import { afterEach, describe, expect, test } from "bun:test";
import { forecastAll, forecastDefault, showForecast } from "../../src/actions/getForecast.ts";
import type { City, Config } from "../../src/types/index.ts";
import type { FetchHandler } from "../helpers.ts";
import { captureConsoleLog, jsonResponse, stubFetch } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4, longitude: -3.7 };
const ottawa: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7 };

const dailyPayload = {
  daily: {
    time: ["2024-01-15"],
    temperature_2m_max: [20],
    temperature_2m_min: [10],
    weather_code: [0],
    precipitation_probability_max: [25],
  },
};

let fetchStub: ReturnType<typeof stubFetch> | undefined;

function useFetch(handler: FetchHandler): ReturnType<typeof stubFetch> {
  fetchStub = stubFetch(handler);
  return fetchStub;
}

afterEach(() => {
  fetchStub?.restore();
  fetchStub = undefined;
});

describe("showForecast", () => {
  test("renders the forecast for a city", async () => {
    useFetch(() => jsonResponse(dailyPayload));
    const log = captureConsoleLog();
    try {
      await showForecast(madrid, { cities: [], unit: "celsius" });
      const text = log.messages.join("\n");
      expect(text).toContain("Madrid (°C)");
      expect(text).toContain("20.0° / 10.0°");
    } finally {
      log.restore();
    }
  });

  test("prints an error when the forecast request fails", async () => {
    useFetch(() => new Response("", { status: 500 }));
    const log = captureConsoleLog();
    try {
      await showForecast(madrid, { cities: [], unit: "celsius" });
      expect(log.messages.join("\n")).toContain("No se pudo contactar");
    } finally {
      log.restore();
    }
  });
});

describe("forecastDefault", () => {
  test("does not fetch when there is no default city", async () => {
    const stub = useFetch(() => jsonResponse(dailyPayload));
    const log = captureConsoleLog();
    try {
      await forecastDefault({ cities: [], unit: "celsius" });
      expect(stub.calls).toHaveLength(0);
      expect(log.messages.join("\n")).toContain("No hay una ciudad default");
    } finally {
      log.restore();
    }
  });

  test("fetches the default city", async () => {
    const stub = useFetch(() => jsonResponse(dailyPayload));
    const log = captureConsoleLog();
    try {
      const config: Config = { cities: [madrid], unit: "celsius", defaultCity: "Madrid" };
      await forecastDefault(config);
      expect(stub.calls).toHaveLength(1);
      expect(log.messages.join("\n")).toContain("Madrid (°C)");
    } finally {
      log.restore();
    }
  });
});

describe("forecastAll", () => {
  test("warns when there are no cities", async () => {
    const stub = useFetch(() => jsonResponse(dailyPayload));
    const log = captureConsoleLog();
    try {
      await forecastAll({ cities: [], unit: "celsius" });
      expect(stub.calls).toHaveLength(0);
      expect(log.messages.join("\n")).toContain("No hay ciudades registradas");
    } finally {
      log.restore();
    }
  });

  test("fetches every registered city", async () => {
    const stub = useFetch(() => jsonResponse(dailyPayload));
    const log = captureConsoleLog();
    try {
      await forecastAll({ cities: [madrid, ottawa], unit: "celsius" });
      expect(stub.calls).toHaveLength(2);
      const text = log.messages.join("\n");
      expect(text).toContain("Madrid (°C)");
      expect(text).toContain("Ottawa (°C)");
    } finally {
      log.restore();
    }
  });
});
