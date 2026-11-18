---
title: "How a cookie keeps you logged in"
description: "HTTP forgets you between requests. A cookie holding a random session ID is how a server recognizes you again after you log in."
date: 2026-11-18
tags: [how-it-works, web]
status: draft
---

## Why this topic

Answers how a site remembers you after you log in. The claims rest on RFC 6265 (the Set-Cookie and Cookie headers, the attributes) and MDN's cookies guide (the login flow, the session ID, Secure, HttpOnly, SameSite, session cookies). Simplified on purpose: Domain and Path matching, SameSite details and how the server stores sessions are left out.

<!-- end why -->

A cookie is a small name and value that a server asks your browser to keep and send back. The idea to keep: HTTP does not remember you between requests, so the cookie is how the server recognizes you again.

## The short version

Each HTTP request arrives on its own, with no memory of the last one. After you log in, the server creates a session on its side and hands your browser a random session ID inside a cookie. The browser sends that cookie back on later requests, and the server looks the ID up to find you.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" width="640" height="200" role="img" aria-labelledby="t-ck d-ck" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-ck">A cookie carries a session ID between browser and server</title>
<desc id="d-ck">The browser sends a login to the server. The server answers with a Set-Cookie header holding a session ID. On every later request the browser sends the ID back in a Cookie header, and the server looks it up in its session store.</desc>
<defs><marker id="ck-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="30" width="130" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="85" y="67" text-anchor="middle" fill="#160572" font-weight="600">Browser</text>
<rect x="255" y="30" width="130" height="64" rx="10" fill="#160572"/>
<text x="320" y="67" text-anchor="middle" fill="#ffffff" font-weight="600">Server</text>
<rect x="490" y="30" width="130" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="555" y="67" text-anchor="middle" fill="#160572" font-weight="600">Session store</text>
<line x1="152" y1="52" x2="253" y2="52" stroke="#2544a0" stroke-width="2" marker-end="url(#ck-a)"/>
<line x1="253" y1="78" x2="152" y2="78" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ck-a)"/>
<line x1="387" y1="62" x2="488" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#ck-a)"/>
<path d="M85 96V150H320V98" fill="none" stroke="#2544a0" stroke-width="2" marker-end="url(#ck-a)"/>
<text x="202" y="45" text-anchor="middle" fill="#2c2c2c" font-size="13">1 login</text>
<text x="202" y="93" text-anchor="middle" fill="#2c2c2c" font-size="13">2 Set-Cookie</text>
<text x="437" y="54" text-anchor="middle" fill="#2c2c2c" font-size="13">4 look up ID</text>
<text x="202" y="172" text-anchor="middle" fill="#2c2c2c" font-size="13">3 later requests: Cookie: id=…</text>
</svg>
<figcaption>Simplified: the browser keeps the cookie, and the server keeps the session it points to.</figcaption>
</figure>

## Step by step

1. You send your username and password to the server.
2. If they are valid, the server creates a session and replies with `Set-Cookie: id=…` holding a random ID.
3. The browser stores the cookie.
4. On later requests to that site, the browser adds `Cookie: id=…`.
5. The server finds the ID in its sessions and knows who you are.
6. If the ID is unknown, you get a generic page or a new login.

| Attribute | What it does |
|---|---|
| `Secure` | Sent only over HTTPS |
| `HttpOnly` | Hidden from page scripts |
| `SameSite` | Decides whether it is sent with cross-site requests |

## Why it matters

The cookie carries only a random ID, because the user can see and edit the value. The downside is that anyone who steals the ID can act as you, so `Secure` and `HttpOnly` matter. Without `Max-Age` or `Expires` it is a session cookie, and the browser deletes it when the browser session ends.

## Sources

- [RFC 6265, HTTP State Management Mechanism](https://www.rfc-editor.org/rfc/rfc6265): the Set-Cookie and Cookie headers, the browser sending back only name=value, the attributes
- [MDN, Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies): the login and session flow, random session IDs, Secure, HttpOnly, SameSite, session cookies
