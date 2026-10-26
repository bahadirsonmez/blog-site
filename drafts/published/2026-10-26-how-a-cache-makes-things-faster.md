---
title: "How a cache makes things faster"
description: "A cache keeps a copy of an earlier answer close by. In HTTP, a fresh copy is reused as is, and a stale one is checked with a small 304 reply."
date: 2026-10-26
tags: [how-it-works, web]
status: draft
---

## Why this topic

Answers "what does a cache actually do". Claims rest on MDN's HTTP caching guide (fresh and stale responses, ETag revalidation, the one-week max-age example) and on RFC 9111 (cache purpose, freshness, conditional requests and 304). Simplified on purpose: only the browser's HTTP cache is shown. CPU caches, eviction rules such as LRU, shared caches, Vary and no-cache/no-store are left out.

<!-- end why -->

A cache keeps a copy of an earlier answer close by, so the next request does not start from scratch. The idea to keep: reuse the copy while it is fresh, and check it cheaply once it is not.

## The short version

A browser cache is the example here. It stores a response and reuses it for later requests to the same URL. The server says how long the copy counts as fresh, for instance with `Cache-Control: max-age=604800`, which is one week. While the copy is younger than that, the browser answers from its own storage and the server is not asked. After that the copy is stale, but it is not thrown away: the browser can check it with the server first.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270" width="640" height="270" role="img" aria-labelledby="t-cache d-cache" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-cache">How a cache answers a request</title>
<desc id="d-cache">A request reaches the cache. If the stored copy is fresh, it is reused. If it is stale, the cache asks the server. A 304 reply means keep the copy, and a 200 reply brings a new copy.</desc>
<defs><marker id="cache-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="10" y="30" width="160" height="60" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="90" y="66" text-anchor="middle" fill="#160572" font-weight="600">Request</text>
<rect x="240" y="30" width="160" height="60" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="56" text-anchor="middle" fill="#160572" font-weight="600">Copy still fresh?</text>
<text x="320" y="76" text-anchor="middle" fill="#2c2c2c" font-size="13">age below max-age</text>
<rect x="470" y="30" width="160" height="60" rx="10" fill="#160572"/>
<text x="550" y="66" text-anchor="middle" fill="#ffffff" font-weight="600">Reuse the copy</text>
<rect x="240" y="170" width="160" height="60" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="196" text-anchor="middle" fill="#160572" font-weight="600">Stale: ask server</text>
<text x="320" y="216" text-anchor="middle" fill="#2c2c2c" font-size="13">If-None-Match + ETag</text>
<rect x="10" y="170" width="160" height="60" rx="10" fill="#160572"/>
<text x="90" y="206" text-anchor="middle" fill="#ffffff" font-weight="600">304: keep copy</text>
<rect x="470" y="170" width="160" height="60" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="550" y="206" text-anchor="middle" fill="#160572" font-weight="600">200: new copy</text>
<line x1="172" y1="60" x2="238" y2="60" stroke="#2544a0" stroke-width="2" marker-end="url(#cache-a)"/>
<line x1="402" y1="60" x2="468" y2="60" stroke="#2544a0" stroke-width="2" marker-end="url(#cache-a)"/>
<line x1="320" y1="92" x2="320" y2="168" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cache-a)"/>
<line x1="238" y1="200" x2="172" y2="200" stroke="#2544a0" stroke-width="2" marker-end="url(#cache-a)"/>
<line x1="402" y1="200" x2="468" y2="200" stroke="#2544a0" stroke-width="2" marker-end="url(#cache-a)"/>
<text x="205" y="50" text-anchor="middle" fill="#2c2c2c" font-size="13">1 ask</text>
<text x="435" y="50" text-anchor="middle" fill="#2c2c2c" font-size="13">2 yes</text>
<text x="332" y="136" fill="#2c2c2c" font-size="13">2 no</text>
<text x="205" y="190" text-anchor="middle" fill="#2c2c2c" font-size="13">3 same</text>
<text x="435" y="190" text-anchor="middle" fill="#2c2c2c" font-size="13">3 changed</text>
<text x="320" y="258" text-anchor="middle" fill="#2c2c2c" font-size="13">example: Cache-Control: max-age=604800 is one week</text>
</svg>
<figcaption>Simplified: only the browser's HTTP cache is shown.</figcaption>
</figure>

## Step by step

1. A request arrives and the cache looks for a stored copy. With no copy, the request goes to the server as usual.
2. If the copy is fresh, it is reused and the server is not contacted.
3. If it is stale, the cache asks the server, sending the copy's ETag in an `If-None-Match` header.
4. If nothing changed, the server replies `304 Not Modified` with no body, and the stored copy is reused.
5. If it changed, the server replies `200 OK` with the new version, which replaces the copy.

## Why it matters

Fewer full downloads mean faster pages and less work for the server. The trade-off is yours to pick with `max-age`: a longer lifetime saves more requests, but the copy can be out of date for longer.

## Sources

- [HTTP caching — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) — a cache stores a copy of a response and reuses it; fresh and stale by age; `max-age=604800` as one week; revalidation with ETag and `If-None-Match`; 304 versus 200
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — a cache reduces response time and bandwidth (section 1); freshness lifetime versus age (4.2); conditional requests and 304 (4.3)
