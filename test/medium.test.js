import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSite, post } from "./helpers.js";

const URL_ = "https://medium.com/@someone/hello-123abc";

test("a post with medium_url shows an Originally published on Medium note", async () => {
  const s = await buildSite({
    "2022-10-31-hello.md": post({ date: "2022-10-31", extra: [`medium_url: ${URL_}`] }),
  });
  const html = s.read("posts/hello/index.html");
  assert.match(html, /Originally published on <a href="https:\/\/medium\.com\/@someone\/hello-123abc"[^>]*>Medium<\/a>/);
  assert.ok(html.includes('<link rel="canonical" href="https://blog.bahadirsonmez.com/posts/hello/">'), "blog stays canonical");
});

test("medium_publication names the publication", async () => {
  const s = await buildSite({
    "2022-11-10-pub.md": post({
      date: "2022-11-10",
      extra: [`medium_url: ${URL_}`, `medium_publication: Better Programming`],
    }),
  });
  assert.match(s.read("posts/pub/index.html"), /Originally published in Better Programming on <a href="[^"]+"[^>]*>Medium<\/a>/);
});

test("a post without medium_url has no Medium note", async () => {
  const s = await buildSite({ "2026-10-13-plain.md": post({}) });
  assert.ok(!s.read("posts/plain/index.html").includes("Originally published"));
});

test("the note escapes the publication name", async () => {
  const s = await buildSite({
    "2022-11-11-esc.md": post({
      date: "2022-11-11",
      extra: [`medium_url: ${URL_}`, `medium_publication: 'A & <b>B</b>'`],
    }),
  });
  const html = s.read("posts/esc/index.html");
  assert.ok(html.includes("A &amp; &lt;b&gt;B&lt;/b&gt;") && !html.includes("<b>B</b>"));
});
