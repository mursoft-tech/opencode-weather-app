import { geocode, getForecast, getWeather } from "./src/api.ts";
import { loadConfig, saveConfig } from "./src/storage.ts";
import { ask, pause, printError, printSuccess, renderForecast, renderMenu, unitSymbol, yellow } from "./src/ui.ts";
import type { City, Config } from "./src/types.ts";

function formatCity(city: City): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}

function findCity(config: Config, name: string): City | undefined {
  const target = name.trim().toLowerCase();
  return config.cities.find((city) => city.name.toLowerCase() === target);
}

function listCities(config: Config): void {
  config.cities.forEach((city, index) => {
    console.log(`  ${index + 1}. ${formatCity(city)}`);
  });
}

async function showWeather(city: City, config: Config): Promise<void> {
  try {
    const temperature = await getWeather(city, config.unit);
    console.log(`\n  ${formatCity(city)}: ${yellow(`${temperature.toFixed(1)} ${unitSymbol(config.unit)}`)}`);
  } catch (error) {
    printError((error as Error).message);
  }
}

function resolveDefaultCity(config: Config): City | undefined {
  if (!config.defaultCity) {
    printError("No hay una ciudad default. Usa la opción 4 para establecerla.");
    return undefined;
  }
  const city = findCity(config, config.defaultCity);
  if (!city) {
    printError(`La ciudad default "${config.defaultCity}" ya no existe en la lista.`);
    return undefined;
  }
  return city;
}

async function weatherDefault(config: Config): Promise<void> {
  const city = resolveDefaultCity(config);
  if (!city) {
    return;
  }
  await showWeather(city, config);
}

async function showForecast(city: City, config: Config): Promise<void> {
  try {
    const forecast = await getForecast(city, config.unit);
    renderForecast(formatCity(city), forecast, config.unit);
  } catch (error) {
    printError((error as Error).message);
  }
}

async function forecastDefault(config: Config): Promise<void> {
  const city = resolveDefaultCity(config);
  if (!city) {
    return;
  }
  await showForecast(city, config);
}

async function forecastAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades registradas. Usa la opción 2 para agregar una.");
    return;
  }
  for (const city of config.cities) {
    await showForecast(city, config);
  }
}

async function weatherAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades registradas. Usa la opción 2 para agregar una.");
    return;
  }
  console.log("");
  for (const city of config.cities) {
    await showWeather(city, config);
  }
}

async function addCity(config: Config): Promise<void> {
  const name = ask("Nombre de la ciudad: ");
  if (!name) {
    return;
  }

  try {
    const city = await geocode(name);
    if (findCity(config, city.name)) {
      printError(`La ciudad "${city.name}" ya está registrada.`);
      return;
    }
    config.cities.push(city);
    await saveConfig(config);
    printSuccess(`Ciudad agregada: ${formatCity(city)}`);
  } catch (error) {
    printError((error as Error).message);
  }
}

async function removeCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades para eliminar.");
    return;
  }
  listCities(config);
  const name = ask("\nNombre de la ciudad a eliminar: ");
  if (!name) {
    return;
  }

  const city = findCity(config, name);
  if (!city) {
    printError(`No se encontró "${name}" en la lista.`);
    return;
  }

  config.cities = config.cities.filter((item) => item !== city);
  if (config.defaultCity?.toLowerCase() === city.name.toLowerCase()) {
    config.defaultCity = undefined;
  }
  await saveConfig(config);
  printSuccess(`Ciudad eliminada: ${formatCity(city)}`);
}

async function setDefaultCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades registradas. Usa la opción 2 para agregar una.");
    return;
  }
  listCities(config);
  const name = ask("\nNombre de la ciudad default: ");
  if (!name) {
    return;
  }

  const city = findCity(config, name);
  if (!city) {
    printError(`No se encontró "${name}" en la lista.`);
    return;
  }

  config.defaultCity = city.name;
  await saveConfig(config);
  printSuccess(`Ciudad default: ${formatCity(city)}`);
}

async function toggleUnit(config: Config): Promise<void> {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  await saveConfig(config);
  printSuccess(`Unidad: ${unitSymbol(config.unit)}`);
}

async function main(): Promise<void> {
  const config = await loadConfig();

  while (true) {
    renderMenu(config);
    const option = ask("Selecciona una opción: ");

    switch (option) {
      case "0":
        await weatherDefault(config);
        pause();
        break;
      case "1":
        await weatherAll(config);
        pause();
        break;
      case "2":
        await addCity(config);
        pause();
        break;
      case "3":
        await removeCity(config);
        pause();
        break;
      case "4":
        await setDefaultCity(config);
        pause();
        break;
      case "5":
        await forecastDefault(config);
        pause();
        break;
      case "6":
        await forecastAll(config);
        pause();
        break;
      case "8":
        await toggleUnit(config);
        pause();
        break;
      case "9":
        await saveConfig(config);
        console.log("\n¡Hasta luego!");
        return;
      default:
        printError(`Opción no válida: ${option}`);
        pause();
        break;
    }
  }
}

await main();
