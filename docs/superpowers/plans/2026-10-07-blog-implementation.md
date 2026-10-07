# blog.bahadirsonmez.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch an English-only Eleventy blog at `https://blog.bahadirsonmez.com`, with a draft → promote → deploy workflow and a scheduled drafting routine.

**Architecture:** Eleventy 3 (ESM) builds markdown posts from `src/posts/` into `_site/`; GitHub Actions runs the tests, builds, and deploys to GitHub Pages. Drafts live outside `src/` (`drafts/`) and reach the site only through `scripts/promote.js`. Tests are `node:test` files that build the site programmatically into a temp directory (optionally with extra fixture posts) and assert on the generated files.

**Tech Stack:** Node 22, `@11ty/eleventy` (v3), `@11ty/eleventy-plugin-rss`, `@11ty/eleventy-plugin-syntaxhighlight`, Nunjucks templates, plain CSS, `node:test`, GitHub Actions + Pages, `gh` CLI.

**Spec:** `docs/superpowers/specs/2026-10-07-blog-design.md`

## Global Constraints

- Working directory: `/Users/bahadirsonmez/Desktop/bahadirsonmez-websites/blog-site` (local git repo on `main` already exists with two spec commits).
- Site language English only; `<html lang="en">`.
- Production URL `https://blog.bahadirsonmez.com`; main site `https://bahadirsonmez.com`; GitHub account `bahadirsonmez`; repo `blog-site`, **public**.
- Visual identity from the main site: theme color `#160572`, fonts Fraunces (headings) + Inter (body) loaded from Google Fonts, same CSS tokens (`--indigo:#160572; --cream:#f2ebe6; --slate:#2c2c2c; --serif; --sans`). The main site has no dark mode, so the blog is **light theme only**.
- Cloudflare Web Analytics beacon token: `661cc751be2d43f98143d39de57e5410` on every page, using `<script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "…"}'></script>`.
- Post URL pattern: `/posts/<slug>/` where `<slug>` is the file name without the `YYYY-MM-DD-` prefix. Tag URL: `/tags/<tag>/`.
- Only posts with frontmatter `status: ready` are published. Drafts never live under `src/`.
- No paid services; no comments, newsletter, search, extra analytics, per-post share images, or social API automation.
- Commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Never push to the main-site repo or enforce HTTPS without the owner's go-ahead (Tasks 8 and 9 mark these gates).

## Review Focus

Failure modes the spec implies; each has a pinning test in the owning task.

1. **Empty site (zero posts):** home, feed, sitemap and tag index still build; feed is valid XML. (Task 4)
2. **Special characters:** a title with `&`, `<`, quotes and `ı`/`ö` renders escaped in HTML, meta tags, JSON-LD (no `</script>` break-out) and RSS. (Tasks 3, 4)
3. **A post with `status: draft` inside `src/posts/`** must not be published, not listed, not in feed/sitemap. (Task 3)
4. **Unknown or missing `cta_app`:** no CTA block, no build error. (Task 3)
5. **Promoting a draft that still has `[BAHADIR:` markers** is refused and leaves the file untouched; promoting a good draft strips the notes/social sections. (Task 7)

## File Structure

```
blog-site/
├── CNAME                         # blog.bahadirsonmez.com
├── package.json, .gitignore
├── eleventy.config.js            # plugins, filters, collections, passthrough
├── .github/workflows/pages.yml
├── src/
│   ├── _data/site.js             # site constants
│   ├── _data/apps.js             # cta_app → {name,url,blurb}
│   ├── _includes/base.njk        # <head>, header, footer, beacon
│   ├── _includes/post.njk        # post layout (extends base)
│   ├── assets/blog.css, favicon.svg, social-preview.png
│   ├── posts/posts.json          # directory data: layout, permalink, tags
│   ├── index.njk, tags.njk, feed.njk, sitemap.njk, robots.njk, 404.md
├── scripts/promote.js
├── drafts/ (TEMPLATE.md, .gitkeep)
├── test/ (helpers.js, *.test.js)
├── topics.md, topics-backlog.md, ROUTINE.md
└── docs/superpowers/{specs,plans}/
```

---

### Task 1: Scaffold and test harness

