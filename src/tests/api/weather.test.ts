import { afterEach, describe, expect, test } from "bun:test";
import { getForecast, getWeather } from "../../api/weather.ts";
import type { City } from "../../types/index.ts";
import type { FetchHandler } from "../helpers.ts";
import { jsonResponse, stubFetch } from "../helpers.ts";

const madrid: City = { name: "Madrid", latitude: 40.4165, longitude: -3.70256 };

let fetchStub: ReturnType<typeof stubFetch>;

function useFetch(handler: FetchHandler): void {
  fetchStub = stubFetch(handler);
}

afterEach(() => fetchStub?.restore());

describe("getWeather", () => {
  test("returns the current temperature in celsius", async () => {
    useFetch(() => jsonResponse({ current: { temperature_2m: 21.5 } }));

    expect(await getWeather(madrid, "celsius")).toBe(21.5);
    expect(fetchStub.calls[0]).toContain("current=temperature_2m");
    expect(fetchStub.calls[0]).not.toContain("temperature_unit");
  });

  test("requests fahrenheit when the unit is fahrenheit", async () => {
    useFetch(() => jsonResponse({ current: { temperature_2m: 70.7 } }));

    expect(await getWeather(madrid, "fahrenheit")).toBe(70.7);
    expect(fetchStub.calls[0]).toContain("temperature_unit=fahrenheit");
  });

  test("throws when the temperature is missing", async () => {
    useFetch(() => jsonResponse({ current: {} }));
    await expect(getWeather(madrid, "celsius")).rejects.toThrow(
      'No se pudo obtener la temperatura de "Madrid".',
    );
  });

  test("throws a wrapped error on HTTP failure", async () => {
    useFetch(() => new Response("", { status: 500 }));
    await expect(getWeather(madrid, "celsius")).rejects.toThrow(
      "No se pudo contactar el servicio del clima (HTTP 500).",
    );
  });
});

describe("getForecast", () => {
  test("maps the daily arrays into forecasts", async () => {
    useFetch(() =>
      jsonResponse({
        daily: {
          time: ["2024-01-15", "2024-01-16"],
          temperature_2m_max: [20, 22],
          temperature_2m_min: [10, 11],
          weather_code: [0, 3],
          precipitation_probability_max: [5, 40],
        },
      }),
    );

    expect(await getForecast(madrid, "celsius")).toEqual([
      { date: "2024-01-15", weatherCode: 0, tempMax: 20, tempMin: 10, precipProbability: 5 },
      { date: "2024-01-16", weatherCode: 3, tempMax: 22, tempMin: 11, precipProbability: 40 },
    ]);

    const url = fetchStub.calls[0] ?? "";
    expect(url).toContain(
      "daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
    );
    expect(url).toContain("timezone=auto");
    expect(url).toContain("forecast_days=7");
  });

  test("skips incomplete days", async () => {
    useFetch(() =>
      jsonResponse({
        daily: {
          time: ["2024-01-15", "2024-01-16"],
          temperature_2m_max: [20],
          temperature_2m_min: [10],
          weather_code: [0],
          precipitation_probability_max: [5],
        },
      }),
    );

    const forecast = await getForecast(madrid, "celsius");
    expect(forecast).toHaveLength(1);
    expect(forecast[0]?.date).toBe("2024-01-15");
  });

  test("keeps precipitation undefined when not provided", async () => {
    useFetch(() =>
      jsonResponse({
        daily: {
          time: ["2024-01-15"],
          temperature_2m_max: [20],
          temperature_2m_min: [10],
          weather_code: [1],
        },
      }),
    );

    const forecast = await getForecast(madrid, "celsius");
    expect(forecast).toEqual([
      { date: "2024-01-15", weatherCode: 1, tempMax: 20, tempMin: 10, precipProbability: undefined },
    ]);
  });

  test("throws when no usable day is returned", async () => {
    useFetch(() => jsonResponse({ daily: { time: [] } }));
    await expect(getForecast(madrid, "celsius")).rejects.toThrow(
      'No se pudo obtener el pronóstico de "Madrid".',
    );
  });

  test("requests fahrenheit for the forecast", async () => {
    useFetch(() =>
      jsonResponse({
        daily: {
          time: ["2024-01-15"],
          temperature_2m_max: [68],
          temperature_2m_min: [50],
          weather_code: [0],
        },
      }),
    );

    await getForecast(madrid, "fahrenheit");
    expect(fetchStub.calls[0]).toContain("temperature_unit=fahrenheit");
  });
});
