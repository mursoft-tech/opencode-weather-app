import type { City, Unit } from "./types.ts";

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

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
  };
};

export type DailyForecast = {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipProbability?: number;
};

type DailyResponse = {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
    precipitation_probability_max?: number[];
  };
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

export async function getWeather(city: City, unit: Unit): Promise<number> {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m`;
  if (unit === "fahrenheit") {
    url += "&temperature_unit=fahrenheit";
  }

  let data: ForecastResponse;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    data = (await response.json()) as ForecastResponse;
  } catch (error) {
    throw new Error(`No se pudo contactar el servicio del clima (${(error as Error).message}).`);
  }

  const temperature = data.current?.temperature_2m;
  if (temperature === undefined) {
    throw new Error(`No se pudo obtener la temperatura de "${city.name}".`);
  }

  return temperature;
}

export async function getForecast(city: City, unit: Unit): Promise<DailyForecast[]> {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto&forecast_days=7`;
  if (unit === "fahrenheit") {
    url += "&temperature_unit=fahrenheit";
  }

  let data: DailyResponse;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    data = (await response.json()) as DailyResponse;
  } catch (error) {
    throw new Error(`No se pudo contactar el servicio del clima (${(error as Error).message}).`);
  }

  const daily = data.daily;
  const times = daily?.time ?? [];
  const forecast: DailyForecast[] = [];

  for (const [index, date] of times.entries()) {
    const tempMax = daily?.temperature_2m_max?.[index];
    const tempMin = daily?.temperature_2m_min?.[index];
    const weatherCode = daily?.weather_code?.[index];
    if (tempMax === undefined || tempMin === undefined || weatherCode === undefined) {
      continue;
    }
    forecast.push({
      date,
      weatherCode,
      tempMax,
      tempMin,
      precipProbability: daily?.precipitation_probability_max?.[index],
    });
  }

  if (forecast.length === 0) {
    throw new Error(`No se pudo obtener el pronóstico de "${city.name}".`);
  }

  return forecast;
}