**Files:**
- Create: `package.json`, `.gitignore`, `eleventy.config.js`, `CNAME`, `src/index.njk` (placeholder `<h1>Blog</h1>`), `test/helpers.js`, `test/build.test.js`

**Interfaces:**
- Produces (`test/helpers.js`): `buildSite(extraPosts?: Record<string,string>): Promise<{ outDir: string, read(rel: string): string, exists(rel: string): boolean }>` — copies `src/` to a temp dir, writes each `extraPosts` entry (key = file name, value = full markdown) into `<tmp>/posts/`, runs Eleventy programmatically with that input and a temp output dir, returns helpers rooted at the output dir.
- Produces (`eleventy.config.js`): default export config function; `dir.input = "src"`, `dir.output = "_site"`; passthrough of `CNAME`→`CNAME` and `src/assets`→`assets`. `package.json` scripts: `build` = `eleventy`, `test` = `node --test test/`.

- [ ] **Step 1: Write `test/build.test.js`** with one test `"build emits index.html and CNAME"`: `const s = await buildSite(); assert.ok(s.exists("index.html")); assert.equal(s.read("CNAME").trim(), "blog.bahadirsonmez.com")`.
- [ ] **Step 2: Run `npm test`** — Expected: FAIL (no package.json / helpers).
- [ ] **Step 3: Create `package.json`** (`"type": "module"`, scripts above, `engines.node >=22`), run `npm install -D @11ty/eleventy @11ty/eleventy-plugin-rss @11ty/eleventy-plugin-syntaxhighlight`; write `.gitignore` (`node_modules`, `_site`), `CNAME`, `eleventy.config.js`, placeholder `src/index.njk`, and `test/helpers.js` per the interface.
- [ ] **Step 4: Run `npm test`** — Expected: PASS (1 test).
- [ ] **Step 5: Commit** `git add -A && git commit -m "chore: scaffold Eleventy and build test harness"`.

---

### Task 2: Base layout, styling, SEO head, beacon

**Files:**
- Create: `src/_data/site.js`, `src/_includes/base.njk`, `src/assets/blog.css`, `src/assets/favicon.svg` (copy from main site `assets/favicon.svg`), `src/assets/social-preview.png` (copy from main site `assets/social-preview.png`), `test/base.test.js`
- Modify: `src/index.njk` (use `layout: base.njk`), `eleventy.config.js` (add syntaxhighlight plugin; passthrough Prism theme from `node_modules/prismjs/themes/prism.css` → `assets/prism.css`)

**Interfaces:**
- Produces `src/_data/site.js` default export: `{ name: "Bahadır Sönmez", blogName: "Bahadır Sönmez — Blog", url: "https://blog.bahadirsonmez.com", mainUrl: "https://bahadirsonmez.com", beaconToken: "661cc751be2d43f98143d39de57e5410", description: <one sentence about Apple development, the Apple ecosystem and AI>, author: "Bahadır Sönmez", linkedin: "https://www.linkedin.com/in/bahadir-sonmez", github: "https://github.com/bahadirsonmez" }`.
- Produces `base.njk` layout. Page data it reads: `title` (optional on home), `description` (falls back to `site.description`), `ogType` (default `website`), `jsonLd` (optional pre-serialized string), `page.url`. Blocks: `{{ content | safe }}`.
- Produces filter `jsonScript(obj): string` in the config — `JSON.stringify` with `<`, `>`, `&` escaped as `<`, `>`, `&`.

- [ ] **Step 1: Write `test/base.test.js`** with tests on `index.html` from `buildSite()`: `"has lang en, canonical, og and twitter tags"` (canonical `https://blog.bahadirsonmez.com/`, `og:site_name`, `twitter:card` = `summary_large_image`, `og:image` = `https://blog.bahadirsonmez.com/assets/social-preview.png`); `"includes Cloudflare beacon token"` (contains `661cc751be2d43f98143d39de57e5410` and `static.cloudflareinsights.com/beacon.min.js`); `"header links to main site apps"` (contains `href="https://bahadirsonmez.com/#apps"` and `href="https://bahadirsonmez.com/"`); `"loads Fraunces and Inter"`; and a unit test on `jsonScript` asserting `jsonScript({t:"</script><b>&"})` contains no raw `<`, `>` or `&`.
- [ ] **Step 2: Run `npm test`** — Expected: FAIL on the new tests.
- [ ] **Step 3: Implement** `site.js`, `base.njk` (header: wordmark "Bahadır**Sönmez**" → `mainUrl`, nav: Blog `/`, Apps → `mainUrl/#apps`, About → `mainUrl/#about`; footer: link to main site, LinkedIn, GitHub, RSS `/feed.xml`; `<link rel="alternate" type="application/rss+xml" href="/feed.xml">`; skip link; `<meta name="theme-color" content="#160572">`), `blog.css` (single reading column ≈ 680px, tokens from Global Constraints, mobile-first, no horizontal scroll at 375px), the `jsonScript` filter and plugin wiring.
- [ ] **Step 4: Run `npm test`** — Expected: PASS.
- [ ] **Step 5: Commit** `feat: base layout, SEO head and analytics beacon`.

