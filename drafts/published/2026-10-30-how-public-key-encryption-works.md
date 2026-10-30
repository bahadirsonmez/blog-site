---
title: "How public-key encryption works"
description: "Public-key encryption uses a key pair: anyone can lock a message with the public key, and only the private key unlocks it."
date: 2026-10-30
tags: [how-it-works, security]
status: draft
---

## Why this topic

Answers "how can strangers send me a secret if I never shared a password?". Claims rest on MDN's glossary entry for public-key cryptography (key pair, encryption and signing directions, hybrid use, speed and size limits) and RFC 8017 (which RSA schemes new applications should use). Simplified on purpose: no maths, and no padding, which real RSA needs. The sources give no timings or sizes, so the table is qualitative.

<!-- end why -->

Public-key encryption uses a pair of keys: one you publish and one you keep secret. The idea to keep: anyone can lock a message for you, but only you can unlock it.

## The short version

The two keys are linked: what one does, only the other can undo. You publish the public key, so anyone can encrypt a message to you. The private key stays with you and is the only thing that decrypts it. Signing runs the other way: the private key signs, and anyone can check the signature with the public key.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" width="640" height="230" role="img" aria-labelledby="t-pke d-pke" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-pke">How public-key encryption moves a message</title>
<desc id="d-pke">Three boxes in a row: Sender, Ciphertext and Receiver. A dashed arrow 1 goes from the Receiver back to the Sender: the receiver publishes the public key. Arrow 2 goes from the Sender to the Ciphertext: the message is locked with the public key. Arrow 3 goes from the Ciphertext to the Receiver: it is unlocked with the private key, which only the receiver keeps.</desc>
<defs><marker id="pke-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="60" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="88" text-anchor="middle" fill="#160572" font-weight="600">Sender</text>
<text x="95" y="108" text-anchor="middle" fill="#2c2c2c" font-size="13">uses the public key</text>
<rect x="245" y="60" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="88" text-anchor="middle" fill="#160572" font-weight="600">Ciphertext</text>
<text x="320" y="108" text-anchor="middle" fill="#2c2c2c" font-size="13">scrambled message</text>
<rect x="470" y="60" width="150" height="64" rx="10" fill="#160572"/>
<text x="545" y="88" text-anchor="middle" fill="#ffffff" font-weight="600">Receiver</text>
<text x="545" y="108" text-anchor="middle" fill="#ffffff" font-size="13">keeps the private key</text>
<line x1="172" y1="92" x2="243" y2="92" stroke="#2544a0" stroke-width="2" marker-end="url(#pke-a)"/>
<line x1="397" y1="92" x2="468" y2="92" stroke="#2544a0" stroke-width="2" marker-end="url(#pke-a)"/>
<path d="M545 126V172H95V128" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#pke-a)"/>
<text x="207" y="48" text-anchor="middle" fill="#2c2c2c" font-size="13">2 lock: public key</text>
<text x="432" y="48" text-anchor="middle" fill="#2c2c2c" font-size="13">3 unlock: private key</text>
<text x="320" y="200" text-anchor="middle" fill="#2c2c2c" font-size="13">1 the receiver publishes the public key</text>
</svg>
<figcaption>Simplified: real RSA also adds padding before it encrypts.</figcaption>
</figure>

## Step by step

1. The receiver makes a key pair and publishes the public key.
2. The sender encrypts the message with that public key.
3. The ciphertext travels to the receiver.
4. Only the receiver's private key decrypts it.

| | Symmetric | Public-key |
|---|---|---|
| Keys | one shared key | a pair, public and private |
| Speed | faster | much slower |
| Message size | can be long | limited by key size |

## Why it matters

In practice the two are combined: a symmetric algorithm encrypts the message, and public-key encryption protects only the small symmetric key. The upside is that the public key can be handed out freely; the downside is speed and size. RFC 8017 asks new applications to use RSA-OAEP for encryption and RSA-PSS for signatures, and keeps the older PKCS1-v1_5 schemes for compatibility.

## Sources

- [Public-key cryptography — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/Public-key_cryptography) — key pair, encryption and signing directions, speed and message-size limits, hybrid use with a symmetric algorithm
- [RFC 8017: PKCS #1 v2.2](https://www.rfc-editor.org/rfc/rfc8017) — RSAES-OAEP and RSASSA-PSS for new applications, PKCS1-v1_5 for compatibility
