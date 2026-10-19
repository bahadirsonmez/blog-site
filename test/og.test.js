import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { buildSite, post } from "./helpers.js";
import { fitTitle, renderOgImage } from "../src/_og/render.js";

const pngSize = (buf) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

let site;
async function built() {
  site ??= await buildSite({
    "2026-10-12-essay.md": post({ title: "An essay about SwiftUI" }),
    "2026-10-13-explainer.md": post({ title: "How DNS turns a name into an address", tags: ["how-it-works"] }),
    "2026-10-14-draft.md": post({ title: "Not yet", status: "draft" }),
  });
  return site;
}

test("each post links its own og:image and twitter:image", async () => {
  const html = (await built()).read("posts/essay/index.html");
  assert.match(html, /property="og:image" content="https:\/\/blog\.bahadirsonmez\.com\/posts\/essay\/og\.png"/);
  assert.match(html, /name="twitter:image" content="https:\/\/blog\.bahadirsonmez\.com\/posts\/essay\/og\.png"/);
  assert.match(html, /property="og:image:alt" content="An essay about SwiftUI · Bahadır Sönmez, Blog"/);
  assert.ok(!html.includes("social-preview-2026-10.png"), "post pages do not fall back to the shared image");
});

test("each published post gets a 1200x630 PNG", async () => {
  const s = await built();
  for (const slug of ["essay", "explainer"]) {
    const buf = readFileSync(path.join(s.outDir, "posts", slug, "og.png"));
    assert.equal(buf.subarray(1, 4).toString(), "PNG");
    assert.deepEqual(pngSize(buf), { width: 1200, height: 630 });
  }
  assert.ok(!s.exists("posts/draft/og.png"), "drafts get no image");
});

test("non-post pages keep the shared preview image", async () => {
  const html = (await built()).read("index.html");
  assert.match(html, /property="og:image" content="https:\/\/blog\.bahadirsonmez\.com\/assets\/social-preview-2026-10\.png"/);
});

test("How it works posts carry their own label", async () => {
  const essay = await renderOgImage({ title: "Same title" });
  const explainer = await renderOgImage({ title: "Same title", explainer: true });
  assert.notDeepEqual(essay, explainer);
});

test("long titles shrink so they stay inside the card", () => {
  const short = fitTitle("Short title");
  const long = fitTitle("Multiseat subscriptions are on by default. Check yours before Oct 22 and again after");
  assert.ok(long.fontSize < short.fontSize);
  assert.ok(long.lines <= 4);
});