---

### Task 3: Posts, post layout, CTA, draft guard

**Files:**
- Create: `src/posts/posts.json`, `src/_includes/post.njk`, `src/_data/apps.js`, `test/posts.test.js`
- Modify: `eleventy.config.js` (add `readingTime`, `humanDate`, `isoDate` filters and the `posts` collection)

**Interfaces:**
- Consumes: `base.njk`, `site`, `jsonScript` (Task 2); `buildSite(extraPosts)` (Task 1).
- Produces post frontmatter contract: `title` (string), `description` (string, optional → falls back to first 160 chars of plain text, never empty), `date` (YYYY-MM-DD), `tags` (array of strings), `status` (`"draft"` | `"ready"`), `cta_app` (`"ikeep"` | `"bubbles"` | `"ballance"` | `"healthbar"`, optional).
- Produces `posts.json`: `layout: post.njk`, `permalink` computed as `/posts/{{ page.fileSlug }}/` only when `status == "ready"`, otherwise `false`; `tags` collection key `posts` added by the config's `posts` collection (published, `status == ready`, sorted newest first).
- Produces `apps.js` default export `{ ikeep: {name, url, blurb}, bubbles: {...}, ballance: {...}, healthbar: {...} }` with `url` = the app's site (`https://ikeep.bahadirsonmez.com/`, etc.) and `blurb` = the one-line card text from the main site's `index.html`.
- Produces filters: `readingTime(html: string): number` (minutes, `ceil(words/220)`, minimum 1), `humanDate(d: Date): string` (e.g. `7 October 2026`), `isoDate(d: Date): string` (`YYYY-MM-DD`).

- [ ] **Step 1: Write `test/posts.test.js`** using fixtures built inline:
  - `"ready post renders at /posts/<slug>/"`: fixture `2026-10-12-hello.md` (status ready, tags `[apple-dev]`, cta_app `healthbar`, ~500 words) → `posts/hello/index.html` exists; has `<h1>` title, reading time text, `BlogPosting` JSON-LD with `headline`, `datePublished` `2026-10-12`, `author.name`, `mainEntityOfPage`; has CTA linking to `https://healthbar.bahadirsonmez.com/`; has author box linking `https://bahadirsonmez.com/`; `og:type` is `article`.
  - `"draft status in src/posts is not published"` (Review Focus 3): `status: draft` fixture → `posts/<slug>/index.html` does not exist.
  - `"special characters are escaped"` (Review Focus 2): title `Q&A: <b>"Swift" & Bahadır's ıö</b>` → `<title>` contains `&amp;` and no raw `<b>`; JSON-LD block contains no raw `</script>` besides its closing tag (count of `</script>` inside the JSON block is 0).
  - `"unknown or missing cta_app renders no CTA and does not fail"` (Review Focus 4): fixtures with `cta_app: nope` and with none → build succeeds; output has no element with class `cta`.
  - `"missing description falls back"`: output `<meta name="description" content="…">` is non-empty and ≤ 160 chars.
  - `readingTime` unit tests: 0 words → 1; 440 words → 2; 441 words → 3.
- [ ] **Step 2: Run `npm test`** — Expected: FAIL.
- [ ] **Step 3: Implement** the filters, collection, `posts.json`, `apps.js`, and `post.njk` (extends `base.njk` data: `ogType: article`, `jsonLd` built per post; body in `<article>`; CTA block `<aside class="cta">` only if `apps[cta_app]`; author box).
- [ ] **Step 4: Run `npm test`** — Expected: PASS.
- [ ] **Step 5: Commit** `feat: post layout, CTA and draft guard`.

