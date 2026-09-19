import type { Config, MenuOption } from "../types/index.ts";
import { cyan } from "../utils/colors.ts";
import { LINE } from "../utils/constants.ts";
import { unitSymbol } from "../utils/format.ts";
import { ask } from "./input.ts";
import { clear } from "./output.ts";

const VALID_OPTIONS = new Set<string>(["0", "1", "2", "3", "4", "5", "6", "8", "9"]);

function center(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text;
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

export function selectOption(): MenuOption | undefined {
  const value = ask("Selecciona una opción: ");
  return VALID_OPTIONS.has(value) ? (value as MenuOption) : undefined;
}
