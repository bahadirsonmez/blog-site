import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSite, post } from "./helpers.js";

test("template-like sequences in a post body are rendered literally", async () => {
  const body = [
    "Inline `{{ user_name }}` and ${{ secrets.TOKEN }} stay.",
    "",
    "```yaml",
    "run: echo ${{ github.sha }}",
    "{% if x %}y{% endif %}",
    "{# not a comment #}",
    "```",
    "",
  ].join("\n");
  const md = post({ words: 0 }).replace(/\n\n\n$/, "\n\n" + body);
  const s = await buildSite({ "2026-10-18-literal.md": md });
  // Prism wraps code tokens in <span>s, so compare the visible text.
  const html = s.read("posts/literal/index.html").replace(/<[^>]+>/g, "");
  for (const text of ["{{ user_name }}", "{{ secrets.TOKEN }}", "{{ github.sha }}", "{% if x %}", "{# not a comment #}"]) {
    assert.ok(html.includes(text), `kept ${text}`);
  }
});
