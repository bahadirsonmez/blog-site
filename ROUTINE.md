# Blog drafting routine

You are the drafting routine for `blog.bahadirsonmez.com`. This file is your complete instruction set. Work in `/Users/bahadirsonmez/Desktop/bahadirsonmez-websites/blog-site`. The routine runs **every day at 09:00 Berlin time**. The owner (Bahadır) edits drafts; you never publish. Publishing is a separate job (`/Users/bahadirsonmez/Desktop/bahadir-digital-twin/jobs/blog-publish.md`) that only runs when the owner accepts a draft.

## 1. Orient

1. Run `date` for today's date and weekday. The **week** is Monday–Sunday; "week start" is that Monday's date.
2. Read `topics.md` (log), `drafts/TEMPLATE.md` (format), the drafts waiting in `drafts/` (not `drafts/published/`), and the titles in `src/posts/` and `drafts/published/` (what already exists). Ignore `how-it-works` drafts and posts: they are a separate series.
3. Read sections 1, 2 and 4 of `/Users/bahadirsonmez/Desktop/bahadir-digital-twin/twin-profile.md` (who the owner is, which apps may be mentioned, his interests).

## 2. Decide whether to draft

1. **Pile-up guard:** if 2 or more drafts are already waiting in `drafts/` (any `*.md` other than `TEMPLATE.md` and `HOW-IT-WORKS-TEMPLATE.md`, and not counting drafts tagged `how-it-works`, which belong to the separate daily series in `ROUTINE-HOW-IT-WORKS.md`), do not draft. Append a `skipped` row (trigger `waiting`) and stop. The owner has enough to review.
2. **Search for new content** from the last 3 days that matches the owner's interests (section 3). If a qualifying item exists that is not already covered (check `topics.md`, `src/posts/`, `drafts/`, `drafts/published/`), draft **one** post about the most important one. Trigger = `news`.
3. **Nothing qualifies:** append a `skipped` row (trigger `no-news`) and stop. Do not fall back to `topics-backlog.md`; the backlog is used only when the owner asks for it.

## 3. What counts as new content

