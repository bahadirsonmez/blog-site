---
title: "How rate limiting works"
description: "A token bucket refills at a steady rate and every request spends one token. When the bucket is empty, the server answers 429 and can say when to retry."
date: 2026-11-20
tags: [how-it-works, web]
status: draft
---

## Why this topic

Answers "why did the API answer 429, and how does a server decide that". Claims rest on RFC 6585 (the 429 status), MDN's Retry-After page and AWS API Gateway's throttling documentation (token bucket, rate and burst). Simplified on purpose: other algorithms and the new IETF RateLimit header draft are left out, and no numbers are given because the sources give none. RFC 9110's text on Retry-After could not be opened, so the Retry-After claims rest on MDN alone.

<!-- end why -->

Rate limiting caps how many requests a client can make in a given time. A token bucket is one way to do it: tokens drip into a bucket at a steady speed, and every request has to spend one.

## The short version

Picture a bucket that fills with tokens at a fixed rate, up to its capacity. A request takes one token. If a token is there, the request goes through. If the bucket is empty, the server answers 429 Too Many Requests, and it may add a `Retry-After` header that says how long to wait. The capacity is what lets a short spike through: a full bucket can pay for many requests at once.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-labelledby="t-rl d-rl" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-rl">A token bucket decides whether a request is allowed</title>
<desc id="d-rl">A request arrives at a bucket of tokens. A dashed arrow from a token refill box adds tokens to the bucket at a steady rate. If a token is left, the request is allowed. If the bucket is empty, the server answers 429 with a Retry-After header.</desc>
<defs><marker id="rl-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="200" y="16" width="140" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="270" y="43" text-anchor="middle" fill="#160572" font-weight="600">Token refill</text>
<rect x="20" y="110" width="120" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="80" y="147" text-anchor="middle" fill="#160572" font-weight="600">Request</text>
<rect x="200" y="110" width="140" height="64" rx="10" fill="#160572"/>
<text x="270" y="138" text-anchor="middle" fill="#ffffff" font-weight="600">Bucket</text>
<text x="270" y="158" text-anchor="middle" fill="#ffffff" font-size="13">capacity = burst</text>
<rect x="480" y="46" width="140" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="550" y="74" text-anchor="middle" fill="#160572" font-weight="600">Allowed</text>
<text x="550" y="94" text-anchor="middle" fill="#2c2c2c" font-size="13">one token spent</text>
<rect x="460" y="170" width="160" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="540" y="198" text-anchor="middle" fill="#160572" font-weight="600">429 + Retry-After</text>
<text x="540" y="218" text-anchor="middle" fill="#2c2c2c" font-size="13">wait, then retry</text>
<line x1="142" y1="142" x2="198" y2="142" stroke="#2544a0" stroke-width="2" marker-end="url(#rl-a)"/>
<line x1="342" y1="124" x2="478" y2="92" stroke="#2544a0" stroke-width="2" marker-end="url(#rl-a)"/>
<line x1="342" y1="160" x2="458" y2="196" stroke="#2544a0" stroke-width="2" marker-end="url(#rl-a)"/>
<path d="M270 62V108" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#rl-a)"/>
<text x="282" y="92" fill="#2c2c2c" font-size="13">steady rate</text>
<text x="395" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">token left</text>
<text x="385" y="210" text-anchor="middle" fill="#2c2c2c" font-size="13">bucket empty</text>
</svg>
<figcaption>Simplified: each service decides for itself who counts as one client.</figcaption>
</figure>

## Step by step

1. Tokens are added to the bucket at a steady rate, up to its capacity.
2. A request arrives and asks for a token.
3. If a token is left, it is spent and the request is allowed.
4. If the bucket is empty, the server rejects the request with 429.
5. The 429 may carry `Retry-After`, either a number of seconds or an HTTP date.
6. The client waits, and tries again.

| Setting | What it controls |
|---|---|
| Rate (AWS: throttling rate) | how fast tokens are added, so the long-run request rate |
| Burst (AWS: throttling burst) | the bucket's capacity, so the most requests a sudden spike can use |

## Why it matters

The burst allowance suits real traffic, which arrives in spikes. The catch is that RFC 6585 leaves open how a server recognises a client and counts its requests, so every service decides that for itself. When you get a 429, look for `Retry-After` before you retry.

## Sources

- [RFC 6585, section 4: 429 Too Many Requests](https://www.rfc-editor.org/rfc/rfc6585.html): the 429 status for too many requests in a given time, and that the specification does not say how clients are identified or requests counted
- [MDN, Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After): how long to wait before a new request, as seconds or an HTTP date
- [AWS API Gateway, request throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html): the token bucket, one token per request, throttling rate and throttling burst, and 429 when the limit is exceeded
