# AGENTS.md

## Project
Console **weather CLI**. Prompts for cities, persists a default city + registered cities and unit, and can compile to a standalone executable.

## Structure
- `index.ts` — entrypoint: main menu loop and option handlers.
- `src/types.ts` — `City`, `Config`, `Unit` types.
- `src/api.ts` — `geocode()`, `getWeather()`, and `getForecast()` (7-day daily forecast); exports the `DailyForecast` type.
- `src/storage.ts` — `loadConfig()` / `saveConfig()` against `./weather-data.json`.
- `src/ui.ts` — menu rendering, `ask()` / `pause()` prompts, `printError()` / `printSuccess()`, `renderForecast()` / `weatherDescription()` (WMO code → Spanish), and ANSI color helpers (`cyan()`, `yellow()`, `green()`, `red()`).
- `weather-data.json` — persisted state (gitignored); auto-created on first save.

## Stack / runtime
- **Bun**, not Node. Use `bun` / `bunx`; do not use `npm`, `yarn`, or `node`.
- TypeScript is a `peerDependency`, not installed as a dev dep; `@types/bun` provides types.
- README and the intended UI are in **Spanish** — keep user-facing strings in Spanish.

## Commands
- Install deps: `bun install`
- Run app: `bun run index.ts` (or `bun run start`)
- Dev with watch: `bun run dev`
- Tests: `bun test` (Bun's built-in runner) — no tests exist yet.
- Typecheck: `bunx --bun tsc --noEmit` (TypeScript 7 is present in `node_modules`).
- Standalone binary (the README's stated end goal): `bun run build`, alias of `bun build --compile ./index.ts --outfile weather`.

`package.json` defines only `start` / `dev` / `build`. There are **no lint or typecheck scripts**; do not assume `npm test` / `npm run lint` exist. Add scripts there if you introduce tooling.

## Weather API (per README)
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Current weather (use lat/lon from step 1): `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
   - Add `&temperature_unit=fahrenheit` when the configured unit is Fahrenheit.
3. 7-day forecast: same endpoint with `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto&forecast_days=7`
   - `weather_code` is a WMO code mapped to Spanish text in `src/ui.ts`; `precipitation_probability_max` is the daily rain chance (%).

## Conventions
- `tsconfig.json` is strict with `noUncheckedIndexedAccess: true`; index reads return `T | undefined` — handle it.
- `moduleResolution: bundler`, `module: Preserve`, `noEmit`, `allowImportingTsExtensions` — import local files with `.ts` extensions.
- `index.ts` is the entrypoint (`module` field in `package.json`).
- No external dependencies: use Bun globals (`fetch`, `prompt`, `Bun.file`, `Bun.write`). Keep user-facing text in Spanish.
- Colors are raw ANSI codes in `src/ui.ts`, gated by `process.stdout.isTTY` (`USE_COLOR`) so output stays clean when piped; reuse the exported helpers instead of inlining escape codes. Palette: cyan = menu/title, yellow = temperature, green = success, red = errors.
- Menu options: `0` default weather, `1` all cities, `2` add, `3` remove, `4` set default, `5` 7-day forecast (default), `6` 7-day forecast (all cities), `7` reserved (free), `8` toggle °C/°F, `9` exit.
