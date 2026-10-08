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
  assert.match(html, /property="og:image" content="https:\/\/blog\.bahadirsonmez\.com\/assets\/social-preview\.png"/);
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
