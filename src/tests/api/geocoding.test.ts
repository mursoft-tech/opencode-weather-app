import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { geocode } from "../../api/geocoding.ts";
import type { FetchHandler } from "../helpers.ts";
import { jsonResponse, stubFetch } from "../helpers.ts";

let fetchStub: ReturnType<typeof stubFetch>;

function useFetch(handler: FetchHandler): void {
  fetchStub = stubFetch(handler);
}

afterEach(() => fetchStub?.restore());

describe("geocode", () => {
  test("maps the first result into a City", async () => {
    useFetch(() =>
      jsonResponse({
        results: [
          {
            name: "Madrid",
            latitude: 40.4165,
            longitude: -3.70256,
            country: "España",
            admin1: "Comunidad de Madrid",
          },
        ],
      }),
    );

    const city = await geocode("  Madrid  ");
    expect(city).toEqual({
      name: "Madrid",
      latitude: 40.4165,
      longitude: -3.70256,
      country: "España",
      admin1: "Comunidad de Madrid",
    });
  });

  test("trims and URL-encodes the query", async () => {
    useFetch(() => jsonResponse({ results: [{ name: "New York", latitude: 1, longitude: 2 }] }));
    await geocode("New York");

    expect(fetchStub.calls).toHaveLength(1);
    const url = fetchStub.calls[0] ?? "";
    expect(url).toContain("name=New%20York");
    expect(url).toContain("count=1");
    expect(url).toContain("language=es");
  });

  test("throws when no result is returned", async () => {
    useFetch(() => jsonResponse({}));
    await expect(geocode("Nowhere")).rejects.toThrow('No se encontró la ciudad "Nowhere".');
  });

  test("throws a wrapped error on a non-ok response", async () => {
    useFetch(() => new Response("", { status: 503 }));
    await expect(geocode("Madrid")).rejects.toThrow("No se pudo contactar el servicio de geocodificación (HTTP 503).");
  });

  test("throws a wrapped error when the network fails", async () => {
    useFetch(() => {
      throw new Error("boom");
    });
    await expect(geocode("Madrid")).rejects.toThrow("No se pudo contactar el servicio de geocodificación (boom).");
  });
});
