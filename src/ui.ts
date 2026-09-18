import type { DailyForecast } from "./api.ts";
import type { Config, Unit } from "./types.ts";

const LINE = "═".repeat(40);

const RESET = "\x1b[0m";
const COLORS = {
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
} as const;

const USE_COLOR = Boolean(process.stdout.isTTY);

function color(code: string, text: string): string {
  return USE_COLOR ? `${code}${text}${RESET}` : text;
}

export function cyan(text: string): string {
  return color(COLORS.cyan, text);
}

export function yellow(text: string): string {
  return color(COLORS.yellow, text);
}

export function green(text: string): string {
  return color(COLORS.green, text);
}

export function red(text: string): string {
  return color(COLORS.red, text);
}

export function unitSymbol(unit: Unit): string {
  return unit === "fahrenheit" ? "°F" : "°C";
}

export function clear(): void {
  console.log("\x1b[2J\x1b[H");
}

export function renderMenu(config: Config): void {
  clear();
  console.log(cyan(LINE));
  console.log(cyan(center("WEATHER CLI", LINE.length)));
  console.log(cyan(LINE));
  console.log("  0. Clima de ciudad default");
  console.log(`  1. Clima de todas las ciudades (${config.cities.length})`);
  console.log("  2. Buscar y agregar ciudad");
  console.log("  3. Eliminar ciudad");
  console.log("  4. Establecer ciudad default");
  console.log("  5. Pronóstico 7 días (ciudad default)");
  console.log("  6. Pronóstico 7 días (todas las ciudades)");
  console.log(`  8. Ajustes (${unitSymbol(config.unit)})`);
  console.log("  9. Salir");
  console.log(cyan(LINE));
}

function center(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text;
}

export function ask(question: string): string {
  const answer = prompt(question);
  return (answer ?? "").trim();
}

export function pause(): void {
  prompt("\nPresione Enter para continuar...");
}

export function printError(message: string): void {
  console.log(`\n${red(`✖ ${message}`)}`);
}

export function printSuccess(message: string): void {
  console.log(`\n${green(`✔ ${message}`)}`);
}

const DAY_FORMAT = new Intl.DateTimeFormat("es-ES", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function formatDay(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  const label = DAY_FORMAT.format(parsed);
  return label.charAt(0).toUpperCase() + label.slice(1);
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
