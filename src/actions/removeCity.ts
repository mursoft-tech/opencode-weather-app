import type { Config } from "../types/index.ts";
import { ask } from "../presentation/input.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import { saveCities } from "../storage/citiesStorage.ts";
import { findCity } from "../utils/cities.ts";
import { formatCity } from "../utils/format.ts";
import { listCities } from "./listCities.ts";

export async function removeCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades para eliminar.");
    return;
  }
  listCities(config);
  const name = ask("\nNombre de la ciudad a eliminar: ");
  if (!name) {
    return;
  }

  const city = findCity(config, name);
  if (!city) {
    printError(`No se encontró "${name}" en la lista.`);
    return;
  }

  config.cities = config.cities.filter((item) => item !== city);
  if (config.defaultCity?.toLowerCase() === city.name.toLowerCase()) {
    config.defaultCity = undefined;
  }
  await saveCities({ cities: config.cities, defaultCity: config.defaultCity });
  printSuccess(`Ciudad eliminada: ${formatCity(city)}`);
}
