import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSite } from "./helpers.js";

test("build emits index.html and CNAME", async () => {
  const s = await buildSite();
  assert.ok(s.exists("index.html"));
  assert.equal(s.read("CNAME").trim(), "blog.bahadirsonmez.com");
});
