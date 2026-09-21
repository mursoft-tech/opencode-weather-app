import { describe, expect, test } from "bun:test";
import { resolveDefaultCity } from "../../src/actions/shared.ts";
import type { Config } from "../../src/types/index.ts";
import { captureConsoleLog } from "../helpers.ts";

const base: Config = {
  cities: [{ name: "Madrid", latitude: 1, longitude: 2 }],
  unit: "celsius",
};

describe("resolveDefaultCity", () => {
  test("returns undefined and warns when there is no default", () => {
    const log = captureConsoleLog();
    try {
      expect(resolveDefaultCity({ cities: [], unit: "celsius" })).toBeUndefined();
      expect(log.messages.join("\n")).toContain("No hay una ciudad default");
    } finally {
      log.restore();
    }
  });

  test("returns undefined when the default city is no longer registered", () => {
    const log = captureConsoleLog();
    try {
      expect(resolveDefaultCity({ ...base, defaultCity: "Nowhere" })).toBeUndefined();
      expect(log.messages.join("\n")).toContain("ya no existe");
    } finally {
      log.restore();
    }
  });

  test("returns the matching city ignoring case", () => {
    expect(resolveDefaultCity({ ...base, defaultCity: "madrid" })?.name).toBe("Madrid");
  });
});
