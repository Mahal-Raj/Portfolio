import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("./", import.meta.url);
const output = new URL("./dist/", root);
const archive = fileURLToPath(new URL("./august24-projects-overlay.tar.gz", root));
const outputPath = fileURLToPath(output);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL("./site/", root), output, { recursive: true });

const extraction = spawnSync("tar", ["-xzf", archive, "-C", outputPath], { stdio: "inherit" });
if (extraction.status !== 0) {
  throw new Error(`Could not apply the verified portfolio overlay (tar exit ${extraction.status})`);
}
