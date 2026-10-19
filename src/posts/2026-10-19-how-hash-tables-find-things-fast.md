---
title: "How a hash table finds things fast"
description: "A hash table turns the key into a number, uses that number as a position in an array, and jumps straight there instead of searching."
date: 2026-10-19
tags: [how-it-works, data]
status: ready
---

A hash table is the structure behind Swift's `Dictionary`, Python's `dict` and Java's `HashMap`. The one idea to keep: it does not search for a key, it computes where the key must be.

## The short version

A plain list makes you check entries one by one. A hash table runs the key through a hash function, which turns it into a number. That number picks a slot in an internal array, and the key and its value go into that slot. A later lookup repeats the calculation and lands on the same slot. As long as different keys mostly get different slots, a lookup costs about the same with ten entries or ten million.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270" width="640" height="270" role="img" aria-labelledby="t-hash d-hash" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-hash">How a key is turned into a slot in a hash table</title>
<desc id="d-hash">The key apple goes into a hash function, which returns the number 42. The number is reduced to slot 2 of an array with eight slots, and the pair apple and 3 is stored in slot 2. Another key, pear, sits in slot 5.</desc>
<defs><marker id="hash-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="24" width="150" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="58" text-anchor="middle" fill="#160572" font-weight="600">Key: "apple"</text>
<rect x="245" y="24" width="150" height="56" rx="10" fill="#160572"/>
<text x="320" y="58" text-anchor="middle" fill="#ffffff" font-weight="600">Hash function</text>
<rect x="470" y="24" width="150" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="58" text-anchor="middle" fill="#160572" font-weight="600">Number: 42</text>
<line x1="172" y1="52" x2="243" y2="52" stroke="#2544a0" stroke-width="2" marker-end="url(#hash-a)"/>
<text x="207" y="42" text-anchor="middle" fill="#2c2c2c" font-size="13">1 hash it</text>
<line x1="397" y1="52" x2="468" y2="52" stroke="#2544a0" stroke-width="2" marker-end="url(#hash-a)"/>
<text x="432" y="42" text-anchor="middle" fill="#2c2c2c" font-size="13">2 result</text>
<path d="M545 82V124H207V166" fill="none" stroke="#2544a0" stroke-width="2" marker-end="url(#hash-a)"/>
<text x="376" y="116" text-anchor="middle" fill="#2c2c2c" font-size="13">3 slot = 42 mod 8 = 2</text>
<rect x="20" y="168" width="600" height="60" rx="6" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<line x1="95" y1="168" x2="95" y2="228" stroke="#160572" stroke-width="2"/>
<line x1="170" y1="168" x2="170" y2="228" stroke="#160572" stroke-width="2"/>
<line x1="245" y1="168" x2="245" y2="228" stroke="#160572" stroke-width="2"/>
<line x1="320" y1="168" x2="320" y2="228" stroke="#160572" stroke-width="2"/>
<line x1="395" y1="168" x2="395" y2="228" stroke="#160572" stroke-width="2"/>
<line x1="470" y1="168" x2="470" y2="228" stroke="#160572" stroke-width="2"/>
<line x1="545" y1="168" x2="545" y2="228" stroke="#160572" stroke-width="2"/>
<rect x="171" y="169" width="73" height="58" fill="#160572"/>
<text x="207" y="194" text-anchor="middle" fill="#ffffff" font-weight="600" font-size="14">apple</text>
<text x="207" y="214" text-anchor="middle" fill="#ffffff" font-size="13">value 3</text>
<text x="432" y="194" text-anchor="middle" fill="#160572" font-weight="600" font-size="14">pear</text>
<text x="432" y="214" text-anchor="middle" fill="#160572" font-size="13">value 7</text>
<text x="57" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">0</text>
<text x="132" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="207" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="282" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
<text x="357" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">4</text>
<text x="432" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">5</text>
<text x="507" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">6</text>
<text x="582" y="252" text-anchor="middle" fill="#2c2c2c" font-size="13">7</text>
</svg>
<figcaption>Storing and finding "apple" follow the same three steps, so both land on slot 2. The numbers 42 and 8 are made up for the picture.</figcaption>
</figure>

## Step by step

1. You store "apple" with the value 3. The table feeds "apple" into its hash function and gets back a number.
2. The number is reduced to a slot index, for example the remainder after dividing by the number of slots. The pair goes there.
3. Later you ask for "apple". Same function, same number, same slot. The table jumps there and compares the stored key to be sure.
4. Two keys can land in the same slot. That is a collision, and the table then compares a few keys instead of one. Many collisions are what makes a hash table slow.
5. When the table gets too full, it allocates roughly twice as many slots and places every entry again, so slots stay mostly free and lookups stay short.

## Why it matters

This runs every time you use a Swift `Dictionary` or `Set`, which is why their keys must be `Hashable`. It also explains why a key must not change while stored: a changed key hashes to a different slot, and the entry is lost.

## Sources

- [Python, Design and History FAQ: How are dictionaries implemented in CPython?](https://docs.python.org/3/faq/design.html#how-are-dictionaries-implemented-in-cpython) — hash code per key, used to calculate a location in an internal array; constant-time retrieval when keys have different hash values; a mutated key can no longer be found
- [Java SE 21, class HashMap](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html) — buckets, load factor, rehashing to about twice the buckets when the table gets too full; many keys with the same hash code slow down any hash table
- [Swift standard library, Dictionary.swift](https://github.com/swiftlang/swift/blob/main/stdlib/public/core/Dictionary.swift) — "A dictionary is a type of hash table", any `Hashable` type can be the key, amortized O(1) lookup for native dictionaries
