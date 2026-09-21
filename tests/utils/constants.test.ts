import { describe, expect, test } from "bun:test";
import { DEFAULT_CONFIG, LINE } from "../../src/utils/constants.ts";

describe("constants", () => {
  test("LINE is a 40 character separator", () => {
    expect(LINE).toHaveLength(40);
    expect(LINE).toBe("═".repeat(40));
  });

  test("DEFAULT_CONFIG starts empty and in celsius", () => {
    expect(DEFAULT_CONFIG.unit).toBe("celsius");
    expect(DEFAULT_CONFIG.cities).toEqual([]);
    expect(DEFAULT_CONFIG.defaultCity).toBeUndefined();
  });
});
