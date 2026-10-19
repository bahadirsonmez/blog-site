// Per-post social card (1200x630 PNG): the post title on the blog's social-preview design
// (scripts/social-preview-2026-10.html). Rendered at build time by src/og.11ty.js.
import { readFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import opentype from "opentype.js";

const WIDTH = 1200;
const HEIGHT = 630;
const TITLE_WIDTH = 1040;

const font = (file) => readFileSync(new URL(`./fonts/${file}`, import.meta.url));
// Static instances of the site's fonts from Google Fonts (SIL OFL 1.1); Fraunces at SOFT 100, WONK 0.
const fonts = [
  { name: "Fraunces", data: font("Fraunces-Bold.ttf"), weight: 700, style: "normal" },
  { name: "Fraunces", data: font("Fraunces-SemiBoldItalic.ttf"), weight: 600, style: "italic" },
  { name: "Inter", data: font("Inter-SemiBold.ttf"), weight: 600, style: "normal" },
  { name: "Inter", data: font("Inter-Bold.ttf"), weight: 700, style: "normal" },
];

const C = {
  indigo: "#160572", white: "#fff", cobalt: "#2544a0", plum: "#4b0f4d",
  teal: "#24e3dc", crimson: "#ea0706", highlight: "#ff0",
};

// Title lines are measured with the real font so the size can be picked before Satori wraps.
const titleFont = opentype.parse(Uint8Array.from(fonts[0].data).buffer);
const TRACKING = -0.04;
const MEASURE_WIDTH = TITLE_WIDTH - 40;

const textWidth = (text, fontSize) =>
  titleFont.getAdvanceWidth(text, fontSize) + TRACKING * fontSize * [...text].length;

function countLines(title, fontSize) {
  let lines = 1;
  let line = "";
  for (const word of title.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && textWidth(next, fontSize) > MEASURE_WIDTH) {
      lines += 1;
      line = word;
    } else {
      line = next;
    }
  }
  return lines;
}

// Big type while the title fits on two lines, smaller type for three; four lines only at the floor.
const STEPS = [[84, 2], [76, 2], [68, 2], [64, 3], [58, 3], [52, 3]];

export function fitTitle(title) {
  for (const [fontSize, maxLines] of STEPS) {
    const lines = countLines(title, fontSize);
    if (lines <= maxLines) return { fontSize, lines };
  }
  const fontSize = STEPS.at(-1)[0];
  return { fontSize, lines: Math.min(4, countLines(title, fontSize)) };
}

const el = (type, style, children) => ({ type, props: { style, children } });

function card({ title, explainer }) {
  const { fontSize } = fitTitle(title);
  const label = explainer ? "How it works" : "Blog · Bahadır Sönmez";
  return el("div", {
    width: WIDTH, height: HEIGHT, display: "flex", position: "relative",
    backgroundColor: C.indigo, color: C.white, fontFamily: "Inter",
  }, [
    el("div", { position: "absolute", width: 380, height: 380, borderRadius: 190, backgroundColor: C.cobalt, left: -90, bottom: -130 }),
    el("div", { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: C.plum, right: 70, top: -60 }),
    el("div", {
      position: "absolute", left: 56, top: 44, display: "flex", flexDirection: "column",
      fontFamily: "Fraunces", fontStyle: "italic", fontWeight: 600, fontSize: 34, lineHeight: 0.9, letterSpacing: "-0.04em",
    }, [el("div", {}, "Bahadır"), el("div", { marginLeft: "1.1em" }, "Sönmez")]),
    el("div", {
      position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      width: WIDTH, height: HEIGHT,
    }, [
      el("div", {
        display: "flex", alignItems: "center", marginBottom: 32, padding: "7px 14px",
        backgroundColor: explainer ? C.teal : C.highlight, color: "#000",
        fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      }, [
        el("div", { width: 10, height: 10, borderRadius: 5, marginRight: 12, backgroundColor: explainer ? C.indigo : C.crimson }),
        el("div", {}, label),
      ]),
      el("div", {
        display: "block", maxWidth: TITLE_WIDTH, textAlign: "center", textWrap: "balance", lineClamp: 4,
        fontFamily: "Fraunces", fontWeight: 700, fontSize, lineHeight: 1.06, letterSpacing: `${TRACKING}em`,
      }, title),
    ]),
    el("div", {
      position: "absolute", right: 56, bottom: 44, fontSize: 20, fontWeight: 600,
      letterSpacing: "0.02em", color: "rgba(255,255,255,.9)",
    }, "blog.bahadirsonmez.com"),
  ]);
}

export async function renderOgImage({ title, explainer = false }) {
  const svg = await satori(card({ title, explainer }), { width: WIDTH, height: HEIGHT, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}
