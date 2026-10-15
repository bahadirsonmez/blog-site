---
title: "How DNS turns a name into an address"
description: "DNS is the internet's phone book. A resolver follows referrals from the root to the right server and caches the answer."
date: 2026-10-15
tags: [how-it-works, networking]
status: draft
---

## Why this topic

Answers the question "how does example.com become an IP address?". Claims rest on RFC 1034 (sections 3, 5.3.3) and RFC 1035 (TTL, A records). Simplified on purpose: no DNSSEC, no encrypted DNS, no CNAME chains, and a cold cache so all three server levels appear.

<!-- end why -->

DNS is the system that turns a name like example.com into an IP address. The one idea to keep: nobody knows every answer, but everyone knows who to ask next.

## The short version

Names form a tree, with the root at the top. Your device asks a resolver. The resolver asks a server near the top, gets pointed down the tree, and repeats until a server that owns the name gives the address.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" width="640" height="300" role="img" aria-labelledby="t-dns d-dns" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-dns">A resolver walking down the DNS tree</title>
<desc id="d-dns">The browser asks the resolver. The resolver asks a root server, then a top-level domain server, then an authoritative server, and returns the answer to the browser.</desc>
<defs><marker id="dns-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="dns-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="115" width="120" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="80" y="152" text-anchor="middle" fill="#160572" font-weight="600">Browser</text>
<rect x="240" y="115" width="140" height="64" rx="10" fill="#160572"/>
<text x="310" y="152" text-anchor="middle" fill="#ffffff" font-weight="600">Resolver</text>
<rect x="440" y="24" width="180" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="530" y="58" text-anchor="middle" fill="#160572" font-weight="600">Root server</text>
<rect x="440" y="122" width="180" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="530" y="156" text-anchor="middle" fill="#160572" font-weight="600">.com server</text>
<rect x="440" y="220" width="180" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="530" y="254" text-anchor="middle" fill="#160572" font-weight="600">Authoritative server</text>
<line x1="142" y1="147" x2="238" y2="147" stroke="#2544a0" stroke-width="2" marker-end="url(#dns-a)"/>
<line x1="382" y1="135" x2="438" y2="64" stroke="#2544a0" stroke-width="2" marker-end="url(#dns-a)"/>
<line x1="382" y1="147" x2="438" y2="150" stroke="#2544a0" stroke-width="2" marker-end="url(#dns-a)"/>
<line x1="382" y1="160" x2="438" y2="236" stroke="#2544a0" stroke-width="2" marker-end="url(#dns-a)"/>
<path d="M310 181V288H80V181" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#dns-r)"/>
<text x="190" y="136" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="392" y="92" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="410" y="140" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
<text x="392" y="212" text-anchor="middle" fill="#2c2c2c" font-size="13">4</text>
<text x="195" y="280" text-anchor="middle" fill="#2c2c2c" font-size="13">5 answer</text>
</svg>
<figcaption>Numbers show the order. Solid arrows are questions; the dashed arrow is the final answer.</figcaption>
</figure>

## Step by step

1. Your browser asks a resolver for the address of example.com.
2. The resolver asks a root server. It replies with a referral to the servers for .com.
3. The resolver asks a .com server, which refers it to the servers that hold example.com.
4. The resolver asks one of those servers, which answers with an A record: a 32-bit IPv4 address.
5. The resolver caches the answer for the record's TTL and returns it to the browser.

## Why it matters

The TTL is why a DNS change can take time to show up: cached copies stay valid until they expire. In practice the resolver often skips steps 2 and 3, because it already knows the closest servers.

## Sources

- [RFC 1034, Domain names: concepts and facilities](https://www.rfc-editor.org/rfc/rfc1034) — name tree, zones, referrals, resolver algorithm, caching
- [RFC 1035, Domain names: implementation and specification](https://www.rfc-editor.org/rfc/rfc1035) — TTL in seconds, A record holds a 32-bit address
