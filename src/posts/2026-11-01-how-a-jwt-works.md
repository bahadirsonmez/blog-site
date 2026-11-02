---
title: "How a JWT works"
description: "A JWT is a header, a payload and a signature joined by dots. The signature catches changes to the token, but it does not hide what is inside."
date: 2026-11-01
tags: [how-it-works, security]
status: ready
---

A JWT (JSON Web Token) is a compact string that carries claims, such as who issued a token and when it expires. The idea to keep: the signature protects the token from changes, but it does not hide what is inside.

## The short version

A signed JWT has three parts joined by dots: a header, a payload and a signature. The header names the signing algorithm in `alg`, and the payload holds the claims. Both are base64url encoded. That is an encoding, not encryption, so anyone holding the token can decode and read them (my inference from how the encoding works). The signature is computed over the first two encoded parts, so changing either one breaks it.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" width="640" height="260" role="img" aria-labelledby="t-jwt d-jwt" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-jwt">How a JWT is made and checked</title>
<desc id="d-jwt">Top row, left to right: header and payload, then signing, then the finished token. Arrow 3 goes down from the token to the receiver's signature check. Dashed arrows then lead left to the claims check and finally to accept or reject.</desc>
<defs><marker id="jwt-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="28" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="58" text-anchor="middle" fill="#160572" font-weight="600">Header + payload</text>
<text x="105" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">two JSON objects</text>
<rect x="235" y="28" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="58" text-anchor="middle" fill="#160572" font-weight="600">Sign</text>
<text x="320" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">with the alg in header</text>
<rect x="450" y="28" width="170" height="68" rx="10" fill="#160572"/>
<text x="535" y="58" text-anchor="middle" fill="#ffffff" font-weight="600">Token</text>
<text x="535" y="80" text-anchor="middle" fill="#ffffff" font-size="13">three parts, two dots</text>
<rect x="450" y="164" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="194" text-anchor="middle" fill="#160572" font-weight="600">Recheck signature</text>
<text x="535" y="216" text-anchor="middle" fill="#2c2c2c" font-size="13">with your own alg</text>
<rect x="235" y="164" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="194" text-anchor="middle" fill="#160572" font-weight="600">Check the claims</text>
<text x="320" y="216" text-anchor="middle" fill="#2c2c2c" font-size="13">exp, iss, aud</text>
<rect x="20" y="164" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="194" text-anchor="middle" fill="#160572" font-weight="600">Accept or reject</text>
<text x="105" y="216" text-anchor="middle" fill="#2c2c2c" font-size="13">any failure rejects</text>
<line x1="192" y1="62" x2="233" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#jwt-a)"/>
<line x1="407" y1="62" x2="448" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#jwt-a)"/>
<line x1="535" y1="98" x2="535" y2="162" stroke="#2544a0" stroke-width="2" marker-end="url(#jwt-a)"/>
<line x1="448" y1="198" x2="407" y2="198" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#jwt-a)"/>
<line x1="233" y1="198" x2="192" y2="198" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#jwt-a)"/>
<text x="212" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="427" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="549" y="136" text-anchor="start" fill="#2c2c2c" font-size="13">3</text>
<text x="427" y="188" text-anchor="middle" fill="#2c2c2c" font-size="13">4</text>
<text x="212" y="188" text-anchor="middle" fill="#2c2c2c" font-size="13">5</text>
</svg>
<figcaption>Simplified: only signed tokens are shown, not encrypted ones.</figcaption>
</figure>

## Step by step

1. The sender builds the header and the payload as JSON.
2. It base64url encodes both and joins them with a dot.
3. It signs that text with the algorithm named in `alg`.
4. The token is the two parts plus the signature, with dots between them.
5. The receiver recomputes the signature, then checks `exp`, `iss` and `aud`.

| Part | Holds | Used for |
|---|---|---|
| Header | `alg`, `typ` | which algorithm signed the token |
| Payload | `iss`, `sub`, `aud`, `exp`, `iat` | issuer, subject, audience, expiry, issue time |
| Signature | the computed signature | catching changes |

## Why it matters

Trust no claim until the signature checks out, and take the algorithm from your own settings, not from the token's header. RFC 8725 warns about tokens with `alg` set to `none`, which carry no signature. The upside is a compact token that fits in a URL; the downside is that anyone can read it, and a careless check can be fooled.

## Sources

- [RFC 7519: JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519) — the definition, the three parts, registered claims, the validation steps
- [RFC 7515: JSON Web Signature (JWS)](https://www.rfc-editor.org/rfc/rfc7515) — the compact form, the signing input, integrity protection
- [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725) — choosing the algorithm yourself, the `none` algorithm, `iss` and `aud` checks
