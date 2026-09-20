import { afterEach, describe, expect, test } from "bun:test";
import { renderMenu, selectOption } from "../../presentation/menu.ts";
import type { Config } from "../../types/index.ts";
import { captureConsoleLog, stubPrompt } from "../helpers.ts";

const config: Config = {
  cities: [{ name: "Madrid", latitude: 1, longitude: 2 }],
  unit: "celsius",
};

let promptStub: ReturnType<typeof stubPrompt> | undefined;

afterEach(() => {
  promptStub?.restore();
  promptStub = undefined;
});

describe("renderMenu", () => {
  test("prints the title, options and current unit", () => {
    const log = captureConsoleLog();
    try {
      renderMenu(config);
      const text = log.messages.join("\n");
      expect(text).toContain("WEATHER CLI");
      expect(text).toContain("0. Clima de ciudad default");
      expect(text).toContain("1. Clima de todas las ciudades (1)");
      expect(text).toContain("5. Pronóstico 7 días (ciudad default)");
      expect(text).toContain("9. Salir");
      expect(text).toContain("°C");
    } finally {
      log.restore();
    }
  });
});

describe("selectOption", () => {
  test("returns a valid option", () => {
    promptStub = stubPrompt(["5"]);
    expect(selectOption()).toBe("5");
  });

  test("returns undefined for an unknown option", () => {
    promptStub = stubPrompt(["7"]);
    expect(selectOption()).toBeUndefined();
  });
});
