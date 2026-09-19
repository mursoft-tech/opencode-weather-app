import type { City } from "../types/index.ts";

type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

type GeocodingResponse = {
  results?: GeocodingResult[];
};

export async function geocode(name: string): Promise<City> {
  const query = encodeURIComponent(name.trim());
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=es&format=json`;

  let data: GeocodingResponse;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    data = (await response.json()) as GeocodingResponse;
  } catch (error) {
    throw new Error(`No se pudo contactar el servicio de geocodificación (${(error as Error).message}).`);
  }

  const result = data.results?.[0];
  if (!result) {
    throw new Error(`No se encontró la ciudad "${name}".`);
  }

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
  };
}
