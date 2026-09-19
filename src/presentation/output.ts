import type { DailyForecast, Unit } from "../types/index.ts";
import { cyan, green, red, yellow } from "../utils/colors.ts";
import { formatDay, unitSymbol } from "../utils/format.ts";

export function clear(): void {
  console.log("\x1b[2J\x1b[H");
}

export function printError(message: string): void {
  console.log(`\n${red(`✖ ${message}`)}`);
}

export function printSuccess(message: string): void {
  console.log(`\n${green(`✔ ${message}`)}`);
}

export function weatherDescription(code: number): string {
  if (code === 0) return "Despejado";
  if (code === 1) return "Mayormente despejado";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code === 45 || code === 48) return "Niebla";
  if (code >= 51 && code <= 57) return "Llovizna";
  if (code >= 61 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "Nieve";
  if (code >= 80 && code <= 82) return "Chubascos";
  if (code === 85 || code === 86) return "Chubascos de nieve";
  if (code >= 95 && code <= 99) return "Tormenta";
  return "Desconocido";
}

export function renderForecast(cityLabel: string, days: DailyForecast[], unit: Unit): void {
  console.log(`\n  ${cyan(`${cityLabel} (${unitSymbol(unit)})`)}`);
  for (const day of days) {
    const dayLabel = formatDay(day.date).padEnd(15);
    const temps = `${day.tempMax.toFixed(1)}° / ${day.tempMin.toFixed(1)}°`.padEnd(20);
    const description = weatherDescription(day.weatherCode).padEnd(24);
    const rain = day.precipProbability === undefined ? "💧 —" : `💧 ${day.precipProbability}%`;
    console.log(`  ${dayLabel}${yellow(temps)}${description}${cyan(rain)}`);
  }
}
