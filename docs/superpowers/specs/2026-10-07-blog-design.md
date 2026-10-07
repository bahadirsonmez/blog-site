# blog.bahadirsonmez.com — Design Spec

- **Date:** 2026-10-07
- **Owner / reviewer:** Bahadır Sönmez
- **Status:** Awaiting owner review

## 1. Purpose and success criteria

Launch an English-only blog at `https://blog.bahadirsonmez.com` to drive traffic to `https://bahadirsonmez.com` and the four app sites (iKeep, Bubbles, Ballance, HealthBar).

- Target cadence: **2 posts per week**.
- Each post is promoted with a short version on LinkedIn and X.
- Topics: Apple development, the Apple ecosystem, AI developments.
- **Success:** measurable click-through from blog to the main site and app pages (Cloudflare Web Analytics + UTM-tagged social links). Review topic axes after the first 8 weeks of data.

## 2. Decisions already made

| Topic | Decision |
|---|---|
| Language | English only |
| Authorship | Claude proposes topics and writes drafts; Bahadır edits; Claude publishes the post to the site |
| Social posting | Bahadır copies the LinkedIn/X text and posts manually. No social API integration |
| Draft location | Markdown files in the blog repo (`drafts/`) |
| Publishing | Bahadır says "ready" → Claude moves the post, commits, pushes → GitHub Actions deploys |
| Generator | Eleventy (11ty), free and open source |
| Hosting | GitHub Pages on a **public** repo (free), custom domain, free HTTPS |
| Analytics | Cloudflare Web Analytics, separate site/token for the blog (same pattern as the other five sites) |
| Cost | No paid services |

## 3. Repository

New repo `blog-site` (sibling of the other site repos, GitHub account `bahadirsonmez`, public).

```
blog-site/
├── CNAME                       # blog.bahadirsonmez.com
├── .eleventy.js
├── package.json
├── .github/workflows/pages.yml # build + deploy on push to main
├── src/
│   ├── _includes/              # base layout, post layout, header, footer, author box
│   ├── assets/                 # site CSS (derived from main site), fonts, favicon, share image
│   ├── posts/                  # published posts (markdown)
│   ├── tags/                   # generated tag pages
│   ├── index.njk               # blog home: latest posts
│   ├── feed.njk                # /feed.xml (RSS)
│   ├── sitemap.njk, robots.txt, 404.html
├── drafts/                     # drafts from the routine; excluded from the build
├── topics.md                   # log of drafted/published topics + weekly counts
├── topics-backlog.md           # default evergreen topic pool (owner-editable)
└── docs/superpowers/specs/     # this spec
```

Drafts live outside `src/`, so they can never be published by accident.

## 4. Site design

- **Visual identity:** same as the main site — theme color `#160572`, Fraunces headings, Inter body, light/dark behavior matching `bahadirsonmez.com`. Single reading column, generous line height, syntax-highlighted code (Swift-first).
- **Pages:** home (latest posts: title, date, summary, tags); post page (title, date, reading time, content, sources, CTA, author box); tag pages (e.g. `apple-dev`, `apple-ecosystem`, `ai`); `/feed.xml`; sitemap; `robots.txt`; 404.
- **Per-post metadata (automatic):** `<title>`, meta description, canonical URL, Open Graph, Twitter card. One shared share image initially; per-post images are out of scope.
- **Structured data:** `Blog` + `BlogPosting` JSON-LD on the blog; the main site's JSON-LD is updated to reference the blog so search engines associate it with the same person.

### Traffic funnel to the main site

- Persistent header link to `bahadirsonmez.com` and the app list.
- Per-post CTA at the end, chosen by topic relevance (e.g. HealthKit → HealthBar, security → iKeep). Omitted if it would feel forced.
- Author box linking to the main site and App Store pages.
- Social links use UTM parameters (`?utm_source=linkedin|x&utm_medium=social&utm_campaign=<slug>`).

### Analytics

Cloudflare Web Analytics beacon on every page. Token is a placeholder in the template until Bahadır creates the `blog.bahadirsonmez.com` site in the Cloudflare dashboard and provides the token.

### Out of scope (YAGNI)

Comments, newsletter, on-site search, per-post share images, other analytics, social API automation.

## 5. Content workflow

