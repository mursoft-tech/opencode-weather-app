import { spyOn } from "bun:test";
import { rmSync } from "node:fs";
import { CONFIG_PATH } from "../utils/constants.ts";

export type FetchHandler = (url: string, init?: RequestInit) => Response | Promise<Response>;

export function stubFetch(handler: FetchHandler): { calls: string[]; restore: () => void } {
  const original = globalThis.fetch;
  const calls: string[] = [];

  const wrapper = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    calls.push(url);
    return handler(url, init);
  };

  globalThis.fetch = wrapper as unknown as typeof fetch;
  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export type PromptSource = Array<string | undefined> | (() => string | undefined);

export function stubPrompt(source: PromptSource): { questions: string[]; restore: () => void } {
  const original = globalThis.prompt;
  const questions: string[] = [];
  let index = 0;

  const wrapper = (message?: string): string => {
    questions.push(message ?? "");
    if (typeof source === "function") {
      return source() as string;
    }
    return source[index++] as string;
  };

  globalThis.prompt = wrapper as unknown as typeof prompt;
  return {
    questions,
    restore: () => {
      globalThis.prompt = original;
    },
  };
}

export function captureConsoleLog(): { messages: string[]; restore: () => void } {
  const messages: string[] = [];
  const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    messages.push(args.map((value) => String(value)).join(" "));
  });
  return { messages, restore: () => spy.mockRestore() };
}

export function cleanConfigFile(): void {
  rmSync(CONFIG_PATH, { force: true });
}
