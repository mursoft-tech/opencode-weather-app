import { describe, expect, test } from "bun:test";
import { cyan, green, red, yellow } from "../../utils/colors.ts";

const ESCAPE_PATTERN = /\x1b\[[0-9;]*m/g;
const colorHelpers: Array<[string, (text: string) => string]> = [
  ["cyan", cyan],
  ["yellow", yellow],
  ["green", green],
  ["red", red],
];

describe("color helpers", () => {
  for (const [name, helper] of colorHelpers) {
    test(`${name} preserves the text content`, () => {
      const output = helper("hola");
      expect(output.replace(ESCAPE_PATTERN, "")).toBe("hola");
      expect(output).toContain("hola");
    });
  }

  test("emits no escape codes when stdout is not a TTY", () => {
    if (process.stdout.isTTY) {
      return;
    }
    for (const [, helper] of colorHelpers) {
      expect(helper("hola")).toBe("hola");
    }
  });
});
