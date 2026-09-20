import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sandbox = mkdtempSync(join(tmpdir(), "weather-cli-test-"));

process.chdir(sandbox);

process.on("exit", () => {
  rmSync(sandbox, { recursive: true, force: true });
});
