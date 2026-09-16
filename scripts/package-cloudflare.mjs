import { access, cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// Only compiled files and public configuration cross to the deployment runner.
const root = fileURLToPath(new URL("../", import.meta.url));
const apiBundle = join(root, "apps/api/dist/worker");
const webBundle = join(root, "apps/web/dist");
await access(join(apiBundle, "worker.js"));
await access(join(webBundle, "server/wrangler.json"));

const release = join(root, "release");
await mkdir(release, { recursive: true });
await cp(apiBundle, join(release, "api"), { recursive: true });
await cp(webBundle, join(release, "web"), { recursive: true });

const { $schema, ...apiConfig } = JSON.parse(
  await readFile(join(root, "apps/api/wrangler.jsonc"), "utf8"),
);
await writeFile(join(release, "api/wrangler.json"), JSON.stringify({
  ...apiConfig,
  main: "worker.js",
  no_bundle: true,
}, null, 2) + "\n");
console.log("Prepared release/api and release/web for the private deployment runner.");
