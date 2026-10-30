---
title: "How passwords are stored: salt and many rounds"
description: "A well-built site stores a value derived from your password, not the password. PBKDF2 mixes in a random salt and repeats the work many times."
date: 2026-10-30
tags: [how-it-works, security]
status: draft
---

## Why this topic

Answers "how does a site keep my password without keeping my password". Claims rest on RFC 8018 (PBKDF2): the inputs in section 5.2, the salt rules in section 4.1 (may be random, at least eight octets) and the iteration count in section 4.2 (adds log2(c) bits of security strength). Simplified on purpose: one algorithm, no hash function choice. I left out an iteration number on purpose, because the figure quoted in the RFC is older guidance. Two statements are my reading and the post says so: that the site stores the derived value, and that the login check repeats the derivation.

<!-- end why -->

A well-built site does not keep your password itself. My reading: it keeps a value derived from the password, mixed with a random salt and run through many rounds of work.

## The short version

RFC 8018 defines PBKDF2. It takes a password, a salt and an iteration count, and produces a derived key. The salt is extra data mixed in; it may be random and should be at least eight octets (64 bits). The iteration count c is how many rounds the work repeats, and the RFC says it raises the security strength of a password by log2(c) bits, so each guess costs more.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" width="640" height="220" role="img" aria-labelledby="t-pw d-pw" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-pw">From password to stored value</title>
<desc id="d-pw">A password and a random salt both go into PBKDF2, which repeats its work c times. The output is the stored value.</desc>
<defs><marker id="pw-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="24" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="54" text-anchor="middle" fill="#160572" font-weight="600">Password</text>
<text x="105" y="74" text-anchor="middle" fill="#2c2c2c" font-size="13">what you type</text>
<rect x="20" y="132" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="162" text-anchor="middle" fill="#160572" font-weight="600">Random salt</text>
<text x="105" y="182" text-anchor="middle" fill="#2c2c2c" font-size="13">8 octets or more</text>
<rect x="235" y="78" width="170" height="64" rx="10" fill="#160572"/>
<text x="320" y="108" text-anchor="middle" fill="#ffffff" font-weight="600">PBKDF2</text>
<text x="320" y="128" text-anchor="middle" fill="#ffffff" font-size="13">c rounds of work</text>
<rect x="450" y="78" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="108" text-anchor="middle" fill="#160572" font-weight="600">Stored value</text>
<text x="535" y="128" text-anchor="middle" fill="#2c2c2c" font-size="13">the derived key</text>
<line x1="192" y1="56" x2="233" y2="98" stroke="#2544a0" stroke-width="2" marker-end="url(#pw-a)"/>
<line x1="192" y1="164" x2="233" y2="122" stroke="#2544a0" stroke-width="2" marker-end="url(#pw-a)"/>
<line x1="407" y1="110" x2="448" y2="110" stroke="#2544a0" stroke-width="2" marker-end="url(#pw-a)"/>
<text x="224" y="68" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="224" y="152" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="427" y="100" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
</svg>
<figcaption>Arrows 1 and 2 feed PBKDF2; arrow 3 is the result the site keeps.</figcaption>
</figure>

## Step by step

1. Pick a random salt, at least eight octets long.
2. Feed the password, the salt and the iteration count c into PBKDF2.
3. Get back a derived key of the length you asked for.
4. Store that value, not the password (my reading; the RFC does not say this).
5. At login the site usually repeats the derivation with the stored salt and compares the results (common practice, not in the RFC).

## Why it matters

The RFC says the salt makes a large set of keys possible for one password. My reading: two accounts with the same password need not end up with the same stored value. Pick the iteration count from current guidance, not from this post.

## Sources

- [RFC 8018: PKCS #5 Password-Based Cryptography Specification v2.1](https://www.rfc-editor.org/rfc/rfc8018) — PBKDF2 inputs (5.2), salt purpose, random salt and the eight-octet minimum (4.1), iteration count adds log2(c) bits (4.2)
