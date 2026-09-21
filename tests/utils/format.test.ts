import { describe, expect, test } from "bun:test";
import { formatCity, formatDay, unitSymbol } from "../../src/utils/format.ts";

describe("unitSymbol", () => {
  test("returns °C for celsius", () => {
    expect(unitSymbol("celsius")).toBe("°C");
  });

  test("returns °F for fahrenheit", () => {
    expect(unitSymbol("fahrenheit")).toBe("°F");
  });
});

describe("formatCity", () => {
  test("returns only the name when there is no extra data", () => {
    expect(formatCity({ name: "Madrid", latitude: 1, longitude: 2 })).toBe("Madrid");
  });

  test("joins name, admin1 and country", () => {
    expect(
      formatCity({
        name: "Madrid",
        admin1: "Comunidad de Madrid",
        country: "España",
        latitude: 1,
        longitude: 2,
      }),
    ).toBe("Madrid, Comunidad de Madrid, España");
  });

  test("filters out empty optional fields", () => {
    expect(formatCity({ name: "X", admin1: "", country: "", latitude: 0, longitude: 0 })).toBe("X");
  });
});

describe("formatDay", () => {
  test("formats a valid date and capitalizes the weekday", () => {
    const result = formatDay("2024-01-15");
    expect(result).toContain("15");
    expect(result.toLowerCase()).toContain("ene");
    expect(result.charAt(0)).toBe(result.charAt(0).toUpperCase());
  });

  test("returns the raw value when the date is invalid", () => {
    expect(formatDay("not-a-date")).toBe("not-a-date");
  });
});
