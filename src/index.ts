import { addCity } from "./actions/addCity.ts";
import { forecastAll, forecastDefault } from "./actions/getForecast.ts";
import { weatherAll, weatherDefault } from "./actions/getWeather.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { toggleUnit } from "./actions/toggleUnit.ts";
import { pause } from "./presentation/input.ts";
import { renderMenu, selectOption } from "./presentation/menu.ts";
import { printError } from "./presentation/output.ts";
import { loadConfig, saveConfig } from "./storage/configFile.ts";

async function main(): Promise<void> {
  const config = await loadConfig();

  while (true) {
    renderMenu(config);
    const option = selectOption();
    if (!option) {
      printError("Opción no válida.");
      pause();
      continue;
    }

    switch (option) {
      case "0":
        await weatherDefault(config);
        break;
      case "1":
        await weatherAll(config);
        break;
      case "2":
        await addCity(config);
        break;
      case "3":
        await removeCity(config);
        break;
      case "4":
        await setDefaultCity(config);
        break;
      case "5":
        await forecastDefault(config);
        break;
      case "6":
        await forecastAll(config);
        break;
      case "8":
        await toggleUnit(config);
        break;
      case "9":
        await saveConfig(config);
        console.log("\n¡Hasta luego!");
        return;
    }

    pause();
  }
}

await main();
