import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promote } from "../scripts/promote.js";

const LINKEDIN = "Hook line one.\nHook line two.\nhttps://blog.bahadirsonmez.com/posts/demo/?utm_source=linkedin";
const X = "Short post https://blog.bahadirsonmez.com/posts/demo/?utm_source=x";

function draft({ status = "draft", marker = false, omit = "", quotedStatus = false, tags = "[apple-dev]" } = {}) {
  const fm = { title: "Demo post", description: "A demo.", date: "2026-10-12", tags };
  const lines = ["---"];
  for (const [k, v] of Object.entries(fm)) if (k !== omit) lines.push(`${k}: ${k === "tags" ? v : JSON.stringify(v)}`);
  lines.push(quotedStatus ? `status: "${status}"` : `status: ${status}`, "---", "", "## Why this topic", "Owner-only note.", "<!-- end why -->", "", "Opening paragraph.", "", "## Body heading", marker ? "[BAHADIR: what did you see?]" : "Body text.", "", "## Sources", "- [A](https://example.com)", "", "## LinkedIn", LINKEDIN, "", "## X", X, "");
  return lines.join("\n");
}

function setup(content) {
  const root = mkdtempSync(path.join(tmpdir(), "promote-"));
  const dirs = { drafts: path.join(root, "drafts"), posts: path.join(root, "src/posts"), archive: path.join(root, "drafts/published") };
  mkdirSync(dirs.drafts, { recursive: true });
  mkdirSync(dirs.posts, { recursive: true });
  const file = path.join(dirs.drafts, "2026-10-12-demo.md");
  writeFileSync(file, content);
  return { file, dirs, opts: { srcPostsDir: dirs.posts, archiveDir: dirs.archive } };
}

test("refuses drafts with [BAHADIR: markers", () => {
  const { file, dirs, opts } = setup(draft({ marker: true }));
  assert.throws(() => promote(file, opts), /BAHADIR.*line \d+|line \d+.*BAHADIR/s);
  assert.ok(existsSync(file));
  assert.deepEqual(readdirSync(dirs.posts), []);
});

test("promotes a clean draft", () => {
  const { file, dirs, opts } = setup(draft());
  const res = promote(file, opts);
  const post = readFileSync(res.postPath, "utf8");
  assert.equal(path.dirname(res.postPath), dirs.posts);
  assert.match(post, /^status: ready$/m);
  assert.ok(!/status: draft/.test(post));
  assert.ok(post.includes("## Sources") && post.includes("## Body heading") && post.includes("Opening paragraph."));
  for (const h of ["## Why this topic", "## LinkedIn", "## X"]) assert.ok(!post.includes(h), h);
  assert.ok(!post.includes("utm_source"));
  assert.ok(!existsSync(file), "draft moved");
  assert.ok(readFileSync(res.archivePath, "utf8").includes(LINKEDIN));
  assert.equal(res.social.linkedin, LINKEDIN);
  assert.equal(res.social.x, X);
});

test("a missing end-why marker is refused, never silently dropping text", () => {
  const { file, dirs, opts } = setup(draft().replace("<!-- end why -->\n", ""));
  assert.throws(() => promote(file, opts), /end why/);
  assert.ok(existsSync(file));
  assert.deepEqual(readdirSync(dirs.posts), []);
});

test("an end-why marker with surrounding whitespace is accepted", () => {
  const { file, opts } = setup(draft().replace("<!-- end why -->", "  <!-- end why -->  "));
  const post = readFileSync(promote(file, opts).postPath, "utf8");
  assert.ok(post.includes("Opening paragraph.") && !post.includes("Owner-only note."));
});

test("a quoted status: \"draft\" is rewritten to ready", () => {
  const { file, opts } = setup(draft({ quotedStatus: true }));
  const post = readFileSync(promote(file, opts).postPath, "utf8");
  assert.match(post, /^status: ready$/m);
  assert.ok(!/draft/.test(post.split("---")[1]));
});

test("refuses tags that are not lowercase kebab-case", () => {
  for (const tags of ["[SwiftUI]", "[c++]", "[apple dev]"]) {
    const { file, dirs, opts } = setup(draft({ tags }));
    assert.throws(() => promote(file, opts), /tag/i, tags);
    assert.ok(existsSync(file));
    assert.deepEqual(readdirSync(dirs.posts), []);
  }
});

test("refuses a slug that already exists under another date", () => {
  const { file, dirs, opts } = setup(draft());
  writeFileSync(path.join(dirs.posts, "2026-10-05-demo.md"), "existing");
  assert.throws(() => promote(file, opts), /slug/i);
  assert.ok(existsSync(file));
});

test("refuses non-draft status or incomplete frontmatter", () => {
  assert.throws(() => promote(setup(draft({ status: "ready" })).file, setup(draft()).opts), /status/);
  const s = setup(draft({ omit: "tags" }));
  assert.throws(() => promote(s.file, s.opts), /tags/);
});

test("refuses to overwrite an existing post", () => {
  const { file, dirs, opts } = setup(draft());
  writeFileSync(path.join(dirs.posts, "2026-10-12-demo.md"), "existing");
  assert.throws(() => promote(file, opts), /exists/);
  assert.equal(readFileSync(path.join(dirs.posts, "2026-10-12-demo.md"), "utf8"), "existing");
  assert.ok(existsSync(file));
});
