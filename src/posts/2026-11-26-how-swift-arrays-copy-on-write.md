---
title: "How copy-on-write works for Swift arrays"
description: "Copying a Swift array copies nothing at first. Both variables share storage until one is changed, and only that first write makes a real copy."
date: 2026-11-26
tags: [how-it-works, apple-dev]
status: ready
---

A Swift array is a value type, so `var b = a` gives you a copy that you can change without touching `a`. The idea to keep: that copy is lazy, and the elements are duplicated only when one of the two arrays is first changed.

## The short version

When you copy an array, Swift does not copy its elements right away. Both variables point to the same storage until one of them is mutated. At that first write, the array being changed takes its own copy of the storage and edits it in place, while the other array keeps the original. From your side it always looks as if the copy happened at the assignment.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-labelledby="t-cow d-cow" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-cow">How a Swift array copy shares storage until the first write</title>
<desc id="d-cow">Arrays a and b share one storage holding 1, 2, 3, 4, 5. When b writes, b gets its own copy holding 100, 2, 3, 4, 5, while a keeps the original storage unchanged.</desc>
<defs><marker id="cow-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="cow-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="40" width="110" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="75" y="68" text-anchor="middle" fill="#160572" font-weight="600">a</text>
<rect x="20" y="150" width="110" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="75" y="178" text-anchor="middle" fill="#160572" font-weight="600">b = a</text>
<rect x="210" y="95" width="150" height="64" rx="10" fill="#160572"/>
<text x="285" y="123" text-anchor="middle" fill="#ffffff" font-weight="600">shared storage</text>
<text x="285" y="143" text-anchor="middle" fill="#ffffff" font-size="13">[1, 2, 3, 4, 5]</text>
<rect x="450" y="30" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="58" text-anchor="middle" fill="#160572" font-weight="600">a keeps original</text>
<text x="535" y="78" text-anchor="middle" fill="#2c2c2c" font-size="13">[1, 2, 3, 4, 5]</text>
<rect x="450" y="150" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="178" text-anchor="middle" fill="#160572" font-weight="600">b's own copy</text>
<text x="535" y="198" text-anchor="middle" fill="#2c2c2c" font-size="13">[100, 2, 3, 4, 5]</text>
<line x1="132" y1="64" x2="208" y2="108" stroke="#2544a0" stroke-width="2" marker-end="url(#cow-a)"/>
<line x1="132" y1="172" x2="208" y2="146" stroke="#2544a0" stroke-width="2" marker-end="url(#cow-a)"/>
<line x1="362" y1="112" x2="448" y2="72" stroke="#2544a0" stroke-width="2" marker-end="url(#cow-a)"/>
<line x1="362" y1="146" x2="448" y2="178" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cow-b)"/>
<text x="170" y="50" text-anchor="middle" fill="#2c2c2c" font-size="13">1 share</text>
<text x="395" y="62" text-anchor="middle" fill="#2c2c2c" font-size="13">3 a unchanged</text>
<text x="400" y="196" text-anchor="middle" fill="#2c2c2c" font-size="13">2 b writes</text>
</svg>
<figcaption>Simplified: a and b share one storage until b writes; b then gets its own copy and a keeps the original.</figcaption>
</figure>

## Step by step

1. `var b = a` copies nothing yet; `a` and `b` share the same storage.
2. Reading from either array works as usual and costs no copy.
3. The first write to `b` finds the storage shared, so `b` copies it and then changes its own copy.
4. `a` still holds the original storage and is untouched.
5. Later writes to `b` happen in place, because `b` is now the only owner.

```swift
var a = [1, 2, 3, 4, 5]
var b = a
b[0] = 100   // a is still [1, 2, 3, 4, 5]
```

## Why it matters

Copying an array is cheap and you keep value semantics, but the first write after a copy pays the copying cost, so that one write can be slower than the ones after it. For your own types, `isKnownUniquelyReferenced` is the check Apple points to for building the same behavior.

## Sources

- [Array — Apple Developer Documentation](https://developer.apple.com/documentation/swift/array) — copies share storage until one is mutated, the first mutating operation pays the copy cost, later writes happen in place, the compiler may reduce copies
- [Classes and Structures — The Swift Programming Language](https://github.com/swiftlang/swift-book/blob/main/TSPL.docc/LanguageGuide/ClassesAndStructures.md) — arrays are value types, Swift copies lazily, and the result always behaves as if the copy was made immediately
- [isKnownUniquelyReferenced(_:) — Apple Developer Documentation](https://developer.apple.com/documentation/swift/isknownuniquelyreferenced(_:)-98zpp) — checks whether an object has a single strong reference, useful for copy-on-write in your own value types
