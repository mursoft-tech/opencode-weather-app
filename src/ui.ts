import type { Config, Unit } from "./types.ts";

const LINE = "═".repeat(40);

export function unitSymbol(unit: Unit): string {
  return unit === "fahrenheit" ? "°F" : "°C";
}

export function clear(): void {
  console.log("\x1b[2J\x1b[H");
}

export function renderMenu(config: Config): void {
  clear();
  console.log(LINE);
  console.log(center("WEATHER CLI", LINE.length));
  console.log(LINE);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${config.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitSymbol(config.unit)})`);
  console.log("  9. Salir");
  console.log(LINE);
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
  console.log(`\n✖ ${message}`);
}
