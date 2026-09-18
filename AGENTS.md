# AGENTS.md

## Project
Console **weather CLI**. Prompts for cities, persists a default city + registered cities and unit, and can compile to a standalone executable.

## Structure
- `index.ts` — entrypoint: main menu loop and option handlers.
- `src/types.ts` — `City`, `Config`, `Unit` types.
- `src/api.ts` — `geocode()` and `getWeather()`.
- `src/storage.ts` — `loadConfig()` / `saveConfig()` against `./weather-data.json`.
- `src/ui.ts` — menu rendering, `ask()` / `pause()` prompts, `printError()` / `printSuccess()`, and ANSI color helpers (`cyan()`, `yellow()`, `green()`, `red()`).
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

## Weather API (two-step, per README)
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Forecast (use lat/lon from step 1): `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
   - Add `&temperature_unit=fahrenheit` when the configured unit is Fahrenheit.

## Conventions
- `tsconfig.json` is strict with `noUncheckedIndexedAccess: true`; index reads return `T | undefined` — handle it.
- `moduleResolution: bundler`, `module: Preserve`, `noEmit`, `allowImportingTsExtensions` — import local files with `.ts` extensions.
- `index.ts` is the entrypoint (`module` field in `package.json`).
- No external dependencies: use Bun globals (`fetch`, `prompt`, `Bun.file`, `Bun.write`). Keep user-facing text in Spanish.
- Colors are raw ANSI codes in `src/ui.ts`, gated by `process.stdout.isTTY` (`USE_COLOR`) so output stays clean when piped; reuse the exported helpers instead of inlining escape codes. Palette: cyan = menu/title, yellow = temperature, green = success, red = errors.
- Menu options: `1` default weather, `2` all cities, `3` add, `4` remove, `5` set default, `8` toggle °C/°F, `9` exit.
