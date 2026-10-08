import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSite, post } from "./helpers.js";

const posts = () => ({
  "2026-10-13-first.md": post({ title: "First post", date: "2026-10-13" }),
  "2026-10-14-second.md": post({ title: `Second & <b>"special"</b> post`, date: "2026-10-14" }),
  "2026-10-15-third.md": post({ title: "Third post", date: "2026-10-15" }),
  "2026-10-16-hidden.md": post({ title: "Hidden draft", date: "2026-10-16", status: "draft" }),
});

const pager = (html) => html.match(/<nav class="post-pager"[\s\S]*?<\/nav>/)?.[0];

test("a middle post links to its older and newer neighbours by title", async () => {
  const s = await buildSite(posts());
  const nav = pager(s.read("posts/second/index.html"));
  assert.ok(nav, "pager exists");
  assert.match(nav, /rel="prev" href="\/posts\/first\/">[^<]*<[^>]*>←<\/span>\s*First post/);
  assert.match(nav, /rel="next" href="\/posts\/third\/">\s*Third post\s*<span[^>]*>→<\/span>/);
  assert.ok(!/Older|Newer/.test(nav), "no Older/Newer labels");
});

test("the oldest post only links forward and the newest only links back", async () => {
  const s = await buildSite(posts());
  const oldest = pager(s.read("posts/first/index.html"));
  assert.ok(oldest.includes('rel="next"') && !oldest.includes('rel="prev"'));
  const newest = pager(s.read("posts/third/index.html"));
  assert.ok(newest.includes('rel="prev"') && !newest.includes('rel="next"'));
  assert.ok(!newest.includes("Hidden draft") && !newest.includes("/posts/hidden/"), "drafts never linked");
});

test("a single post has no pager", async () => {
  const s = await buildSite({ "2026-10-13-only.md": post({ title: "Only post" }) });
  assert.ok(!s.read("posts/only/index.html").includes("post-pager"));
});

test("neighbour titles are escaped", async () => {
  const s = await buildSite(posts());
  const nav = pager(s.read("posts/third/index.html"));
  assert.ok(nav.includes("&amp;") && !nav.includes("<b>"));
});
