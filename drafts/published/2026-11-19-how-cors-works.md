---
title: "How CORS works"
description: "Browsers block a page from reading another origin's response. CORS headers are how a server says who may read it, with a preflight for riskier requests."
date: 2026-11-19
tags: [how-it-works, web]
status: draft
---

## Why this topic

Answers why a fetch to another site fails with a CORS error and what the server has to send. The claims rest on MDN's CORS guide (origins, the Origin header, simple and preflighted requests, preflight headers, Max-Age, credentials), MDN's Access-Control-Allow-Origin reference and MDN's preflight glossary entry. Simplified on purpose: Vary, Access-Control-Expose-Headers and the null origin are left out.

<!-- end why -->

CORS is how a server tells the browser that a page from another origin may read its responses. The idea to keep: the browser blocks that read by default, and the server's headers lift the block.

## The short version

An origin is a scheme, a domain and a port. A page's script can read responses from its own origin, and from another origin only if the server sends CORS headers that allow it. The browser adds an `Origin` header to cross-origin requests, and the server answers with `Access-Control-Allow-Origin`.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" width="640" height="240" role="img" aria-labelledby="t-cors d-cors" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-cors">The CORS preflight and the real request</title>
<desc id="d-cors">A page script on origin A calls fetch. The browser first sends an OPTIONS preflight to the server on origin B, and the server answers with allow headers. The browser then sends the real request, and the server answers with Access-Control-Allow-Origin. Simple requests skip the first two steps.</desc>
<defs><marker id="cors-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="50" width="120" height="140" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="80" y="116" text-anchor="middle" fill="#160572" font-weight="600">Page script</text>
<text x="80" y="136" text-anchor="middle" fill="#2c2c2c" font-size="13">origin A</text>
<rect x="260" y="50" width="120" height="140" rx="10" fill="#160572"/>
<text x="320" y="116" text-anchor="middle" fill="#ffffff" font-weight="600">Browser</text>
<rect x="500" y="50" width="120" height="140" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="560" y="116" text-anchor="middle" fill="#160572" font-weight="600">Server</text>
<text x="560" y="136" text-anchor="middle" fill="#2c2c2c" font-size="13">origin B</text>
<line x1="142" y1="120" x2="258" y2="120" stroke="#2544a0" stroke-width="2" marker-end="url(#cors-a)"/>
<text x="200" y="112" text-anchor="middle" fill="#2c2c2c" font-size="13">fetch()</text>
<line x1="382" y1="84" x2="498" y2="84" stroke="#2544a0" stroke-width="2" marker-end="url(#cors-a)"/>
<text x="440" y="79" text-anchor="middle" fill="#2c2c2c" font-size="13">1 OPTIONS</text>
<line x1="498" y1="112" x2="382" y2="112" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cors-a)"/>
<text x="440" y="107" text-anchor="middle" fill="#2c2c2c" font-size="13">2 Allow headers</text>
<line x1="382" y1="140" x2="498" y2="140" stroke="#2544a0" stroke-width="2" marker-end="url(#cors-a)"/>
<text x="440" y="135" text-anchor="middle" fill="#2c2c2c" font-size="13">3 real request</text>
<line x1="498" y1="168" x2="382" y2="168" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cors-a)"/>
<text x="440" y="163" text-anchor="middle" fill="#2c2c2c" font-size="13">4 Allow-Origin</text>
<text x="320" y="222" text-anchor="middle" fill="#2c2c2c" font-size="13">Simple requests skip steps 1 and 2</text>
</svg>
<figcaption>Simplified: a preflighted request sends an OPTIONS request before the real one.</figcaption>
</figure>

## Step by step

1. A script on origin A calls `fetch()` for a URL on origin B.
2. A simple request (GET, HEAD or POST with a basic content type) goes out directly with an `Origin` header.
3. Anything else, such as a PUT or a custom header, first gets an `OPTIONS` preflight with `Access-Control-Request-Method` and `Access-Control-Request-Headers`.
4. The server answers with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`.
5. The browser sends the real request. Its response must carry `Access-Control-Allow-Origin`, or the script cannot read it.
6. `Access-Control-Max-Age` tells the browser how long to cache the preflight answer.

| | Simple request | Preflighted request |
|---|---|---|
| Typical case | GET, HEAD, basic POST | PUT, custom header |
| Sent first | the request itself | `OPTIONS` |
| Server must allow | the origin | origin, methods, headers |

## Why it matters

The browser decides whether your script may read a response, so a CORS error means the server did not send the right headers. The upside is that a server can open itself to chosen origins. The catch is cookies: with credentials the server must name the origin instead of `*` and send `Access-Control-Allow-Credentials: true`.

## Sources

- [MDN, Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS): origins, the Origin header, simple and preflighted requests, preflight headers, Max-Age, credentials
- [MDN, Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Origin): a single origin or `*`, and why credentials need an explicit origin
- [MDN, Preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request): the OPTIONS request the browser sends on its own
