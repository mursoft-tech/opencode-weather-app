import type { City, Config } from "../types/index.ts";
import { getForecast } from "../api/weather.ts";
import { printError, renderForecast } from "../presentation/output.ts";
import { formatCity } from "../utils/format.ts";
import { resolveDefaultCity } from "./shared.ts";

export async function showForecast(city: City, config: Config): Promise<void> {
  try {
    const forecast = await getForecast(city, config.unit);
    renderForecast(formatCity(city), forecast, config.unit);
  } catch (error) {
    printError((error as Error).message);
  }
}

export async function forecastDefault(config: Config): Promise<void> {
  const city = resolveDefaultCity(config);
  if (!city) {
    return;
  }
  await showForecast(city, config);
}

export async function forecastAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades registradas. Usa la opción 2 para agregar una.");
    return;
  }
  for (const city of config.cities) {
    await showForecast(city, config);
  }
}
