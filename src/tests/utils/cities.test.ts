import { describe, expect, test } from "bun:test";
import type { Config } from "../../types/index.ts";
import { findCity } from "../../utils/cities.ts";

const config: Config = {
  cities: [
    { name: "Madrid", latitude: 1, longitude: 2 },
    { name: "Ottawa", latitude: 3, longitude: 4 },
  ],
  unit: "celsius",
};

describe("findCity", () => {
  test("finds a city by exact name", () => {
    expect(findCity(config, "Madrid")?.name).toBe("Madrid");
  });

  test("is case-insensitive and trims the query", () => {
    expect(findCity(config, "  otTAwa  ")?.name).toBe("Ottawa");
  });

  test("returns undefined when the city is not registered", () => {
    expect(findCity(config, "Nowhere")).toBeUndefined();
  });
});
