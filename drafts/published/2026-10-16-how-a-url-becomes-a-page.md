---
title: "What happens when you type a URL and press Enter"
description: "Pressing Enter starts a short chain: find the server's address, open a connection, ask for the page, then draw it on screen."
date: 2026-10-16
tags: [how-it-works, web]
status: draft
---

## Why this topic

Answers the classic question "what happens after I press Enter?". Claims rest on MDN's "How browsers work" (DNS lookup, TCP handshake, TLS, GET, parsing and rendering), MDN's "What is a URL" (scheme, domain, default ports) and RFC 9293 section 3.5 (three-way handshake). Simplified on purpose: a cold start with no cache, no redirects, no HTTP/3 or connection reuse, and rendering folded into one step. I left out MDN's round-trip counts for TLS because they depend on the TLS version.

<!-- end why -->

Typing a URL and pressing Enter starts a chain of small, separate jobs. The one idea to keep: the browser first finds the server, then talks to it, then draws what it gets back.

## The short version

A URL tells the browser three things: which protocol to use, which server to ask, and which resource to ask for. The browser looks up the server's address, opens a connection to it, sends a request, and turns the HTML in the reply into the page you see.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" width="640" height="280" role="img" aria-labelledby="t-url d-url" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-url">From pressing Enter to a page on screen</title>
<desc id="d-url">The browser asks a DNS resolver for the server's address and gets an IP address back. It then opens a TCP and TLS connection to the web server, sends a GET request, receives HTML, and parses and renders the page.</desc>
<defs><marker id="url-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="url-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="30" width="150" height="230" rx="10" fill="#160572"/>
<text x="95" y="140" text-anchor="middle" fill="#ffffff" font-weight="600">Browser</text>
<text x="95" y="166" text-anchor="middle" fill="#ffffff" font-size="13">5 parse + render</text>
<rect x="470" y="30" width="150" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="70" text-anchor="middle" fill="#160572" font-weight="600">DNS resolver</text>
<rect x="470" y="150" width="150" height="110" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="210" text-anchor="middle" fill="#160572" font-weight="600">Web server</text>
<line x1="172" y1="52" x2="468" y2="52" stroke="#2544a0" stroke-width="2" marker-end="url(#url-a)"/>
<text x="320" y="44" text-anchor="middle" fill="#2c2c2c" font-size="13">2 where is example.com?</text>
<line x1="468" y1="84" x2="172" y2="84" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#url-r)"/>
<text x="320" y="76" text-anchor="middle" fill="#2c2c2c" font-size="13">IP address</text>
<line x1="172" y1="172" x2="468" y2="172" stroke="#2544a0" stroke-width="2" marker-end="url(#url-a)"/>
<text x="320" y="164" text-anchor="middle" fill="#2c2c2c" font-size="13">3 TCP + TLS handshake</text>
<line x1="172" y1="208" x2="468" y2="208" stroke="#2544a0" stroke-width="2" marker-end="url(#url-a)"/>
<text x="320" y="200" text-anchor="middle" fill="#2c2c2c" font-size="13">4 GET /</text>
<line x1="468" y1="244" x2="172" y2="244" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#url-r)"/>
<text x="320" y="236" text-anchor="middle" fill="#2c2c2c" font-size="13">HTML</text>
</svg>
<figcaption>Numbers match the steps below (step 1 happens inside the browser). Solid arrows go out from the browser; dashed arrows are replies.</figcaption>
</figure>

## Step by step

1. The browser reads the URL: `https` is the scheme, `example.com` the server, `/` the path. With no port written, HTTPS uses 443.
2. It asks DNS for the server's IP address.
3. It opens a TCP connection with a three-way handshake, then a TLS handshake that checks the server and sets up encryption.
4. It sends an HTTP GET request for the page, and the server replies with headers and HTML.
5. It parses the HTML into a tree (the DOM), fetches the CSS, scripts and images it finds, then lays out and paints the page.

## Why it matters

Steps 2 to 4 are messages over the network, and all of them happen before you see a single pixel. That is why a slow DNS answer or a slow connection can delay a page that is itself small.

## Sources

- [MDN, Populating the page: how browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work) — DNS lookup, TCP and TLS handshakes, the GET request, parsing into the DOM, fetching linked resources, layout and paint
- [MDN, What is a URL?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL) — scheme, domain, path, default ports 80 and 443
- [RFC 9293, Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293) — the three-way handshake (section 3.5)
