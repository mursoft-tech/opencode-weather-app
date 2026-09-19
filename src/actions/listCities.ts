import type { Config } from "../types/index.ts";
import { formatCity } from "../utils/format.ts";

export function listCities(config: Config): void {
  config.cities.forEach((city, index) => {
    console.log(`  ${index + 1}. ${formatCity(city)}`);
  });
}
