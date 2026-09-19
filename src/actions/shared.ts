import type { City, Config } from "../types/index.ts";
import { printError } from "../presentation/output.ts";
import { findCity } from "../utils/cities.ts";

export function resolveDefaultCity(config: Config): City | undefined {
  if (!config.defaultCity) {
    printError("No hay una ciudad default. Usa la opción 4 para establecerla.");
    return undefined;
  }
  const city = findCity(config, config.defaultCity);
  if (!city) {
    printError(`La ciudad default "${config.defaultCity}" ya no existe en la lista.`);
    return undefined;
  }
  return city;
}
