import Eleventy from "@11ty/eleventy";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export async function buildSite(extraPosts = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "blog-test-"));
  const input = path.join(root, "src");
  const outDir = path.join(root, "out");
  cpSync("src", input, { recursive: true });
  mkdirSync(path.join(input, "posts"), { recursive: true });
  for (const [name, markdown] of Object.entries(extraPosts)) {
    writeFileSync(path.join(input, "posts", name), markdown);
  }
  const eleventy = new Eleventy(input, outDir, { quietMode: true });
  await eleventy.write();
  return {
    outDir,
    read: (rel) => readFileSync(path.join(outDir, rel), "utf8"),
    exists: (rel) => existsSync(path.join(outDir, rel)),
  };
}