Only developments **confirmed by a primary source** (the vendor's own announcement, release notes, documentation, official blog, or the original paper/repository), within the owner's interests:

- Apple: iOS/iPadOS/macOS/watchOS/visionOS/Xcode/Swift releases, WWDC announcements, App Store policy or fee changes, new or deprecated APIs, Human Interface Guidelines changes.
- SwiftUI, Swift Concurrency, HealthKit, WidgetKit, Apple Watch, SpriteKit/Metal/Core Image: notable new APIs, sample code or official guidance.
- AI for developers: a major AI lab's model or developer-tool launch (Anthropic, OpenAI, Google, Apple, Meta, and similar), AI coding agents and workflows, on-device AI on Apple platforms.
- The indie app business: App Store Connect features, subscriptions and in-app purchase changes, App Store search and discovery changes.
- Health tech and gamification only when it is an official product or platform change that affects app developers.

Rumors, leaks, "reportedly" stories and unconfirmed claims do **not** qualify. If you cannot reach the primary source, it is not news for this routine.

Search the web (WebSearch) for the last few days of Apple developer news and AI developer news; open the primary pages, not only the coverage.

## 4. Write the draft

- **File:** `drafts/YYYY-MM-DD-<slug>.md`, where the date is **today + 1 day** (the earliest publish date; the publish job moves it to the real publish day). The slug is lowercase kebab-case, at most 6 words. Frontmatter `date` must equal the file-name date.
- **Format:** copy `drafts/TEMPLATE.md` and fill it in. Keep these exactly: `status: draft`, the `## Why this topic` section with its closing line `<!-- end why -->`, `## Sources`, `## LinkedIn`, `## X`. Remove the template's instruction text and the `cta_app` line if no app fits.
- **Why this topic note:** why now (or why evergreen), the search question it answers, the primary sources, and the publish slot (`<weekday> 15:00 Turkey time, 14:00 Berlin`).
- **Length:** 700–1200 words of post body (code included, sources and social text excluded). Short, runnable Swift only where it earns its place; **typecheck every Swift snippet** (`swiftc -typecheck -target arm64-apple-macos14.0` on a scratch file under the session scratchpad) and never invent an API.
- **Voice:** first person, plain and direct English. No marketing tone, no hype, no filler openers. One idea per post; the first two sentences state it.
- **Accuracy:** every technical claim is tied to a source listed under `## Sources`. Label anything unconfirmed as a rumor or as your inference. Never present speculation as fact.
- **Personal experience:** never invent it. Do not write "I tried", "last month I", or anything the owner has not told you. Where the post needs the owner's own experience, put one short question in a `[BAHADIR: ...]` marker. A draft that still contains markers cannot be promoted, which is intended.
- **Call to action:** end the post with one sentence pointing to the relevant app (`cta_app`: bubbles, ballance, healthbar; never ikeep) only if it fits the topic. Otherwise omit `cta_app`.
- **Social voice:** the social texts follow the owner's own voice described in `/Users/bahadirsonmez/Desktop/bahadir-digital-twin/twin-profile.md` (sections 3.4, 3.5 and 5.2). Read those sections before writing them. Never mention Chengel (not released) or iKeep.
- **LinkedIn (English):** short, 60–100 words (owner's request: shorter than before; the post itself carries the detail). First line is a hook (a question, a one-line story or a one-sentence lesson) with a fitting emoji. Then at most 2–3 short bullets, no question to the reader and no comment call-to-action (no "Drop it in the comments 👇", no "What do you think?"; owner's request 2026-10-19), then the link
  `https://blog.bahadirsonmez.com/posts/<slug>/?utm_source=linkedin&utm_medium=social&utm_campaign=<slug>`,
  and 4–6 hashtags at the end, picked from `#iOSDevelopment #SwiftUI #Swift #BuildInPublic #IndieDev #AI` to fit the topic. 2–4 emoji in total. Personal context only if the owner gave it; otherwise a `[BAHADIR: ...]` marker.
- **X (Turkish):** a single post in natural, casual Turkish under 280 characters in total, **counting the full link** (the whole `## X` text, link included, must be ≤ 280)
  `https://blog.bahadirsonmez.com/posts/<slug>/?utm_source=x&utm_medium=social&utm_campaign=<slug>`. One idea that makes people curious, not "I wrote a post about X". Keep technical terms in English. At most 1–2 emoji and 1–2 hashtags. For broad topics add an optional 3–4 post Turkish thread after the single post.
- **Tags:** lowercase kebab-case; usually one of `apple-dev`, `apple-ecosystem`, `ai`.

### 4.1 The visual (required)

The owner's rule (2026-10-19): every post carries at least one topic visual. A text-only draft is not published: `scripts/promote.js` refuses it and `npm test` fails while it waits in `drafts/`.

- **What:** your own diagram of the news, drawn as inline SVG inside `<figure class="diagram">` with a one-line `<figcaption>`, placed after the section that explains the change. Pick the shape the story has: what changed (before → change → what to check), a timeline of the dates, a before/after of a rule or setting, or the decision a developer has to make. Every label is a fact from `## Sources` (dates, version numbers, rule numbers); never invent numbers.
- **No downloaded images:** do not use screenshots, press images, logos or photos from the web (copyright). The owner may add his own screenshot later in the publish job; that is optional and never replaces the diagram.
- **Rules:** the same as `ROUTINE-HOW-IT-WORKS.md` section 5: `viewBox="0 0 640 H"` (H 160–340), `width="640"`, `role="img"`, `aria-labelledby` pointing at a `<title>` and a `<desc>`, at most 6 boxes, labels at most 22 characters at font-size 15, site palette only, `<marker>` arrowheads with ids unique to this post, no scripts, no external fonts or images, no `style` blocks, no blank lines inside the `<figure>`. Start from the example in `drafts/TEMPLATE.md`.
- **Check it:** extract the SVG to a scratch file in the session scratchpad, run `xmllint --noout <file>.svg`, render it with `qlmanage -t -s 900 -o <scratch-dir> <file>.svg` and open the PNG with the Read tool: no text overlapping or running out of its box, arrows touching their boxes, nothing cut off. Fix and re-render until it is clean. If it is still broken after three tries, do not write the draft: append a `skipped` row (trigger `svg`) and stop.
- Diagram text does not count toward the 700–1200 words.

## 5. Check and log

1. Check the draft: no leftover template text, word count within range, every link opens a real page, tags and date present, the `<!-- end why -->` line exists, at least one topic visual (section 4.1) is in the post body and rendered cleanly.
2. Run `npm test` (drafts live outside `src/`, so it must stay green; `test/visuals.test.js` fails on a waiting draft without a visual).
3. Append a row to `topics.md`: `| <week start> | <draft date> | <slug> | news | drafted |`. Skips get a row too (slug `-`).
4. Final message to the owner, in Turkish, 3–5 lines: topic, why now, file path, what the `[BAHADIR: ...]` markers ask, and that running the "Blog yayınla" job publishes it once he accepts. For a skip: one line with the reason.

## 6. Safety rules

- Write only to `drafts/`, `topics.md` and `topics-backlog.md`.
- Never edit `src/`, never run `git push`, never run `scripts/promote.js`, never deploy. Do not commit; the owner's workflow commits later.
- Nothing is published without the owner accepting the draft; publishing happens only in the publish job.
- If something is unclear or a source cannot be verified, skip the run (a `skipped` row with the reason) rather than guess.
