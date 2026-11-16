---
title: "How computers store negative numbers"
description: "A signed integer spends its first bit on the sign and stores a negative number as 128 minus its size in the other seven bits. This is two's complement."
date: 2026-11-16
tags: [how-it-works, data]
status: ready
---

A computer has no minus sign, only bits, so a signed integer spends its first bit on the sign. The idea to keep: a negative number is stored as 128 minus its size in the other seven bits (here for 8 bits), which is called two's complement.

## The short version

Take Int8, a signed 8-bit integer. The first bit is the sign: 0 for positive, 1 for negative. A positive number is stored exactly as in an unsigned integer. A negative number puts 2^7 minus its size into the seven bits that remain. Because of that layout, signed numbers add with ordinary binary addition. The table shows the same eight bits read both ways.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" width="640" height="230" role="img" aria-labelledby="t-tc d-tc" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-tc">How -4 becomes the byte 11111100</title>
<desc id="d-tc">The Int8 value -4 splits into a sign bit of 1 and seven value bits that hold 124. Together they form the byte 11111100.</desc>
<defs><marker id="tc-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="88" width="130" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="85" y="121" text-anchor="middle" fill="#160572" font-weight="600">value: -4</text>
<rect x="230" y="26" width="170" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="315" y="59" text-anchor="middle" fill="#160572" font-weight="600">sign bit = 1</text>
<rect x="230" y="136" width="170" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="315" y="169" text-anchor="middle" fill="#160572" font-weight="600">7 bits hold 124</text>
<rect x="470" y="88" width="150" height="56" rx="10" fill="#160572"/>
<text x="545" y="121" text-anchor="middle" fill="#ffffff" font-weight="600">byte: 11111100</text>
<line x1="152" y1="104" x2="228" y2="68" stroke="#2544a0" stroke-width="2" marker-end="url(#tc-a)"/>
<line x1="152" y1="128" x2="228" y2="160" stroke="#2544a0" stroke-width="2" marker-end="url(#tc-a)"/>
<line x1="402" y1="68" x2="468" y2="104" stroke="#2544a0" stroke-width="2" marker-end="url(#tc-a)"/>
<line x1="402" y1="160" x2="468" y2="128" stroke="#2544a0" stroke-width="2" marker-end="url(#tc-a)"/>
<text x="320" y="216" text-anchor="middle" fill="#2c2c2c" font-size="13">negative: 2^7 - 4 = 124 goes into the seven value bits</text>
</svg>
<figcaption>Simplified: the sign bit and the seven value bits together make the stored byte.</figcaption>
</figure>

## Step by step

1. Fix the width, here 8 bits, and give the first one to the sign.
2. Store a positive number as usual: 4 is 00000100.
3. For a negative number, write 2^7 minus its size into the other seven bits.
4. For -4 that gives 124, so the byte is 11111100.
5. Add -1 and -4 with plain binary addition and discard the bit that does not fit. The answer is correct.

| | UInt8 | Int8 |
|---|---|---|
| Smallest value | 0 | -128 |
| Largest value | 255 | 127 |
| 11111100 reads as | 252 | -4 |

## Why it matters

The upside is that the CPU needs no special case for negatives, since addition works the same way. The downside is a lopsided range with one more negative value than positive, and overflow: Swift's `+` reports an error, while `&+` and `&-` wrap around, so `Int8.min &- 1` lands on the largest value.

## Sources

- [The Swift Programming Language, Advanced Operators](https://raw.githubusercontent.com/swiftlang/swift-book/main/TSPL.docc/LanguageGuide/AdvancedOperators.md): the first bit is the sign, positives match unsigned, a negative stores 2^7 minus its size (-4 is 11111100), plain binary addition drops bits that do not fit, `+` reports overflow and `&+`/`&-` wrap
- [The Swift Programming Language, The Basics](https://raw.githubusercontent.com/swiftlang/swift-book/main/TSPL.docc/LanguageGuide/TheBasics.md): UInt8 runs from 0 to 255, Int8 from -128 to 127
- [The Rust Reference, Numeric types](https://doc.rust-lang.org/reference/types/numeric.html): signed integer types are two's complement, i8 spans -(2^7) to 2^7-1
