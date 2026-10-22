---
title: "How a packet finds its way across the internet"
description: "Each router looks up the next hop in its own table and picks the longest matching prefix. A time-to-live counter stops packets from looping forever."
date: 2026-10-22
tags: [how-it-works, networking]
status: ready
---

A packet crossing the internet passes through a series of routers, and each router decides only the next step. The idea to keep: every hop is a table lookup, and a counter makes sure a wrong turn cannot go on forever.

## The short version

The packet is passed from one network to the next through routers. Each router looks in its own route database and forwards the packet. When several routes match the destination, the most specific one wins: the longest matching network prefix. Meanwhile a time-to-live field is lowered wherever the packet is processed. When it reaches zero, the packet is destroyed.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-labelledby="t-pkt d-pkt" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-pkt">How a packet is forwarded from router to router</title>
<desc id="d-pkt">A packet goes from the sender through router 1 and router 2 to the receiver. Each router looks up the next hop in its routing table, where the longest matching prefix wins, and lowers the time-to-live. If the time-to-live reaches zero, the packet is dropped.</desc>
<defs><marker id="pkt-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="pkt-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="10" y="50" width="125" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="72" y="77" text-anchor="middle" fill="#160572" font-weight="600">Sender</text>
<text x="72" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">sends the packet</text>
<rect x="175" y="50" width="125" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="237" y="77" text-anchor="middle" fill="#160572" font-weight="600">Router 1</text>
<text x="237" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">TTL lowered</text>
<rect x="340" y="50" width="125" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="402" y="77" text-anchor="middle" fill="#160572" font-weight="600">Router 2</text>
<text x="402" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">TTL lowered</text>
<rect x="505" y="50" width="125" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="567" y="77" text-anchor="middle" fill="#160572" font-weight="600">Receiver</text>
<text x="567" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">packet arrives</text>
<rect x="215" y="168" width="210" height="64" rx="10" fill="#160572"/>
<text x="320" y="196" text-anchor="middle" fill="#ffffff" font-weight="600">Routing table</text>
<text x="320" y="216" text-anchor="middle" fill="#ffffff" font-size="13">longest prefix wins</text>
<rect x="495" y="168" width="135" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="562" y="196" text-anchor="middle" fill="#160572" font-weight="600">Packet dropped</text>
<text x="562" y="216" text-anchor="middle" fill="#2c2c2c" font-size="13">TTL reached 0</text>
<line x1="137" y1="82" x2="173" y2="82" stroke="#2544a0" stroke-width="2" marker-end="url(#pkt-a)"/>
<line x1="302" y1="82" x2="338" y2="82" stroke="#2544a0" stroke-width="2" marker-end="url(#pkt-a)"/>
<line x1="467" y1="82" x2="503" y2="82" stroke="#2544a0" stroke-width="2" marker-end="url(#pkt-a)"/>
<line x1="237" y1="116" x2="237" y2="166" stroke="#2544a0" stroke-width="2" marker-end="url(#pkt-a)"/>
<line x1="402" y1="116" x2="402" y2="166" stroke="#2544a0" stroke-width="2" marker-end="url(#pkt-a)"/>
<path d="M440 116V140H562V166" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#pkt-r)"/>
<text x="155" y="72" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="320" y="72" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="485" y="72" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
<text x="245" y="148" text-anchor="start" fill="#2c2c2c" font-size="13">look up</text>
<text x="394" y="148" text-anchor="end" fill="#2c2c2c" font-size="13">look up</text>
<text x="500" y="134" text-anchor="start" fill="#2c2c2c" font-size="13">TTL 0</text>
</svg>
<figcaption>Arrows 1 to 3 follow the packet. Each router looks up its table and lowers the time-to-live (TTL); the dashed path is what happens at zero.</figcaption>
</figure>

## Step by step

1. The sender hands the packet to the first router.
2. The router looks up the destination in its route database.
3. If more than one route matches, it uses the longest matching network prefix.
4. It lowers the time-to-live field and forwards the packet to the next router.
5. This repeats until the receiver is reached. If the time-to-live hits zero first, the packet is dropped.

## Why it matters

A wrong turn between two routers cannot make a packet circle forever, because the counter runs out. My reading, not a quoted line: no single router needs to know the whole path, only the next hop. Simplified: one path, no error messages, no routing protocols.

## Sources

- [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791) — datagrams are routed from one internet module to another through individual networks; the time-to-live field is decreased where the header is processed and a datagram with zero must be destroyed
- [RFC 1812: Requirements for IP Version 4 Routers](https://www.rfc-editor.org/rfc/rfc1812) — forwarding depends on a route database within the router; the longest matching network prefix is used; datagrams whose time-to-live reached zero are dropped
