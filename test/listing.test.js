import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSite, post } from "./helpers.js";

const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
const BETA_TITLE = `Tom & Jerry <3 "Swift"`;

const fixtures = () => ({
  "2026-10-13-alpha.md": post({ title: "Alpha post", date: "2026-10-13", tags: ["apple-dev"] }),
  "2026-10-14-beta.md": post({ title: BETA_TITLE, date: "2026-10-14", tags: ["ai"] }),
  "2026-10-15-gamma.md": post({ title: "Gamma draft", date: "2026-10-15", tags: ["secret"], status: "draft" }),
});

test("empty site builds", async () => {
  const s = await buildSite();
  for (const f of ["index.html", "feed.xml", "sitemap.xml", "robots.txt", "404.html"]) {
    assert.ok(s.exists(f), `${f} exists`);
  }
  const feed = s.read("feed.xml");
  assert.ok(feed.startsWith("<?xml"));
  assert.ok(feed.includes("<channel>"));
  assert.ok(!feed.includes("<item>"));
  assert.ok(s.read("sitemap.xml").includes("<loc>https://blog.bahadirsonmez.com/</loc>"));
});

test("home lists published posts newest first and hides drafts", async () => {
  const s = await buildSite(fixtures());
  const html = s.read("index.html");
  assert.ok(html.includes('href="/posts/alpha/"') && html.includes('href="/posts/beta/"'));
  assert.ok(html.indexOf("/posts/beta/") < html.indexOf("/posts/alpha/"));
  assert.ok(!html.includes("gamma") && !html.includes("Gamma"));
});

test("tag pages exist per used tag and list only matching posts", async () => {
  const s = await buildSite(fixtures());
  const dev = s.read("tags/apple-dev/index.html");
  assert.ok(dev.includes("/posts/alpha/") && !dev.includes("/posts/beta/"));
  assert.ok(s.exists("tags/ai/index.html"));
  assert.ok(!s.exists("tags/secret/index.html"));
  assert.ok(!s.exists("tags/posts/index.html"));
});

test("feed has absolute links and valid escaping", async () => {
  const s = await buildSite(fixtures());
  const feed = s.read("feed.xml");
  assert.equal((feed.match(/<item>/g) || []).length, 2);
  assert.ok(feed.includes("<link>https://blog.bahadirsonmez.com/posts/beta/</link>"));
  assert.ok(!/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/.test(feed), "no raw ampersands");
  assert.ok(!feed.includes("<3"), "no raw angle bracket from title");
  assert.ok(!feed.includes("Gamma"));
});

test("sitemap lists posts and tags but not drafts; robots points to it", async () => {
  const s = await buildSite(fixtures());
  const map = s.read("sitemap.xml");
  for (const u of ["posts/alpha/", "posts/beta/", "tags/ai/", "tags/apple-dev/"]) {
    assert.ok(map.includes(`<loc>https://blog.bahadirsonmez.com/${u}</loc>`), u);
  }
  assert.ok(!map.includes("gamma") && !map.includes("secret"));
  assert.ok(s.read("robots.txt").includes("Sitemap: https://blog.bahadirsonmez.com/sitemap.xml"));
});

test("home has Blog JSON-LD referencing the main-site person", async () => {
  const s = await buildSite();
  const ld = JSON.parse(s.read("index.html").match(LD)[1]);
  assert.equal(ld["@type"], "Blog");
  assert.equal(ld.url, "https://blog.bahadirsonmez.com/");
  assert.equal(ld.publisher["@id"], "https://bahadirsonmez.com/#person");
});
