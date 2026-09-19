import type { Config } from "../types/index.ts";
import { geocode } from "../api/geocoding.ts";
import { ask } from "../presentation/input.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import { saveCities } from "../storage/citiesStorage.ts";
import { findCity } from "../utils/cities.ts";
import { formatCity } from "../utils/format.ts";

export async function addCity(config: Config): Promise<void> {
  const name = ask("Nombre de la ciudad: ");
  if (!name) {
    return;
  }

  try {
    const city = await geocode(name);
    if (findCity(config, city.name)) {
      printError(`La ciudad "${city.name}" ya está registrada.`);
      return;
    }
    config.cities.push(city);
    await saveCities({ cities: config.cities, defaultCity: config.defaultCity });
    printSuccess(`Ciudad agregada: ${formatCity(city)}`);
  } catch (error) {
    printError((error as Error).message);
  }
}
