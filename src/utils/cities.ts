import type { City, Config } from "../types/index.ts";

export function findCity(config: Config, name: string): City | undefined {
  const target = name.trim().toLowerCase();
  return config.cities.find((city) => city.name.toLowerCase() === target);
}
