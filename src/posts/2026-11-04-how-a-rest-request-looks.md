---
title: "What a REST request and response look like"
description: "A call to a web API is an HTTP request and a response with the same shape: start line, headers, an empty line and a body. The method and status code carry the meaning."
date: 2026-11-04
tags: [how-it-works, web]
status: ready
---

Calls to a web API travel as HTTP messages. The idea to keep: the request and the response have the same four parts, in the same order.

## The short version

An HTTP/1.1 message is a start line, headers, an empty line and an optional body. In a request, the start line holds a method, a target such as `/users` and the protocol version. In a response, it holds the protocol version, a status code and optional text. The diagram follows a request that creates a user and the reply that comes back.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270" width="640" height="270" role="img" aria-labelledby="t-rest d-rest" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-rest">The parts of an HTTP request and response</title>
<desc id="d-rest">Top row, a request made of a request line, headers and a body. An arrow points down to the bottom row, a response made of a status line, headers and a body.</desc>
<defs><marker id="rest-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<text x="12" y="68" fill="#2c2c2c" font-weight="600">Request</text>
<rect x="110" y="30" width="180" height="64" rx="10" fill="#160572"/>
<text x="200" y="58" text-anchor="middle" fill="#ffffff" font-weight="600">Request line</text>
<text x="200" y="80" text-anchor="middle" fill="#ffffff" font-size="13">POST /users HTTP/1.1</text>
<rect x="310" y="30" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="385" y="58" text-anchor="middle" fill="#160572" font-weight="600">Headers</text>
<text x="385" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">Host, Content-Type</text>
<rect x="480" y="30" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="555" y="58" text-anchor="middle" fill="#160572" font-weight="600">Body</text>
<text x="555" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">after a blank line</text>
<line x1="385" y1="98" x2="385" y2="164" stroke="#2544a0" stroke-width="2" marker-end="url(#rest-a)"/>
<text x="400" y="136" fill="#2c2c2c" font-size="13">server replies</text>
<text x="12" y="206" fill="#2c2c2c" font-weight="600">Response</text>
<rect x="110" y="168" width="180" height="64" rx="10" fill="#160572"/>
<text x="200" y="196" text-anchor="middle" fill="#ffffff" font-weight="600">Status line</text>
<text x="200" y="218" text-anchor="middle" fill="#ffffff" font-size="13">HTTP/1.1 201 Created</text>
<rect x="310" y="168" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="385" y="196" text-anchor="middle" fill="#160572" font-weight="600">Headers</text>
<text x="385" y="218" text-anchor="middle" fill="#2c2c2c" font-size="13">Location</text>
<rect x="480" y="168" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2" stroke-dasharray="6 5"/>
<text x="555" y="196" text-anchor="middle" fill="#160572" font-weight="600">Body</text>
<text x="555" y="218" text-anchor="middle" fill="#2c2c2c" font-size="13">optional</text>
</svg>
<figcaption>Simplified: the HTTP/1.1 text format, with the request line and the status line highlighted.</figcaption>
</figure>

## Step by step

1. The client sends a request line: a method, a target and the protocol version.
2. Headers follow, one per line, such as `Host` and `Content-Type`.
3. An empty line ends the headers, and the body, if there is one, comes after it.
4. The server answers with a status line: the protocol version, a status code and optional text.
5. The first digit of the code groups the outcome: 2xx is success, 4xx is a client error, 5xx is a server error.
6. A `201 Created` response can carry a `Location` header that points to the new resource.

| Method | Asks for | Safe | Idempotent |
|---|---|---|---|
| GET | a representation of the resource | yes | yes |
| POST | sends data, may change state on the server | no | no |
| PUT | replaces the target's representations with the request body | no | yes |
| DELETE | deletes the resource | no | yes |

## Why it matters

Because PUT and DELETE are idempotent, repeating one gives the same result, while a POST may change the server's state every time it arrives, so it is the one to retry with care.

## Sources

- [MDN: HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) — the four parts, the request line and status line formats, headers, the example `201 Created` response with `Location`, HTTP/2 pseudo-headers
- [MDN: HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) — what GET, POST, PUT and DELETE ask for, and which are safe and idempotent
- [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) — the code classes and the meaning of 201 Created
