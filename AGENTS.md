# AGENTS.md

## Project
Console **weather CLI** (currently a stub). Goal: prompt for a city, persist default/favorite cities, and eventually compile to a standalone executable.

## Stack / runtime
- **Bun**, not Node. Use `bun` / `bunx`; do not use `npm`, `yarn`, or `node`.
- TypeScript is a `peerDependency`, not installed as a dev dep; `@types/bun` provides types.
- README and the intended UI are in **Spanish** — keep user-facing strings in Spanish.

## Commands
- Install deps: `bun install`
- Run app: `bun run index.ts`
- Tests: `bun test` (Bun's built-in runner) — no tests exist yet.
- Standalone binary (the README's stated end goal): `bun build --compile ./index.ts --outfile weather`

There are **no `scripts`, lint, or typecheck configs** in `package.json`. Do not assume `npm test` / `npm run lint` exist; add scripts there if you introduce tooling.

## Weather API (two-step, per README)
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Forecast (use lat/lon from step 1): `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

## Conventions
- `tsconfig.json` is strict with `noUncheckedIndexedAccess: true`; index reads return `T | undefined` — handle it.
- `moduleResolution: bundler`, `module: Preserve`, `noEmit`, `allowImportingTsExtensions` — import local files with `.ts` extensions.
- `index.ts` is the entrypoint (`module` field in `package.json`).
