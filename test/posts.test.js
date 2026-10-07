import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSite, captureConfig, post } from "./helpers.js";

const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;

test("ready post renders at /posts/<slug>/", async () => {
  const s = await buildSite({
    "2026-10-12-hello.md": post({ title: "Hello World", cta_app: "healthbar" }),
  });
  const html = s.read("posts/hello/index.html");
  assert.match(html, /<h1>Hello World<\/h1>/);
  assert.match(html, /\d+ min read/);
  const ld = JSON.parse(html.match(LD)[1]);
  assert.equal(ld["@type"], "BlogPosting");
  assert.equal(ld.headline, "Hello World");
  assert.equal(ld.datePublished, "2026-10-12");
  assert.equal(ld.author.name, "Bahadır Sönmez");
  assert.equal(ld.mainEntityOfPage, "https://blog.bahadirsonmez.com/posts/hello/");
  assert.match(html, /<aside class="cta">[\s\S]*https:\/\/healthbar\.bahadirsonmez\.com\//);
  assert.match(html, /class="author-box"[\s\S]*href="https:\/\/bahadirsonmez\.com\/"/);
  assert.match(html, /property="og:type" content="article"/);
});

test("draft status in src/posts is not published", async () => {
  const s = await buildSite({ "2026-10-13-secret.md": post({ status: "draft" }) });
  assert.ok(!s.exists("posts/secret/index.html"));
});

test("special characters are escaped", async () => {
  const title = `Q&A: <b>"Swift" & Bahadır's ıö</b> </script><script>alert(1)</script>`;
  const s = await buildSite({ "2026-10-14-special.md": post({ title }) });
  const html = s.read("posts/special/index.html");
  const pageTitle = html.match(/<title>([\s\S]*?)<\/title>/)[1];
  assert.ok(pageTitle.includes("&amp;"));
  assert.ok(!pageTitle.includes("<b>"));
  assert.ok(!html.includes("<script>alert(1)"));
  assert.equal(JSON.parse(html.match(LD)[1]).headline, title);
});

test("unknown or missing cta_app renders no CTA and does not fail", async () => {
  const s = await buildSite({
    "2026-10-15-a.md": post({ cta_app: "nope" }),
    "2026-10-16-b.md": post({}),
  });
  for (const slug of ["a", "b"]) {
    assert.ok(!/class="cta"/.test(s.read(`posts/${slug}/index.html`)));
  }
});

test("missing description falls back to a non-empty summary of at most 160 chars", async () => {
  const s = await buildSite({ "2026-10-17-nodesc.md": post({}) });
  const html = s.read("posts/nodesc/index.html");
  const d = html.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(d.length > 0 && d.length <= 160);
  assert.ok(d.startsWith("word"));
});

test("readingTime: 0 words → 1, 440 → 2, 441 → 3", async () => {
  const { filters } = await captureConfig();
  const words = (n) => "<p>" + "word ".repeat(n) + "</p>";
  assert.equal(filters.readingTime(words(0)), 1);
  assert.equal(filters.readingTime(words(440)), 2);
  assert.equal(filters.readingTime(words(441)), 3);
});

test("humanDate and isoDate format in UTC", async () => {
  const { filters } = await captureConfig();
  const d = new Date("2026-10-07T00:00:00Z");
  assert.equal(filters.humanDate(d), "7 October 2026");
  assert.equal(filters.isoDate(d), "2026-10-07");
});
