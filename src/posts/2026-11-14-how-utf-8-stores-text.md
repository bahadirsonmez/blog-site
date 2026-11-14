---
title: "How UTF-8 stores text"
description: "UTF-8 writes each character as one to four bytes. The first byte tells a reader how many, so any language fits and ASCII stays small."
date: 2026-11-14
tags: [how-it-works, data]
status: ready
---

UTF-8 is the most common way the web turns text into bytes. The idea to keep: the first byte of a character says how many bytes that character takes.

## The short version

Unicode gives every character a number, its code point; 日 is U+65E5. UTF-8 stores that number in one to four bytes, fewer for smaller numbers. Plain ASCII text is already valid UTF-8. For bigger numbers, the first byte starts with 1s that count the bytes in the character, and every later byte starts with `10`.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" width="640" height="240" role="img" aria-labelledby="t-u8 d-u8" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-u8">The character 日 becomes three UTF-8 bytes</title>
<desc id="d-u8">The code point U+65E5 is encoded into three bytes. The first byte is E6, bits 1110 0110, and says the character takes three bytes. The two continuation bytes are 97, bits 10 010111, and A5, bits 10 100101; both start with 10.</desc>
<defs><marker id="u8-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="50" width="120" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="80" y="87" text-anchor="middle" fill="#160572" font-weight="600">U+65E5</text>
<rect x="200" y="50" width="130" height="64" rx="10" fill="#160572"/>
<text x="265" y="87" text-anchor="middle" fill="#ffffff" font-weight="600">E6</text>
<rect x="345" y="50" width="130" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="410" y="87" text-anchor="middle" fill="#160572" font-weight="600">97</text>
<rect x="490" y="50" width="130" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="555" y="87" text-anchor="middle" fill="#160572" font-weight="600">A5</text>
<line x1="142" y1="82" x2="198" y2="82" stroke="#2544a0" stroke-width="2" marker-end="url(#u8-a)"/>
<text x="170" y="72" text-anchor="middle" fill="#2c2c2c" font-size="13">encode</text>
<text x="80" y="138" text-anchor="middle" fill="#2c2c2c" font-size="13">0110 0101 1110 0101</text>
<text x="265" y="138" text-anchor="middle" fill="#2c2c2c" font-size="13">1110 0110</text>
<text x="410" y="138" text-anchor="middle" fill="#2c2c2c" font-size="13">10 010111</text>
<text x="555" y="138" text-anchor="middle" fill="#2c2c2c" font-size="13">10 100101</text>
<text x="80" y="162" text-anchor="middle" fill="#2c2c2c" font-size="13">code point</text>
<text x="265" y="162" text-anchor="middle" fill="#2c2c2c" font-size="13">first byte: 3 bytes</text>
<text x="410" y="162" text-anchor="middle" fill="#2c2c2c" font-size="13">continuation: 10…</text>
<text x="555" y="162" text-anchor="middle" fill="#2c2c2c" font-size="13">continuation: 10…</text>
<path d="M200 186H620" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5"/>
<text x="410" y="214" text-anchor="middle" fill="#2c2c2c" font-size="13">the three bytes: E6 97 A5</text>
</svg>
<figcaption>Simplified: one character, three bytes; the first byte counts, the others start with 10.</figcaption>
</figure>

## Step by step

1. Take the code point: 日 is U+65E5.
2. Find its row in the table below: it is a three-byte one.
3. Write the number in binary and fill the `x` slots from left to right: `0110`, `010111`, `100101`.
4. The result is E6 97 A5, as the diagram shows.

| Code point range | Bytes | Bit pattern |
|---|---|---|
| U+0000–U+007F | 1 | `0xxxxxxx` |
| U+0080–U+07FF | 2 | `110xxxxx 10xxxxxx` |
| U+0800–U+FFFF | 3 | `1110xxxx 10xxxxxx 10xxxxxx` |
| U+10000–U+10FFFF | 4 | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

## Why it matters

Continuation bytes are always marked, so a reader dropped into the middle of a stream can find where the next character starts. The upside is ASCII compatibility and one encoding for every script. The downside is that characters differ in length. My reading: you cannot jump straight to the Nth character, you have to count from the start. Cut a string between bytes and the character breaks, as MDN warns.

## Sources

- [RFC 3629: UTF-8, a transformation format of ISO 10646](https://www.rfc-editor.org/rfc/rfc3629) — the byte table, ASCII as valid UTF-8, the first byte giving the length, continuation bytes starting with 10, the U+65E5 example
- [UTF-8 (MDN Glossary)](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8) — one to four bytes per character, the most common encoding on the web, ASCII compatibility, bytes corrupted when split and rejoined wrongly
