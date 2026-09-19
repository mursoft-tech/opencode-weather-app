import type { City } from "../types/index.ts";
import { loadConfig, saveConfig } from "./configFile.ts";

export type CitiesState = {
  cities: City[];
  defaultCity?: string;
};

export async function loadCities(): Promise<City[]> {
  return (await loadConfig()).cities;
}

export async function loadDefaultCity(): Promise<string | undefined> {
  return (await loadConfig()).defaultCity;
}

export async function saveCities(state: CitiesState): Promise<void> {
  const config = await loadConfig();
  await saveConfig({
    ...config,
    cities: state.cities,
    defaultCity: state.defaultCity,
  });
}