1. The routine writes `drafts/YYYY-MM-DD-slug.md` with `status: draft`.
2. Bahadır edits the draft and tells Claude it is ready.
3. Claude checks there are no `[BAHADIR: ...]` markers left, sets `status: ready`, moves the post to `src/posts/`, commits and pushes.
4. GitHub Actions builds and deploys. Bahadır posts the LinkedIn/X text himself at the scheduled time.

**Draft file format**

```
frontmatter: title, description, tags, status, cta_app
"Why this topic" note (not published)
Post body
Sources
## LinkedIn
## X
```

## 6. Routine (scheduled task)

- **Schedule:** Monday–Thursday, 09:00 Turkey time. No Friday or weekend runs.
- **Publish target:** draft day + 1 at 15:00 Turkey time (≈08:00 ET, 14:00 CEST). This gives Bahadır about 30 hours to review.
- **Weekly cap:** 2 drafts per week (Mon–Sun), tracked in `topics.md`.

**Decision flow per run**

1. Count this week's drafts. If 2 are already drafted, skip and leave a short note.
2. Search for **important news**. If found, draft it.
3. If no news, fall back to a default topic from `topics-backlog.md` only when needed to reach the cadence:
   - **Wednesday:** if there are 0 drafts this week.
   - **Thursday:** if there are fewer than 2 drafts this week.
   - **Monday/Tuesday:** news only; otherwise skip.

**"Important news" = primary-source-verified**: official Apple announcements (iOS/Xcode/Swift releases, WWDC, App Store policy, new APIs), major AI lab model or developer-tool launches, or changes that directly affect developers. Rumors and unconfirmed reports do not qualify.

**Default topic pool** (owner-editable): SwiftUI tips, Swift Concurrency, HealthKit, App Store/ASO, Apple + AI integration.

### Writing rules

- 700–1200 words; short, runnable Swift where code is needed.
- First person, plain and direct English; no marketing tone or hype.
- Every technical claim is tied to a source; sources are listed at the end. Rumors are labeled as rumors, never stated as fact.
- Claude does not invent personal experience. Where the author's experience is needed, the draft contains `[BAHADIR: <question>]` markers. A post with markers remaining is not "ready".
- Each draft opens with a short "why this topic / why now / what search question it answers" note.
- No repeated topics (checked against `topics.md`).
- **LinkedIn:** 120–180 words, strong first two lines, UTM blog link at the end.
- **X:** single post under 280 characters including link; optional 3–4 post thread for broader topics.

### Safety rules

- Nothing is published without the owner saying "ready."
- The routine only writes to `drafts/` and `topics.md`/`topics-backlog.md`; it never pushes or deploys.
- If a draft is not approved by the publish time, that post is skipped and the owner is told. Nothing is forced out.
- Known limitation: scheduled tasks run only while the Claude desktop app is open and the Mac is awake; otherwise the run is missed.

## 7. Setup and launch

| Step | Who |
|---|---|
| Create repo, scaffold Eleventy, templates, Actions workflow, `CNAME`; create GitHub repo and enable Pages | Claude |
| DNS: add `blog` CNAME → `bahadirsonmez.github.io` at **checkdomain.de** (current nameservers; requires login) | Bahadır (Claude provides exact values) |
| Cloudflare Web Analytics: create site for `blog.bahadirsonmez.com`, provide token | Bahadır (Claude can guide) |
| Google Search Console: the root domain already has a `google-site-verification` TXT record, so a Domain property likely covers `blog.`; submit `https://blog.bahadirsonmez.com/sitemap.xml` | Bahadır, with Claude guiding or driving the browser with explicit approval |
| Enable "Enforce HTTPS" after DNS propagates; verify the site | Claude (after DNS resolves) |
| Create the scheduled task | Claude, after the first post template is validated |
| Update the main site's JSON-LD and add a link to the blog | Claude (change in the main-site repo, committed separately) |

Account logins, passwords and tokens are never entered by Claude.

## 8. Testing / verification

- Local build passes; all pages generate without errors.
- Check internal links, RSS validity and sitemap contents; confirm drafts are excluded from the build output.
- Validate JSON-LD and meta tags on a sample post.
- After deploy: `https://blog.bahadirsonmez.com` resolves over HTTPS, canonical URLs are correct, the beacon loads.
- Dry-run the routine once manually before enabling the schedule.

## 9. Open items

- Blog analytics token (Bahadır, from Cloudflare).
- Confirm whether the Search Console property is a Domain property.
- First batch of backlog topics (Claude proposes, Bahadır edits).
