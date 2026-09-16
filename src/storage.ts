import type { Config, Unit } from "./types.ts";

const CONFIG_PATH = `${process.cwd()}/weather-data.json`;

const DEFAULT_CONFIG: Config = {
  cities: [],
  unit: "celsius",
};

export async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);
  if (!(await file.exists())) {
    return { ...DEFAULT_CONFIG, cities: [] };
  }

  try {
    const raw = (await file.json()) as Partial<Config>;
    const unit: Unit = raw.unit === "fahrenheit" ? "fahrenheit" : "celsius";
    return {
      defaultCity: raw.defaultCity,
      cities: Array.isArray(raw.cities) ? raw.cities : [],
      unit,
    };
  } catch {
    return { ...DEFAULT_CONFIG, cities: [] };
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}
