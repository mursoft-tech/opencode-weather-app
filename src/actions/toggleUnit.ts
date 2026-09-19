import type { Config } from "../types/index.ts";
import { printSuccess } from "../presentation/output.ts";
import { saveSettings } from "../storage/settingsStorage.ts";
import { unitSymbol } from "../utils/format.ts";

export async function toggleUnit(config: Config): Promise<void> {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  await saveSettings({ unit: config.unit });
  printSuccess(`Unidad: ${unitSymbol(config.unit)}`);
}
