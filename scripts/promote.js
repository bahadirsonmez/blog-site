import matter from "gray-matter";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WHY_END = "<!-- end why -->";
const STRIPPED = new Set(["Why this topic", "LinkedIn", "X"]);
const REQUIRED = ["title", "description", "date", "tags"];

// Splits the body into [{ heading, lines }] on level-2 headings outside code fences.
function sections(body) {
  const out = [{ heading: null, lines: [] }];
  let fenced = false;
  for (const line of body.split("\n")) {
    if (/^```/.test(line)) fenced = !fenced;
    const m = !fenced && line.match(/^## (.+?)\s*$/);
    if (m) out.push({ heading: m[1], lines: [line] });
    else out.at(-1).lines.push(line);
  }
  return out;
}

const sectionText = (s) => s.lines.slice(1).join("\n").trim();

export function promote(draftPath, { srcPostsDir = "src/posts", archiveDir = "drafts/published" } = {}) {
  const original = readFileSync(draftPath, "utf8");

  const markerLines = original
    .split("\n")
    .flatMap((l, i) => (l.includes("[BAHADIR:") ? [i + 1] : []));
  if (markerLines.length) {
    throw new Error(`Unresolved [BAHADIR: ...] markers at line ${markerLines.join(", ")}`);
  }

  const parsed = matter(original);
  if (parsed.data.status !== "draft") {
    throw new Error(`Expected status: draft, found status: ${parsed.data.status}`);
  }
  for (const key of REQUIRED) {
    const v = parsed.data[key];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) {
      throw new Error(`Missing frontmatter field: ${key}`);
    }
  }

  const name = path.basename(draftPath);
  const postPath = path.join(srcPostsDir, name);
  const archivePath = path.join(archiveDir, name);
  if (existsSync(postPath)) throw new Error(`Post already exists: ${postPath}`);

  // The "Why this topic" note ends at WHY_END when present; text after it is post body.
  const parts = sections(parsed.content).flatMap((s) => {
    const end = s.heading === "Why this topic" ? s.lines.indexOf(WHY_END) : -1;
    return end === -1
      ? [s]
      : [{ ...s, lines: s.lines.slice(0, end) }, { heading: null, lines: s.lines.slice(end + 1) }];
  });
  const social = {
    linkedin: sectionText(parts.find((s) => s.heading === "LinkedIn") ?? { lines: [] }),
    x: sectionText(parts.find((s) => s.heading === "X") ?? { lines: [] }),
  };
  const body = parts
    .filter((s) => !STRIPPED.has(s.heading))
    .map((s) => s.lines.join("\n"))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const rawFrontmatter = parsed.matter.replace(/^status:\s*draft.*$/m, "status: ready").trim();

  mkdirSync(srcPostsDir, { recursive: true });
  mkdirSync(archiveDir, { recursive: true });
  writeFileSync(postPath, `---\n${rawFrontmatter}\n---\n\n${body}\n`);
  renameSync(draftPath, archivePath);
  return { postPath, archivePath, social };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const draft = process.argv[2];
    if (!draft) throw new Error("usage: node scripts/promote.js <draft-path>");
    const { postPath, archivePath, social } = promote(draft);
    console.log(`Promoted: ${postPath}\nArchived draft: ${archivePath}\n`);
    console.log(`--- LinkedIn ---\n${social.linkedin}\n\n--- X ---\n${social.x}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
