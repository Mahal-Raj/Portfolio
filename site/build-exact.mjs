import { mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("./", import.meta.url);
const output = new URL("./dist/", root);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const extraction = spawnSync(
  "tar",
  [
    "-xzf",
    fileURLToPath(new URL("./august24-site.tar.gz", root)),
    "-C",
    fileURLToPath(output),
  ],
  { stdio: "inherit" },
);

if (extraction.status !== 0) {
  throw new Error(`Could not publish the verified portfolio (tar exit ${extraction.status})`);
}
