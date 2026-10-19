---
title: "How HTTPS keeps a connection private"
description: "Before a page travels, browser and server agree on a secret key in a short handshake, the server proves who it is, and the rest is encrypted."
date: 2026-10-19
tags: [how-it-works, security]
status: ready
---

HTTPS is HTTP carried over TLS, a protocol that gives two computers a private channel across a network they do not trust. The one idea to keep: before the first byte of the page is sent, browser and server agree on a secret key that nobody on the path can see.

## The short version

The browser and the server exchange a few messages called the handshake. Each side sends a public piece of a key, and from the two pieces both compute the same secret without ever sending it. The server also shows a certificate and signs the conversation so far, which proves it owns the name in the address bar. From then on, every request and response is encrypted with that secret.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" width="640" height="320" role="img" aria-labelledby="t-tls d-tls" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-tls">The TLS 1.3 handshake between a browser and a server</title>
<desc id="d-tls">The browser sends a hello with its key share. The server replies with its own key share, then its certificate, a signature and a Finished message, all encrypted. The browser sends Finished. After that HTTP flows encrypted in both directions.</desc>
<defs><marker id="tls-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="120" y="178" width="400" height="128" rx="10" fill="#f2ebe6"/>
<text x="320" y="298" text-anchor="middle" fill="#2c2c2c" font-size="13">encrypted from here on</text>
<rect x="20" y="20" width="150" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="54" text-anchor="middle" fill="#160572" font-weight="600">Browser</text>
<rect x="470" y="20" width="150" height="56" rx="10" fill="#160572"/>
<text x="545" y="54" text-anchor="middle" fill="#ffffff" font-weight="600">Server</text>
<line x1="95" y1="78" x2="95" y2="306" stroke="#2c2c2c" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="545" y1="78" x2="545" y2="306" stroke="#2c2c2c" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="97" y1="112" x2="543" y2="112" stroke="#2544a0" stroke-width="2" marker-end="url(#tls-a)"/>
<text x="320" y="104" text-anchor="middle" fill="#2c2c2c" font-size="13">1 hello, my key share</text>
<line x1="543" y1="156" x2="97" y2="156" stroke="#2544a0" stroke-width="2" marker-end="url(#tls-a)"/>
<text x="320" y="148" text-anchor="middle" fill="#2c2c2c" font-size="13">2 hello, my key share</text>
<line x1="543" y1="210" x2="97" y2="210" stroke="#2544a0" stroke-width="2" marker-end="url(#tls-a)"/>
<text x="320" y="202" text-anchor="middle" fill="#2c2c2c" font-size="13">3 certificate, signature, Finished</text>
<line x1="97" y1="250" x2="543" y2="250" stroke="#2544a0" stroke-width="2" marker-end="url(#tls-a)"/>
<text x="320" y="242" text-anchor="middle" fill="#2c2c2c" font-size="13">4 Finished</text>
<line x1="97" y1="284" x2="543" y2="284" stroke="#2544a0" stroke-width="2" marker-start="url(#tls-a)" marker-end="url(#tls-a)"/>
<text x="320" y="276" text-anchor="middle" fill="#2c2c2c" font-size="13">5 HTTP requests and responses</text>
</svg>
<figcaption>Numbers show the order. The shaded area is what an observer on the network cannot read.</figcaption>
</figure>

## Step by step

1. The browser sends a ClientHello: a random value, the cipher suites it supports, and its share of a fresh key.
2. The server answers with a ServerHello and its own key share. Each side combines its secret with the other's share and gets the same key. Everything after this point is encrypted.
3. The server sends its certificate and a signature over the handshake, made with the private key that belongs to the certificate. The browser checks the certificate against the name it asked for.
4. Both sides send a Finished message, a checksum over the whole handshake, so a tampered message is caught.
5. Only now does HTTP start. Headers and bodies travel encrypted in both directions.

## Why it matters

This is why a shared Wi-Fi can see which server you talk to, but not the pages or the form data. It is also why an expired or mismatched certificate stops the page: step 3 failed, so the browser refuses to continue.

## Sources

- [RFC 9846, The Transport Layer Security (TLS) Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc9846) — authentication, confidentiality and integrity goals (section 1); ClientHello random and key share, ServerHello key share, "everything after this phase is encrypted", Certificate, CertificateVerify signature, Finished as a MAC over the handshake, no application data before Finished (section 2)
- [MDN, Transport Layer Security](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security) — HTTPS is HTTP over TLS; the certificate binds the server's key to its domain name; headers and bodies are encrypted after the handshake
