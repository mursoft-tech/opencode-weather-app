import type { Settings } from "../types/index.ts";
import { loadConfig, saveConfig } from "./configFile.ts";

export async function loadSettings(): Promise<Settings> {
  const { unit } = await loadConfig();
  return { unit };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const config = await loadConfig();
  await saveConfig({ ...config, ...settings });
}
