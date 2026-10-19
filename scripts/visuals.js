// Topic visuals in a post body (owner's rule 2026-10-19: every post carries at least one;
// a draft without one is not published). Used by scripts/promote.js and test/visuals.test.js.
//
// A visual is one of:
//   - an inline <svg> with a non-empty <title> (the diagrams in <figure class="diagram">),
//   - an <img> with non-empty alt text (usually <figure><img ...><figcaption>),
//   - a Markdown image ![alt](src) with non-empty alt text.
// Code fences and HTML comments are ignored. An image without alt text or an SVG without
// a title is reported as a problem, not counted.

// Published posts from before the rule that have no visual yet. Remove a slug once its post
// gets one (test/visuals.test.js fails until you do). Never add new posts here.
export const NO_VISUAL_LEGACY = new Set([]);

const stripIgnored = (md) =>
  md
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "");

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3]) : undefined;
};

export function findVisuals(markdown) {
  const md = stripIgnored(markdown);
  const visuals = [];
  const problems = [];

  for (const m of md.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
    const title = m[0].match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    if (title) visuals.push({ kind: "svg" });
    else problems.push("inline <svg> without a <title> (screen readers and the visual check need it)");
  }
  for (const m of md.matchAll(/<img\b[^>]*>/gi)) {
    const src = attr(m[0], "src") ?? "";
    if ((attr(m[0], "alt") ?? "").trim()) visuals.push({ kind: "img", src });
    else problems.push(`<img src="${src}"> without alt text`);
  }
  for (const m of md.matchAll(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?[^)]*\)/g)) {
    if (m[1].trim()) visuals.push({ kind: "img", src: m[2] });
    else problems.push(`Markdown image ${m[2]} without alt text`);
  }
  return { visuals, problems };
}
