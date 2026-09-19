import type { City } from "./City.ts";

export type Unit = "celsius" | "fahrenheit";

export type Config = {
  defaultCity?: string;
  cities: City[];
  unit: Unit;
};

export type Settings = {
  unit: Unit;
};
