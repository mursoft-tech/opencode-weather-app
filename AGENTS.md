# AGENTS.md

## Project
Console **weather CLI**. Prompts for cities, persists a default city + registered cities and unit, and can compile to a standalone executable.

## Structure
- `src/index.ts` — entrypoint: main menu loop and option dispatch.
- `src/actions/` — user-executable actions (`getWeather`, `getForecast`, `addCity`, `removeCity`, `setDefaultCity`, `listCities`, `toggleUnit`); `shared.ts` holds `resolveDefaultCity()`.
- `src/presentation/` — CLI layer: `menu.ts` (render + option selection), `output.ts` (`clear`, `printError` / `printSuccess`, `renderForecast` / `weatherDescription`), `input.ts` (`ask` / `pause`).
- `src/storage/` — `configFile.ts` (low-level `loadConfig()` / `saveConfig()` against `./weather-data.json`), `citiesStorage.ts` (`loadCities` / `saveCities` + default city), `settingsStorage.ts` (`loadSettings` / `saveSettings`).
- `src/types/` — `City.ts`, `Config.ts` (`Config`, `Unit`, `Settings`), `Weather.ts` (`DailyForecast`), `MenuOption.ts`, plus a barrel `index.ts`.
- `src/api/` — `geocoding.ts` (`geocode()`), `weather.ts` (`getWeather()`, `getForecast()` 7-day daily forecast).
- `src/utils/` — `colors.ts` (ANSI helpers), `format.ts` (`unitSymbol`, `formatCity`, `formatDay`), `constants.ts` (`CONFIG_PATH`, `LINE`, `DAY_FORMAT`, `DEFAULT_CONFIG`), `cities.ts` (`findCity`).
- `weather-data.json` — persisted state (gitignored); auto-created on first save.
- `src/tests/` — Bun test suite mirroring the source tree; `setup.ts` (preload) redirects `process.cwd()` to a temp dir so storage tests never touch the real `weather-data.json`, and `helpers.ts` stubs `fetch` / `prompt` and captures `console.log`.

## Stack / runtime
- **Bun**, not Node. Use `bun` / `bunx`; do not use `npm`, `yarn`, or `node`.
- TypeScript is a `peerDependency`, not installed as a dev dep; `@types/bun` provides types.
- README and the intended UI are in **Spanish** — keep user-facing strings in Spanish.

## Commands
- Install deps: `bun install`
- Run app: `bun run src/index.ts` (or `bun run start`)
- Dev with watch: `bun run dev`
- Tests: `bun test` (Bun's built-in runner) / `bun run test`; watch mode: `bun run test:watch`.
- Typecheck: `bunx --bun tsc --noEmit` (TypeScript 7 is present in `node_modules`).
- Standalone binary (the README's stated end goal): `bun run build`, which runs `bun test` first and aborts if any test fails, then `bun build --compile src/index.ts --outfile weather`.

`package.json` defines `test` / `test:watch` / `build` / `start` / `dev`. There are still **no lint or typecheck scripts**; do not assume `npm run lint` exists.

## Weather API (per README)
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Current weather (use lat/lon from step 1): `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
   - Add `&temperature_unit=fahrenheit` when the configured unit is Fahrenheit.
3. 7-day forecast: same endpoint with `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto&forecast_days=7`
   - `weather_code` is a WMO code mapped to Spanish text in `src/presentation/output.ts`; `precipitation_probability_max` is the daily rain chance (%).

## Conventions
- `tsconfig.json` is strict with `noUncheckedIndexedAccess: true`; index reads return `T | undefined` — handle it.
- `moduleResolution: bundler`, `module: Preserve`, `noEmit`, `allowImportingTsExtensions` — import local files with `.ts` extensions.
- `src/index.ts` is the entrypoint (`module` field in `package.json`).
- No external dependencies: use Bun globals (`fetch`, `prompt`, `Bun.file`, `Bun.write`). Keep user-facing text in Spanish.
- Colors are raw ANSI codes in `src/utils/colors.ts`, gated by `process.stdout.isTTY` (`USE_COLOR`) so output stays clean when piped; reuse the exported helpers instead of inlining escape codes. Palette: cyan = menu/title, yellow = temperature, green = success, red = errors.
- Menu options: `0` default weather, `1` all cities, `2` add, `3` remove, `4` set default, `5` 7-day forecast (default), `6` 7-day forecast (all cities), `7` reserved (free), `8` toggle °C/°F, `9` exit.
