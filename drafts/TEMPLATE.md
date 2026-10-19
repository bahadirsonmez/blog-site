---
title: "Post title (sentence case, under 70 characters)"
description: "One sentence for search results and link previews, under 160 characters."
date: 2026-01-01          # publish date (run date + 1 day); must match the file name prefix
tags: [apple-dev]         # lowercase-kebab; usual axes: apple-dev, apple-ecosystem, ai
status: draft
cta_app: healthbar        # optional: bubbles | ballance | healthbar (never ikeep or Chengel). Remove if it would feel forced.
---

## Why this topic

Owner-only note, removed on promote. Say why this topic matters this week (or why it is an evergreen pick), which search question it answers, and which sources the claims rest on. Keep the end marker below: everything after it is the post.

<!-- end why -->

Opening paragraph of the post. State the one idea of the post in the first two sentences.

## A section heading

Body text, 700–1200 words in total (diagram text not counted). First person, plain English, no hype. Every technical claim is tied to a source.

At least one topic visual is required (owner's rule 2026-10-19; `scripts/promote.js` and `npm test` refuse a draft without one). Draw the post's own diagram as inline SVG, following ROUTINE.md section 4.1: what changed, a timeline of dates, a before/after, or the decision the reader has to make. Replace the example labels below with the post's facts, each backed by `## Sources`. No downloaded screenshots or press images.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 192" width="640" height="192" role="img" aria-labelledby="t-news d-news" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-news">What changed and what you do about it</title>
<desc id="d-news">Three boxes from left to right: how it worked before, what the update changes, and the one thing to check in your own app.</desc>
<defs><marker id="news-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="60" width="170" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="92" text-anchor="middle" fill="#160572" font-weight="600">Before</text>
<text x="105" y="114" text-anchor="middle" fill="#2c2c2c" font-size="13">old behaviour</text>
<rect x="235" y="60" width="170" height="72" rx="10" fill="#160572"/>
<text x="320" y="92" text-anchor="middle" fill="#ffffff" font-weight="600">The change</text>
<text x="320" y="114" text-anchor="middle" fill="#ffffff" font-size="13">date, version</text>
<rect x="450" y="60" width="170" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="92" text-anchor="middle" fill="#160572" font-weight="600">What to check</text>
<text x="535" y="114" text-anchor="middle" fill="#2c2c2c" font-size="13">in your app</text>
<line x1="192" y1="96" x2="233" y2="96" stroke="#2544a0" stroke-width="2" marker-end="url(#news-a)"/>
<line x1="407" y1="96" x2="448" y2="96" stroke="#2544a0" stroke-width="2" marker-end="url(#news-a)"/>
</svg>
<figcaption>One line that explains how to read the diagram.</figcaption>
</figure>

```swift
// Short, runnable Swift only when it earns its place.
```

[BAHADIR: Where the post needs your own experience, ask one short question here. Remove every marker before the post can be promoted.]

## Sources

- [Source title](https://example.com) — what it supports

## LinkedIn

English, short: 60–100 words, in the owner's LinkedIn voice (twin-profile.md 3.4). Hook line with an emoji, at most 2–3 short bullets, no question to the reader and no comment call-to-action (owner's rule 2026-10-19), then the link and 3–5 hashtags:
https://blog.bahadirsonmez.com/posts/<slug>/?utm_source=linkedin&utm_medium=social&utm_campaign=<slug>
#iOSDevelopment #SwiftUI #BuildInPublic #IndieDev #AI

## X

Türkçe, link dahil 280 karakteri geçmeyen tek gönderi; 1–2 emoji, 1–2 hashtag:
https://blog.bahadirsonmez.com/posts/<slug>/?utm_source=x&utm_medium=social&utm_campaign=<slug>
