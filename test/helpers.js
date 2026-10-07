import Eleventy from "@11ty/eleventy";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

// Temp builds live inside the project: Eleventy only resolves directory data
// files (posts.11tydata.js) for inputs under the working directory.
const TMP_BASE = path.join(process.cwd(), ".tmp-test", String(process.pid));
mkdirSync(TMP_BASE, { recursive: true });
process.on("exit", () => rmSync(TMP_BASE, { recursive: true, force: true }));

export async function buildSite(extraPosts = {}) {
  const root = mkdtempSync(path.join(TMP_BASE, "build-"));
  const input = path.join(root, "src");
  const outDir = path.join(root, "out");
  cpSync("src", input, { recursive: true });
  mkdirSync(path.join(input, "posts"), { recursive: true });
  for (const [name, markdown] of Object.entries(extraPosts)) {
    writeFileSync(path.join(input, "posts", name), markdown);
  }
  const eleventy = new Eleventy(path.relative(process.cwd(), input), path.relative(process.cwd(), outDir), { quietMode: true });
  await eleventy.write();
  return {
    outDir,
    read: (rel) => readFileSync(path.join(outDir, rel), "utf8"),
    exists: (rel) => existsSync(path.join(outDir, rel)),
  };
}

// Runs eleventy.config.js against a fake config and returns what it registered.
export async function captureConfig() {
  const { default: config } = await import("../eleventy.config.js");
  const filters = {};
  const collections = {};
  const fake = new Proxy({}, {
    get: (_, method) => {
      if (method === "addFilter") return (name, fn) => { filters[name] = fn; };
      if (method === "addCollection") return (name, fn) => { collections[name] = fn; };
      return () => {};
    },
  });
  config(fake);
  return { filters, collections };
}

export function post({ title = "Hello", description, date = "2026-10-12", tags = ["apple-dev"], status = "ready", cta_app, words = 500 } = {}) {
  const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
  const lines = ["---", `title: ${q(title)}`];
  if (description !== undefined) lines.push(`description: ${q(description)}`);
  lines.push(`date: ${date}`, `tags: [${tags.join(", ")}]`, `status: ${status}`);
  if (cta_app) lines.push(`cta_app: ${cta_app}`);
  lines.push("---", "", "word ".repeat(words), "");
  return lines.join("\n");
}
