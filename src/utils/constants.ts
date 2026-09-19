import type { Config } from "../types/index.ts";

export const CONFIG_PATH = `${process.cwd()}/weather-data.json`;

export const LINE = "═".repeat(40);

export const DAY_FORMAT = new Intl.DateTimeFormat("es-ES", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export const DEFAULT_CONFIG: Config = {
  cities: [],
  unit: "celsius",
};
