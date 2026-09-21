import { afterEach, describe, expect, test } from "bun:test";
import { ask, pause } from "../../src/presentation/input.ts";
import { stubPrompt } from "../helpers.ts";

let promptStub: ReturnType<typeof stubPrompt> | undefined;

afterEach(() => {
  promptStub?.restore();
  promptStub = undefined;
});

describe("ask", () => {
  test("trims the answer", () => {
    promptStub = stubPrompt(["  Madrid  "]);
    expect(ask("¿Ciudad?")).toBe("Madrid");
  });

  test("returns an empty string when prompt is cancelled", () => {
    promptStub = stubPrompt([undefined]);
    expect(ask("¿Ciudad?")).toBe("");
  });
});

describe("pause", () => {
  test("prompts the user to press enter", () => {
    promptStub = stubPrompt([""]);
    pause();
    expect(promptStub.questions[0]).toContain("Presione Enter");
  });
});
