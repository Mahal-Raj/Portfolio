import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const source = new URL(".", import.meta.url);
const output = new URL("./dist/", source);

await rm(output, { recursive: true, force: true });
await mkdir(new URL("./dist/projects/", source), { recursive: true });
await mkdir(new URL("./dist/portfolio-addon/assets/chunks/", source), { recursive: true });
await mkdir(new URL("./dist/portfolio-addon/assets/fonts/", source), { recursive: true });
await mkdir(new URL("./dist/portfolio-addon/images/projects/", source), { recursive: true });

await cp(new URL("./_next/static/immutable/chunks/", source), new URL("./dist/portfolio-addon/assets/chunks/", source), { recursive: true });
await cp(new URL("./_next/static/immutable/media/", source), new URL("./dist/portfolio-addon/assets/fonts/", source), { recursive: true });
await cp(new URL("./images/projects/", source), new URL("./dist/portfolio-addon/images/projects/", source), { recursive: true });

for (const name of ["custom.css", "static.js"]) {
  await cp(new URL(`./${name}`, source), new URL(`./dist/portfolio-addon/${name}`, source));
}

let projects = await readFile(new URL("./projects.html", source), "utf8");
projects = projects
  .replaceAll('href="/assets/', 'href="/portfolio-addon/assets/')
  .replaceAll('href="/custom.css"', 'href="/portfolio-addon/custom.css"')
  .replaceAll('src="/static.js"', 'src="/portfolio-addon/static.js"')
  .replaceAll('src="/images/projects/', 'src="/portfolio-addon/images/projects/')
  .replace(/\s*<a class="arrow-link" href="\/projects\/deployguard-cloud-platform">View case study →<\/a>/, "")
  .replace(/\s*<a class="arrow-link" href="\/projects\/deployguard-cloud-platform#demo">Watch demo →<\/a>/, "")
  .replace(/\s*<a class="arrow-link" href="\/projects\/signaldesk-ai">View case study →<\/a>/, "")
  .replace(/\s*<a class="arrow-link" href="\/projects\/signaldesk-ai#demo">Watch demo →<\/a>/, "")
  .replaceAll("working system / recorded demo", "project overview / source code");

await writeFile(new URL("./dist/projects/index.html", source), projects);
