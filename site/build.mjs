import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { basename, join } from "node:path";

const source = new URL(".", import.meta.url);
const output = new URL("./dist/", source);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const name of ["assets", "images", "video"]) {
  await cp(new URL(`./${name}/`, source), new URL(`./dist/${name}/`, source), {
    recursive: true,
  });
}

for (const name of ["custom.css", "static.js", "icon.svg", "robots.txt", "sitemap.xml"]) {
  await cp(new URL(`./${name}`, source), new URL(`./dist/${name}`, source));
}

for (const entry of await readdir(source, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
  if (entry.name === "index.html") {
    await cp(new URL("./index.html", source), new URL("./dist/index.html", source));
    continue;
  }
  const route = basename(entry.name, ".html");
  await mkdir(new URL(`./dist/${route}/`, source), { recursive: true });
  await cp(new URL(`./${entry.name}`, source), new URL(`./dist/${route}/index.html`, source));
}

for (const entry of await readdir(new URL("./projects/", source), { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
  const route = basename(entry.name, ".html");
  await mkdir(new URL(`./dist/projects/${route}/`, source), { recursive: true });
  await cp(
    new URL(`./projects/${entry.name}`, source),
    new URL(`./dist/projects/${route}/index.html`, source),
  );
}
