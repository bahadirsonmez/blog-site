---
title: "How a CDN serves files from a server near you"
description: "A CDN keeps copies of files on servers close to visitors. A fresh copy is answered at once, and a missing one is fetched from the origin server first."
date: 2026-11-06
tags: [how-it-works, web]
status: draft
---

## Why this topic

Next unchecked item in the series, after caching (How a cache makes things faster) and DNS (How DNS works). It answers "why does a site load fast from far away?". Sources: the MDN CDN glossary entry (copies on servers spread across many places, the closest one answers, distance adds delay, the costs), RFC 9111 (a fresh stored response is reused without asking the origin; with no stored response the request goes to the origin; a stale one is checked first) and the MDN HTTP caching guide (CDNs follow `Cache-Control` and can offer purging). Simplified on purpose: real CDNs also do health checks, several cache layers and load balancing, and how a visitor is sent to the nearby server differs between CDNs (DNS answers that depend on location and anycast are two examples, so the post only says the method varies and names neither); the terms "edge" and "PoP" are left out.

<!-- end why -->

A CDN (content delivery network) is a group of servers in many places, each keeping copies of your files. The idea to keep: most requests are answered by a copy close to the visitor, and the original server is asked only when the copy is missing.

## The short version

Distance adds delay, so a copy that sits near the visitor is faster than a trip to the original server, called the origin. If the nearby server holds a fresh copy, it answers at once. If it does not, it asks the origin, keeps the reply and uses it for the visitors who come next.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 210" width="640" height="210" role="img" aria-labelledby="t-cdn d-cdn" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-cdn">How a CDN answers a request</title>
<desc id="d-cdn">The browser asks a nearby CDN server. If the server has a fresh copy it answers the browser at once. If it has none, it asks the origin server, the origin replies, and the CDN server keeps the copy and answers.</desc>
<defs><marker id="cdn-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="50" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="87" text-anchor="middle" fill="#160572" font-weight="600">Browser</text>
<rect x="225" y="50" width="190" height="64" rx="10" fill="#160572"/>
<text x="320" y="87" text-anchor="middle" fill="#ffffff" font-weight="600">Nearby CDN server</text>
<rect x="470" y="50" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="87" text-anchor="middle" fill="#160572" font-weight="600">Origin server</text>
<line x1="172" y1="72" x2="223" y2="72" stroke="#2544a0" stroke-width="2" marker-end="url(#cdn-a)"/>
<text x="198" y="62" text-anchor="middle" fill="#2c2c2c" font-size="13">1 ask</text>
<line x1="417" y1="72" x2="468" y2="72" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cdn-a)"/>
<text x="443" y="62" text-anchor="middle" fill="#2c2c2c" font-size="13">2 miss</text>
<line x1="468" y1="98" x2="417" y2="98" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cdn-a)"/>
<text x="443" y="130" text-anchor="middle" fill="#2c2c2c" font-size="13">3 reply</text>
<path d="M320 116V170H95V118" fill="none" stroke="#2544a0" stroke-width="2" marker-end="url(#cdn-a)"/>
<text x="207" y="192" text-anchor="middle" fill="#2c2c2c" font-size="13">hit: fresh copy, answer at once</text>
</svg>
<figcaption>Simplified: a hit is answered by the nearby server, a miss goes to the origin first.</figcaption>
</figure>

## Step by step

1. The browser asks for a file.
2. The request is routed to a nearby CDN server; how that works depends on the CDN.
3. A fresh copy there is a hit, and it is sent back without asking the origin.
4. No copy, or a stale one, is a miss: the server asks the origin.
5. The reply is stored and passed on, and later requests reuse it.
6. A changed file shows up when the copy's `Cache-Control` time ends or the owner purges it.

| | Hit | Miss |
|---|---|---|
| Fresh copy nearby | yes | no |
| Origin asked | no | yes |

## Why it matters

Less distance and less work for the origin make pages load faster. The costs are a third party your site depends on, extra DNS lookups and connections, and a copy that can be out of date until it expires or is purged. Caching basics are in [How a cache makes things faster](https://blog.bahadirsonmez.com/posts/how-a-cache-makes-things-faster/).

## Sources

- [CDN — MDN Glossary](https://developer.mozilla.org/en-US/docs/Glossary/CDN) — servers in many places keep copies, the closest one answers, distance adds delay, the costs of using a CDN
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — a fresh stored response is reused without asking the origin (4.2), a miss goes to the origin (4.1), a stale response is checked first (4.3)
- [HTTP caching — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) — CDNs are managed caches controlled with `Cache-Control`, and some allow purging
