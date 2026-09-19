import type { City, Unit } from "../types/index.ts";
import { DAY_FORMAT } from "./constants.ts";

export function unitSymbol(unit: Unit): string {
  return unit === "fahrenheit" ? "°F" : "°C";
}

export function formatCity(city: City): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}

export function formatDay(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  const label = DAY_FORMAT.format(parsed);
  return label.charAt(0).toUpperCase() + label.slice(1);
}
