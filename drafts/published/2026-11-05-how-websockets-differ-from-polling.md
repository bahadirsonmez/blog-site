---
title: "How WebSockets differ from polling"
description: "A WebSocket keeps one connection open so either side can send messages. Polling makes the client ask every time, often for nothing."
date: 2026-11-05
tags: [how-it-works, web]
status: draft
---

## Why this topic

Question it answers: how does a server get data to a client without the client asking every time? Claims rest on RFC 6202 (short and long polling), RFC 6455 (the WebSocket protocol) and MDN's WebSockets API page. Simplifications on purpose: the post shows the HTTP/1.1 handshake only; WebSocket over HTTP/2 and HTTP/3 is not covered. Frame masking, fragmentation and ping/pong are left out, and I give no byte counts because none of the sources I used states one for this comparison.

<!-- end why -->

A WebSocket is one connection between a client and a server that stays open and carries messages in both directions. The idea to keep: with polling the client has to ask every time, and with a WebSocket either side can speak once the connection is open.

## The short version

With polling, the client keeps asking the server whether there is something new, and the server answers with an empty reply when there is not. Long polling makes the server hold each request until it has something to say, but every message is still a full HTTP request and response. A WebSocket starts as one HTTP request. After that the same TCP connection stays open, and both sides send small frames whenever they like.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 272" width="640" height="272" role="img" aria-labelledby="t-ws d-ws" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-ws">Polling compared with a WebSocket</title>
<desc id="d-ws">Top row, polling: the client asks the server and gets an empty reply, then asks again. Bottom row, WebSocket: the client sends a GET with an Upgrade header, the server answers 101 Switching Protocols, then frames travel in both directions.</desc>
<defs><marker id="ws-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<text x="12" y="70" fill="#2c2c2c" font-weight="600">Polling</text>
<rect x="130" y="24" width="120" height="80" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="190" y="69" text-anchor="middle" fill="#160572" font-weight="600">Client</text>
<rect x="470" y="24" width="120" height="80" rx="10" fill="#160572"/>
<text x="530" y="69" text-anchor="middle" fill="#ffffff" font-weight="600">Server</text>
<line x1="254" y1="52" x2="466" y2="52" stroke="#2544a0" stroke-width="2" marker-end="url(#ws-a)"/>
<text x="360" y="44" text-anchor="middle" fill="#2c2c2c" font-size="13">1 ask</text>
<path d="M466 82H254" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ws-a)"/>
<text x="360" y="100" text-anchor="middle" fill="#2c2c2c" font-size="13">2 empty reply, ask again</text>
<line x1="12" y1="122" x2="628" y2="122" stroke="#f2ebe6" stroke-width="2"/>
<text x="12" y="200" fill="#2c2c2c" font-weight="600">WebSocket</text>
<rect x="130" y="140" width="120" height="112" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="190" y="201" text-anchor="middle" fill="#160572" font-weight="600">Client</text>
<rect x="470" y="140" width="120" height="112" rx="10" fill="#160572"/>
<text x="530" y="201" text-anchor="middle" fill="#ffffff" font-weight="600">Server</text>
<line x1="254" y1="164" x2="466" y2="164" stroke="#2544a0" stroke-width="2" marker-end="url(#ws-a)"/>
<text x="360" y="156" text-anchor="middle" fill="#2c2c2c" font-size="13">1 GET + Upgrade</text>
<path d="M466 194H254" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ws-a)"/>
<text x="360" y="186" text-anchor="middle" fill="#2c2c2c" font-size="13">2 101 Switching Protocols</text>
<line x1="254" y1="232" x2="466" y2="232" stroke="#2544a0" stroke-width="2" marker-start="url(#ws-a)" marker-end="url(#ws-a)"/>
<text x="360" y="224" text-anchor="middle" fill="#2c2c2c" font-size="13">3 frames both ways</text>
</svg>
<figcaption>Simplified: polling repeats the ask and the reply, a WebSocket does the handshake once and then talks both ways.</figcaption>
</figure>

## Step by step

1. The client sends an HTTP GET request with an `Upgrade: websocket` header.
2. The server answers `101 Switching Protocols`. Any other status means the handshake did not complete.
3. The TCP connection stays open.
4. Either side sends messages, each made of one or more frames, whenever it wants.
5. Either side can end the connection with a Close frame.

| | Short polling | Long polling | WebSocket |
|---|---|---|---|
| Who starts an exchange | the client | the client | either side, after the handshake |
| Empty replies | yes, when nothing is new | no, the server waits for an event or a timeout | no requests to answer |
| Headers on every message | full HTTP headers | full HTTP headers | small frame fields |

## Why it matters

Polling is simple but most questions can come back empty, while a WebSocket pushes data at once, and MDN notes that its API has no backpressure, so messages that arrive faster than the app can handle them can fill memory.

## Sources

- [RFC 6202: Known Issues and Best Practices for the Use of Long Polling and Streaming in Bidirectional HTTP](https://www.rfc-editor.org/rfc/rfc6202) — short and long polling, empty replies, full headers on every message
- [RFC 6455: The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455) — the upgrade handshake, the 101 response, one TCP connection, frames, the Close frame
- [MDN: The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) — two-way sessions without polling, and the lack of backpressure
