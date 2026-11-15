---
title: "Why 0.1 + 0.2 is not 0.3"
description: "Computers store 0.1 as the nearest binary fraction, which is a hair off. Add two such values and the sum prints as 0.30000000000000004."
date: 2026-11-15
tags: [how-it-works, data]
status: draft
---

## Why this topic

Answers the classic "why is 0.1 + 0.2 not 0.3?" question. Claims rest on the Python floating-point tutorial, floating-point-gui.de and MDN's Number page. Simplified on purpose: rounding details (ulp) and the exact neighbouring value of 0.3 are left out, and only 0.1's stored fraction is shown because the sources do not give the ones for 0.2 and 0.3.

<!-- end why -->

Add 0.1 and 0.2 with ordinary floating-point numbers and the result prints as 0.30000000000000004, not 0.3. The idea to keep: the computer never stored exactly 0.1 in the first place.

## The short version

A double (IEEE 754 binary64) keeps a number as a binary fraction with 53 bits of precision. Most decimal fractions, 0.1 among them, have no exact binary form, so the computer stores the nearest one it can. The stored 0.1 sits a hair above 0.1, as the table shows. Addition then works on those stored values, and their small errors end up in the sum.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" width="640" height="260" role="img" aria-labelledby="t-fp d-fp" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-fp">How 0.1 + 0.2 becomes 0.30000000000000004</title>
<desc id="d-fp">The numbers 0.1 and 0.2 are each rounded to the nearest double. The two doubles are added, and the result prints as 0.30000000000000004.</desc>
<defs><marker id="fp-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<text x="60" y="26" text-anchor="middle" fill="#2c2c2c" font-size="13">you write</text>
<text x="195" y="26" text-anchor="middle" fill="#2c2c2c" font-size="13">1 stored</text>
<text x="350" y="26" text-anchor="middle" fill="#2c2c2c" font-size="13">2 add</text>
<text x="525" y="26" text-anchor="middle" fill="#2c2c2c" font-size="13">3 printed</text>
<rect x="20" y="40" width="80" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="60" y="73" text-anchor="middle" fill="#160572" font-weight="600">0.1</text>
<rect x="20" y="150" width="80" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="60" y="183" text-anchor="middle" fill="#160572" font-weight="600">0.2</text>
<rect x="130" y="40" width="130" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="195" y="73" text-anchor="middle" fill="#160572" font-weight="600">double for 0.1</text>
<rect x="130" y="150" width="130" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="195" y="183" text-anchor="middle" fill="#160572" font-weight="600">double for 0.2</text>
<rect x="310" y="95" width="80" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="350" y="128" text-anchor="middle" fill="#160572" font-weight="600">add</text>
<rect x="420" y="95" width="210" height="56" rx="10" fill="#160572"/>
<text x="525" y="128" text-anchor="middle" fill="#ffffff" font-weight="600">0.30000000000000004</text>
<line x1="102" y1="68" x2="128" y2="68" stroke="#2544a0" stroke-width="2" marker-end="url(#fp-a)"/>
<line x1="102" y1="178" x2="128" y2="178" stroke="#2544a0" stroke-width="2" marker-end="url(#fp-a)"/>
<line x1="262" y1="72" x2="308" y2="110" stroke="#2544a0" stroke-width="2" marker-end="url(#fp-a)"/>
<line x1="262" y1="174" x2="308" y2="136" stroke="#2544a0" stroke-width="2" marker-end="url(#fp-a)"/>
<line x1="392" y1="123" x2="418" y2="123" stroke="#2544a0" stroke-width="2" marker-end="url(#fp-a)"/>
<text x="320" y="244" text-anchor="middle" fill="#2c2c2c" font-size="13">the stored values are slightly off, so the sum is too</text>
</svg>
<figcaption>Simplified: each number is rounded when stored, then the rounded values are added.</figcaption>
</figure>

## Step by step

1. You write 0.1 and 0.2.
2. Each one is rounded to the nearest double the computer can hold.
3. The two stored values are added.
4. The sum prints as 0.30000000000000004.

| | Value |
|---|---|
| You write | 0.1 |
| The double stores | `3602879701896397 / 2**55` |
| In decimal, exactly | 0.1000000000000000055511151231257827021181583404541015625 |

## Why it matters

The upside is that 53 bits give about 15 to 17 significant decimal digits, plenty for most work. The downside is that decimal fractions are only approximate, so even 0.1 + 0.1 + 0.1 == 0.3 is false in Python. For money, use a decimal type, or whole numbers such as cents when there is none, and round only for display.

## Sources

- [Floating-Point Arithmetic: Issues and Limitations (Python docs)](https://docs.python.org/3/tutorial/floatingpoint.html): most decimal fractions have no exact binary form, 0.1 stored as 3602879701896397 / 2**55 and slightly larger than 0.1, 53 bits of precision, 0.1 + 0.1 + 0.1 == 0.3 is False
- [The Floating-Point Guide: Basic Answers](https://floating-point-gui.de/basic/): 0.1 and 0.2 are rounded to the nearest representable value, the small errors add up to 0.30000000000000004, decimal types, cents as integers and rounding for display
- [Number (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number): 64-bit double precision, about 15 to 17 significant decimal digits