---

### Task 4: Home, tags, feed, sitemap, robots, 404

**Files:**
- Create: `src/index.njk` (replace placeholder), `src/tags.njk`, `src/feed.njk`, `src/sitemap.njk`, `src/robots.njk`, `src/404.md`, `test/listing.test.js`

**Interfaces:**
- Consumes: `collections.posts` (Task 3), `site`, filters from Tasks 2–3, `@11ty/eleventy-plugin-rss` filters (`dateToRfc822`, `absoluteUrl`).
- Produces: `index.html` (list: title link, date, summary, tags; `Blog` JSON-LD with `publisher` = main-site Person `https://bahadirsonmez.com/#person`), `tags/<tag>/index.html` per tag used by published posts (excluding the internal `posts` tag), `feed.xml` (RSS 2.0), `sitemap.xml`, `robots.txt` (`User-agent: *`, `Allow: /`, `Sitemap: https://blog.bahadirsonmez.com/sitemap.xml`), `404.html`.

- [ ] **Step 1: Write `test/listing.test.js`:**
  - `"empty site builds"` (Review Focus 1): `buildSite()` with no posts → `index.html`, `feed.xml`, `sitemap.xml`, `robots.txt`, `404.html` exist; `feed.xml` starts with `<?xml` and contains `<channel>` and no `<item>`; sitemap lists `https://blog.bahadirsonmez.com/`.
  - With two ready fixtures (different tags, different dates): home lists newest first; `tags/apple-dev/index.html` exists and lists only matching posts; no `tags/posts/`; `feed.xml` has two `<item>` with absolute `<link>` URLs and the special-character title is XML-escaped (no raw `&` outside entities); `sitemap.xml` contains both post URLs and tag URLs but not a draft fixture's URL; `robots.txt` contains the sitemap line.
  - `"home has Blog JSON-LD referencing the main-site person"`.
- [ ] **Step 2: Run `npm test`** — Expected: FAIL.
- [ ] **Step 3: Implement** the templates. Tag pages use Eleventy pagination over a tag list derived from `collections.posts`; feed lists the latest 20 posts.
- [ ] **Step 4: Run `npm test`** — Expected: PASS. Run `npm run build` and open `_site/index.html` in a browser at 375px width to confirm no horizontal scroll.
- [ ] **Step 5: Commit** `feat: home, tag pages, feed, sitemap, robots, 404`.

---

### Task 5: Deployment pipeline and GitHub repo

**Files:**
- Create: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: `npm test`, `npm run build` (Task 1), `_site/CNAME` (Task 1).
- Produces: public repo `bahadirsonmez/blog-site` with Pages source = GitHub Actions and custom domain `blog.bahadirsonmez.com`.

