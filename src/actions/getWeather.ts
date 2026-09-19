import type { City, Config } from "../types/index.ts";
import { getWeather } from "../api/weather.ts";
import { printError } from "../presentation/output.ts";
import { yellow } from "../utils/colors.ts";
import { formatCity, unitSymbol } from "../utils/format.ts";
import { resolveDefaultCity } from "./shared.ts";

export async function showWeather(city: City, config: Config): Promise<void> {
  try {
    const temperature = await getWeather(city, config.unit);
    console.log(`\n  ${formatCity(city)}: ${yellow(`${temperature.toFixed(1)} ${unitSymbol(config.unit)}`)}`);
  } catch (error) {
    printError((error as Error).message);
  }
}

export async function weatherDefault(config: Config): Promise<void> {
  const city = resolveDefaultCity(config);
  if (!city) {
    return;
  }
  await showWeather(city, config);
}

export async function weatherAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades registradas. Usa la opción 2 para agregar una.");
    return;
  }
  console.log("");
  for (const city of config.cities) {
    await showWeather(city, config);
  }
}
