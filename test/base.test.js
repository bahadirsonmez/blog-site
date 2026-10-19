import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSite } from "./helpers.js";
import config from "../eleventy.config.js";

let home;
async function homeHtml() {
  home ??= (await buildSite()).read("index.html");
  return home;
}

test("has lang en, canonical, og and twitter tags", async () => {
  const html = await homeHtml();
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/blog\.bahadirsonmez\.com\/">/);
  assert.match(html, /property="og:site_name"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /property="og:image" content="https:\/\/blog\.bahadirsonmez\.com\/assets\/social-preview-2026-10\.png"/);
  assert.match(html, /name="twitter:image" content="https:\/\/blog\.bahadirsonmez\.com\/assets\/social-preview-2026-10\.png"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /property="og:image:alt" content="[^"]+"/);
  assert.ok(!html.includes("/assets/social-preview.png"), "no tag points at the old preview image");
});

test("social preview image is published", async () => {
  const s = await buildSite();
  assert.ok(s.exists("assets/social-preview-2026-10.png"));
});

test("includes Cloudflare beacon token", async () => {
  const html = await homeHtml();
  assert.ok(html.includes("661cc751be2d43f98143d39de57e5410"));
  assert.ok(html.includes("static.cloudflareinsights.com/beacon.min.js"));
});

test("header links to main site apps", async () => {
  const html = await homeHtml();
  assert.ok(html.includes('href="https://bahadirsonmez.com/#apps"'));
  assert.ok(html.includes('href="https://bahadirsonmez.com/"'));
});

test("footer lists every app site, Chengel as coming soon", async () => {
  const html = await homeHtml();
  const footer = html.slice(html.indexOf('<footer class="site-footer">'));
  const order = ["chengel", "ikeep", "bubbles", "ballance", "healthbar"]
    .map((app) => footer.indexOf(`href="https://${app}.bahadirsonmez.com/"`));
  assert.ok(order.every((i) => i > 0), "each app site is linked from the footer");
  assert.deepEqual([...order].sort((a, b) => a - b), order, "same order as the main site");
  assert.ok(footer.includes("Chengel (coming soon)"));
  assert.ok(!footer.includes("apps.apple.com"), "no App Store links in the footer");
});

test("has an apple-touch-icon", async () => {
  const s = await buildSite();
  assert.ok(s.read("index.html").includes('<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">'));
  assert.ok(s.exists("assets/apple-touch-icon.png"));
});

test("loads Fraunces and Inter", async () => {
  const html = await homeHtml();
  assert.ok(html.includes("fonts.googleapis.com/css2?family=Fraunces"));
  assert.ok(html.includes("family=Inter"));
});

test("jsonScript escapes <, > and &", () => {
  let filter;
  const fake = new Proxy({}, {
    get: (_, method) =>
      method === "addFilter"
        ? (name, fn) => { if (name === "jsonScript") filter = fn; }
        : () => {},
  });
  config(fake);
  assert.ok(filter, "jsonScript filter is registered");
  const out = filter({ t: "</script><b>&" });
  assert.ok(!/[<>&]/.test(out));
  assert.equal(JSON.parse(out).t, "</script><b>&");
});

test("long unbroken identifiers wrap instead of overflowing small screens", async () => {
  const s = await buildSite();
  assert.match(s.read("assets/blog.css"), /main\{[^}]*overflow-wrap:break-word/);
});
