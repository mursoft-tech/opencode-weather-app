import { describe, expect, test } from "bun:test";
import { printError, printSuccess, renderForecast, weatherDescription } from "../../presentation/output.ts";
import type { DailyForecast } from "../../types/index.ts";
import { captureConsoleLog } from "../helpers.ts";

describe("weatherDescription", () => {
  const cases: Array<[number, string]> = [
    [0, "Despejado"],
    [1, "Mayormente despejado"],
    [2, "Parcialmente nublado"],
    [3, "Nublado"],
    [45, "Niebla"],
    [48, "Niebla"],
    [51, "Llovizna"],
    [57, "Llovizna"],
    [61, "Lluvia"],
    [67, "Lluvia"],
    [71, "Nieve"],
    [77, "Nieve"],
    [80, "Chubascos"],
    [82, "Chubascos"],
    [85, "Chubascos de nieve"],
    [86, "Chubascos de nieve"],
    [95, "Tormenta"],
    [99, "Tormenta"],
    [4, "Desconocido"],
    [100, "Desconocido"],
  ];

  for (const [code, expected] of cases) {
    test(`code ${code} => ${expected}`, () => {
      expect(weatherDescription(code)).toBe(expected);
    });
  }
});

describe("renderForecast", () => {
  test("prints the city, temperatures, condition and rain chance", () => {
    const days: DailyForecast[] = [
      { date: "2024-01-15", weatherCode: 0, tempMax: 20.5, tempMin: 10.2, precipProbability: 30 },
      { date: "2024-01-16", weatherCode: 61, tempMax: 15, tempMin: 9 },
    ];

    const log = captureConsoleLog();
    try {
      renderForecast("Madrid", days, "celsius");
      const text = log.messages.join("\n");
      expect(text).toContain("Madrid (°C)");
      expect(text).toContain("20.5° / 10.2°");
      expect(text).toContain("Despejado");
      expect(text).toContain("30%");
      expect(text).toContain("Lluvia");
      expect(text).toContain("—");
    } finally {
      log.restore();
    }
  });
});

describe("print helpers", () => {
  test("printError prefixes the message", () => {
    const log = captureConsoleLog();
    try {
      printError("algo falló");
      expect(log.messages.join("\n")).toContain("algo falló");
      expect(log.messages.join("\n")).toContain("✖");
    } finally {
      log.restore();
    }
  });

  test("printSuccess prefixes the message", () => {
    const log = captureConsoleLog();
    try {
      printSuccess("todo bien");
      expect(log.messages.join("\n")).toContain("todo bien");
      expect(log.messages.join("\n")).toContain("✔");
    } finally {
      log.restore();
    }
  });
});
