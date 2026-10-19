import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { findVisuals, NO_VISUAL_LEGACY } from "../scripts/visuals.js";

// Owner's rule (2026-10-19): every post carries at least one topic visual.
const SVG = [
  '<figure class="diagram">',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" width="640" role="img" aria-labelledby="t1 d1">',
  '<title id="t1">Two boxes</title>',
  '<desc id="d1">A box points at another box.</desc>',
  "</svg>",
  "<figcaption>How to read it.</figcaption>",
  "</figure>",
].join("\n");
const IMG = '<figure><img src="/assets/posts/demo/img-1.png" alt="The Xcode build log" loading="lazy"><figcaption>Caption</figcaption></figure>';

test("an inline SVG diagram with a title counts as a visual", () => {
  const r = findVisuals(`Intro.\n\n${SVG}\n\nMore.`);
  assert.equal(r.visuals.length, 1);
  assert.equal(r.visuals[0].kind, "svg");
  assert.deepEqual(r.problems, []);
});

test("a figure image with alt text counts and reports its src", () => {
  const r = findVisuals(`Intro.\n\n${IMG}\n`);
  assert.deepEqual(r.visuals, [{ kind: "img", src: "/assets/posts/demo/img-1.png" }]);
  assert.deepEqual(r.problems, []);
});

test("a Markdown image with alt text counts", () => {
  const r = findVisuals("![A diagram of the flow](/assets/posts/demo/flow.png)");
  assert.deepEqual(r.visuals, [{ kind: "img", src: "/assets/posts/demo/flow.png" }]);
});

test("plain text has no visual", () => {
  assert.deepEqual(findVisuals("Just words.\n\n## Heading\n\nMore words.").visuals, []);
});

test("visuals inside code fences or HTML comments do not count", () => {
  const md = "```html\n" + SVG + "\n```\n\n<!-- " + IMG + " -->\n";
  assert.deepEqual(findVisuals(md).visuals, []);
});

test("an image without alt text or an SVG without a title is a problem, not a visual", () => {
  const r = findVisuals('<figure><img src="/a.png" alt=""></figure>\n\n![](/b.png)\n\n<figure class="diagram"><svg viewBox="0 0 10 10"></svg></figure>');
  assert.equal(r.visuals.length, 0);
  assert.equal(r.problems.length, 3);
  assert.ok(r.problems.every((p) => /alt|title/.test(p)), r.problems.join("; "));
});

// --- The real site -------------------------------------------------------

const POSTS = "src/posts";
const DRAFTS = "drafts";
const TEMPLATES = new Set(["TEMPLATE.md", "HOW-IT-WORKS-TEMPLATE.md"]);
const slugOf = (f) => f.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
const mdFiles = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : []);

function checkFile(file) {
  const { content } = matter(readFileSync(file, "utf8"));
  const { visuals, problems } = findVisuals(content);
  const missing = visuals
    .filter((v) => v.kind === "img" && v.src.startsWith("/assets/"))
    .filter((v) => !existsSync(path.join("src", v.src)))
    .map((v) => `image file not found: src${v.src}`);
  return { visuals, problems: [...problems, ...missing] };
}

test("every published post has a topic visual (legacy posts listed in NO_VISUAL_LEGACY excepted)", () => {
  const failures = [];
  for (const f of mdFiles(POSTS)) {
    const file = path.join(POSTS, f);
    if (matter(readFileSync(file, "utf8")).data.status !== "ready") continue;
    const { visuals, problems } = checkFile(file);
    if (problems.length) failures.push(`${file}: ${problems.join("; ")}`);
    if (NO_VISUAL_LEGACY.has(slugOf(f))) {
      if (visuals.length) failures.push(`${file} now has a visual: remove "${slugOf(f)}" from NO_VISUAL_LEGACY in scripts/visuals.js`);
    } else if (!visuals.length) {
      failures.push(`${file}: no topic visual (add a <figure> with an inline SVG diagram or an image with alt text)`);
    }
  }
  assert.deepEqual(failures, []);
});

test("every legacy exception still exists as a post", () => {
  const slugs = new Set(mdFiles(POSTS).map(slugOf));
  for (const s of NO_VISUAL_LEGACY) assert.ok(slugs.has(s), `NO_VISUAL_LEGACY lists "${s}", which is not in ${POSTS}`);
});

test("every waiting draft has a topic visual", () => {
  const failures = [];
  for (const f of mdFiles(DRAFTS).filter((f) => !TEMPLATES.has(f))) {
    const file = path.join(DRAFTS, f);
    const { visuals, problems } = checkFile(file);
    if (problems.length) failures.push(`${file}: ${problems.join("; ")}`);
    if (!visuals.length) failures.push(`${file}: no topic visual; a draft without one cannot be published (owner's rule 2026-10-19)`);
  }
  assert.deepEqual(failures, []);
});

test("both draft templates show the visual the routines ask for", () => {
  for (const t of TEMPLATES) {
    const { visuals, problems } = findVisuals(matter(readFileSync(path.join(DRAFTS, t), "utf8")).content);
    assert.ok(visuals.some((v) => v.kind === "svg"), t);
    assert.deepEqual(problems, [], t);
  }
});