- [ ] **Step 1: Write `pages.yml`:** triggers `push` to `main` and `workflow_dispatch`; permissions `contents: read`, `pages: write`, `id-token: write`; job `build` runs checkout, `actions/setup-node` (Node 22, npm cache), `npm ci`, `npm test`, `npm run build`, `actions/upload-pages-artifact` with `path: _site`; job `deploy` needs `build`, uses `actions/deploy-pages` with environment `github-pages`.
- [ ] **Step 2: Ask the owner for a go-ahead** to create the public repo and push (outward-facing). On yes: `gh repo create bahadirsonmez/blog-site --public --source=. --remote=origin --description "Blog at blog.bahadirsonmez.com"`.
- [ ] **Step 3: Enable Pages from Actions:** `gh api -X POST repos/bahadirsonmez/blog-site/pages -f build_type=workflow`; set the custom domain: `gh api -X PUT repos/bahadirsonmez/blog-site/pages -f cname=blog.bahadirsonmez.com`.
- [ ] **Step 4: Push** `git push -u origin main`; watch the run: `gh run watch`. Expected: both jobs succeed.
- [ ] **Step 5: Verify** the Pages site URL from `gh api repos/bahadirsonmez/blog-site/pages --jq .html_url` responds `200` via `curl -sI`. (The custom domain will not resolve until Task 9's DNS step.)
- [ ] **Step 6: Commit** (if anything changed) `ci: deploy to GitHub Pages`.

---

### Task 6: Draft template and tracking files

**Files:**
- Create: `drafts/TEMPLATE.md`, `drafts/.gitkeep`, `topics.md`, `topics-backlog.md`

**Interfaces:**
- Produces the draft format used by Tasks 7 and 8. File name `drafts/YYYY-MM-DD-<slug>.md` where the date is the **publish date**. Required shape:
  - frontmatter: `title`, `description`, `date`, `tags`, `status: draft`, `cta_app` (optional)
  - `## Why this topic` — note for the owner (removed on promote)
  - the post body (any headings except the reserved ones below)
  - `## Sources` — kept on the published post
  - `## LinkedIn` and `## X` — removed on promote and printed for the owner. LinkedIn/X links use `https://blog.bahadirsonmez.com/posts/<slug>/?utm_source=<linkedin|x>&utm_medium=social&utm_campaign=<slug>`.
- Produces `topics.md`: a table with columns `Week (Mon date) | Draft date | Slug | Trigger (news/backlog) | Status (drafted/published/skipped)`; one row appended per routine run that drafts or skips. `topics-backlog.md`: markdown checklist of evergreen topics, seeded with 10 entries across SwiftUI tips, Swift Concurrency, HealthKit, App Store/ASO, and Apple + AI integration.

- [ ] **Step 1:** Create the four files per the interface; `TEMPLATE.md` contains every section with one-line instructions and includes one `[BAHADIR: …]` marker example.
- [ ] **Step 2:** Verify the template is not published: `npm run build` and confirm `_site` has no `posts/` entry for it (drafts are outside `src/`).
- [ ] **Step 3: Commit** `docs: draft template and topic tracking files`.

---

### Task 7: Promote script

**Files:**
- Create: `scripts/promote.js`, `test/promote.test.js`

**Interfaces:**
- Produces CLI: `node scripts/promote.js <draft-path>`; and exported function `promote(draftPath: string, opts?: { srcPostsDir?: string, archiveDir?: string }): { postPath: string, archivePath: string, social: { linkedin: string, x: string } }`.
- Behavior: refuses (throws / exits 1 with a message listing line numbers) if the file contains `[BAHADIR:`; refuses if `status` is not `draft`, or `title`/`description`/`date`/`tags` is missing. On success: sets `status: ready`; writes the post (frontmatter + body minus the sections `## Why this topic`, `## LinkedIn`, `## X`) to `<srcPostsDir>/<file name>` (default `src/posts`); moves the full original (social included) to `<archiveDir>/<file name>` (default `drafts/published`); prints the LinkedIn and X text to stdout.

- [ ] **Step 1: Write `test/promote.test.js`** against temp directories:
  - `"refuses drafts with [BAHADIR: markers"` (Review Focus 5): throws; the draft file still exists; no file in the posts dir.
  - `"promotes a clean draft"`: post file exists with `status: ready`; contains `## Sources`; does not contain `## Why this topic`, `## LinkedIn`, `## X`; archive file contains the LinkedIn text; returned `social.linkedin` and `social.x` equal the section bodies.
  - `"refuses non-draft or incomplete frontmatter"`: status `ready` → throws; missing `tags` → throws.
  - `"refuses to overwrite an existing post"`: same file name already in posts dir → throws.
- [ ] **Step 2: Run `npm test`** — Expected: FAIL.
- [ ] **Step 3: Implement** `promote` and the CLI wrapper. Parse frontmatter with the `gray-matter` package (`npm install -D gray-matter`; it ships with Eleventy's dependency tree, but declare it explicitly).
- [ ] **Step 4: Run `npm test`** — Expected: PASS.
- [ ] **Step 5: Commit** `feat: draft promote script`.

---

### Task 8: Drafting routine

**Files:**
- Create: `ROUTINE.md`

**Interfaces:**
- Consumes: the draft format and tracking files (Task 6).
- Produces: the scheduled task `blog-drafting` that runs Mon–Thu at 09:00 (the Mac's local time zone) with the prompt "Follow `/Users/bahadirsonmez/Desktop/bahadirsonmez-websites/blog-site/ROUTINE.md` exactly."

- [ ] **Step 1: Write `ROUTINE.md`** from spec section 6 verbatim in substance: the weekly decision flow (cap 2 per Mon–Sun week from `topics.md`; news-first; Wednesday fallback if 0 drafts; Thursday fallback if < 2; Monday/Tuesday news only), the "important news" definition, the writing rules (700–1200 words, sourcing, no invented personal experience, `[BAHADIR: …]` markers, why-note, LinkedIn 120–180 words, X ≤ 280 characters incl. link, UTM links), publish date = run date + 1 day (Friday never; if + 1 lands on a weekend, it cannot happen because runs are Mon–Thu), duplicate check against `topics.md`, and the safety rules (write only to `drafts/`, `topics.md`, `topics-backlog.md`; never push or deploy; always append a `topics.md` row, including for skips).
- [ ] **Step 2: Dry run once manually:** execute the ROUTINE as a normal task in this session for the current date; confirm it produces a draft (or a documented skip) and a `topics.md` row, and that `npm test` still passes with the draft present. Show the owner the dry-run draft.
- [ ] **Step 3: Confirm the schedule with the owner** (cron `0 9 * * 1-4`, **the Mac's local time zone**) — the owner's site lists Berlin; the spec's publish time is 15:00 Turkey time (14:00 in Berlin). Ask which clock "09:00" means before creating the task.
- [ ] **Step 4: Create the scheduled task** with `mcp__scheduled-tasks__create_scheduled_task`, name `blog-drafting`, using the prompt and cron above; list tasks to confirm it exists and note the next run time.
- [ ] **Step 5: Commit** `docs: drafting routine`.

---

### Task 9: Main-site integration and launch

**Files:**
- Modify (repo `bahadirsonmez.github.io`, separate commit): `index.html` — add a `Blog` link to the primary nav (`<a href="https://blog.bahadirsonmez.com/">Blog</a>`, placed after `About`), add a `Blog` node to the JSON-LD `@graph` (`{"@type":"Blog","@id":"https://blog.bahadirsonmez.com/#blog","url":"https://blog.bahadirsonmez.com/","name":"Bahadır Sönmez — Blog","inLanguage":"en","publisher":{"@id":"https://bahadirsonmez.com/#person"}}`) and add `{"@id":"https://blog.bahadirsonmez.com/#blog"}` to the Person's `subjectOf` array.

- [ ] **Step 1: Owner action — DNS.** Give the owner the exact record to add at checkdomain.de: type `CNAME`, host `blog`, value `bahadirsonmez.github.io`. Wait for the owner's "done".
- [ ] **Step 2: Verify DNS:** `dig +short CNAME blog.bahadirsonmez.com` returns `bahadirsonmez.github.io.`. If not, wait and retry (propagation can take minutes to hours).
- [ ] **Step 3: Enforce HTTPS** once GitHub has issued the certificate (`gh api repos/bahadirsonmez/blog-site/pages --jq .https_enforced`; then `gh api -X PUT repos/bahadirsonmez/blog-site/pages -F https_enforced=true`).
- [ ] **Step 4: Verify live:** `curl -sI https://blog.bahadirsonmez.com/` returns `200`; `curl -s https://blog.bahadirsonmez.com/ | grep -c 661cc751be2d43f98143d39de57e5410` returns `1`; `/feed.xml`, `/sitemap.xml`, `/robots.txt` return `200`.
- [ ] **Step 5: Main-site edit** in `bahadirsonmez.github.io` per Files above; validate the JSON-LD still parses (`node -e` extracting and `JSON.parse`-ing the script block). **Ask the owner for a go-ahead before pushing** (public site); on yes commit and push, and verify the nav link at `https://bahadirsonmez.com/`.
- [ ] **Step 5b:** Add `https://blog.bahadirsonmez.com/` to the main site's `sitemap.xml` only if the owner wants it; the blog serves its own sitemap, so by default skip.
- [ ] **Step 6: Search Console:** with the owner signed in and approving, submit `https://blog.bahadirsonmez.com/sitemap.xml` in the `sc-domain:bahadirsonmez.com` property (Sitemaps → add). Confirm status "Success".
- [ ] **Step 7: Cloudflare:** after visiting the live blog once, confirm the `blog.bahadirsonmez.com` site shows page views in Web Analytics.
- [ ] **Step 8: Update the spec's status** to "Implemented", commit `docs: mark spec implemented`.
