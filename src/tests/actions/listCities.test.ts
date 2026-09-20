import { describe, expect, test } from "bun:test";
import { listCities } from "../../actions/listCities.ts";
import type { Config } from "../../types/index.ts";
import { captureConsoleLog } from "../helpers.ts";

const config: Config = {
  cities: [
    { name: "Madrid", admin1: "Comunidad de Madrid", latitude: 1, longitude: 2 },
    { name: "Ottawa", latitude: 3, longitude: 4 },
  ],
  unit: "celsius",
};

describe("listCities", () => {
  test("prints each city numbered", () => {
    const log = captureConsoleLog();
    try {
      listCities(config);
      expect(log.messages[0]).toContain("1. Madrid, Comunidad de Madrid");
      expect(log.messages[1]).toContain("2. Ottawa");
    } finally {
      log.restore();
    }
  });

  test("prints nothing when there are no cities", () => {
    const log = captureConsoleLog();
    try {
      listCities({ cities: [], unit: "celsius" });
      expect(log.messages).toHaveLength(0);
    } finally {
      log.restore();
    }
  });
});
