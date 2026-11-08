---
title: "How ARC frees memory in Swift"
description: "Swift counts the strong references to each class instance and frees the instance when the count reaches zero. Two instances holding each other never do."
date: 2026-11-08
tags: [how-it-works, apple-dev]
status: ready
---

ARC is how Swift decides when a class instance is no longer needed. The idea to keep: an instance lives as long as at least one strong reference points to it.

## The short version

Swift tracks how many properties, constants and variables currently hold a strong reference to each class instance. When the last one lets go, Swift frees the instance, and its `deinit` runs just before. This applies only to classes; structs and enums are value types and are not counted.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" width="640" height="240" role="img" aria-labelledby="t-arc d-arc" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-arc">How ARC counts strong references</title>
<desc id="d-arc">Three variables, reference1, reference2 and reference3, each hold a strong reference to one Person instance, so its strong count is 3. When all three are set to nil the count reaches 0 and the instance is freed after its deinit runs.</desc>
<defs><marker id="arc-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="24" width="130" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="85" y="52" text-anchor="middle" fill="#160572" font-weight="600">reference1</text>
<rect x="20" y="98" width="130" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="85" y="126" text-anchor="middle" fill="#160572" font-weight="600">reference2</text>
<rect x="20" y="172" width="130" height="44" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="85" y="200" text-anchor="middle" fill="#160572" font-weight="600">reference3</text>
<rect x="220" y="88" width="160" height="64" rx="10" fill="#160572"/>
<text x="300" y="116" text-anchor="middle" fill="#ffffff" font-weight="600">Person instance</text>
<text x="300" y="136" text-anchor="middle" fill="#ffffff" font-size="13">strong count: 3</text>
<rect x="490" y="88" width="130" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="555" y="116" text-anchor="middle" fill="#160572" font-weight="600">deinit runs</text>
<text x="555" y="136" text-anchor="middle" fill="#2c2c2c" font-size="13">count reaches 0</text>
<line x1="152" y1="46" x2="218" y2="100" stroke="#2544a0" stroke-width="2" marker-end="url(#arc-a)"/>
<line x1="152" y1="120" x2="218" y2="120" stroke="#2544a0" stroke-width="2" marker-end="url(#arc-a)"/>
<line x1="152" y1="194" x2="218" y2="140" stroke="#2544a0" stroke-width="2" marker-end="url(#arc-a)"/>
<line x1="382" y1="120" x2="488" y2="120" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#arc-a)"/>
<text x="435" y="110" text-anchor="middle" fill="#2c2c2c" font-size="13">all set to nil</text>
</svg>
<figcaption>Simplified: three variables hold one instance; the instance is freed only when the last of them lets go.</figcaption>
</figure>

## Step by step

1. Assigning a new instance to a variable gives it one strong reference.
2. Each extra constant, variable or property that holds it adds one.
3. Setting a reference to `nil` takes one away.
4. At zero, `deinit` runs and the instance is freed.
5. If two instances hold each other strongly, neither count reaches zero, so neither is freed. That is a strong reference cycle.

## Why it matters

ARC frees memory for you, but it cannot break a cycle by itself; you do, by making one side `weak` (optional, and set to `nil` when the instance is freed) or `unowned` (not optional, and a run-time error if used after the instance is gone). ARC saves you from freeing by hand, but how the instances relate to each other is still your design.

## Sources

- [Automatic Reference Counting — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/) — counting strong references, classes only, the three-variable example, reference cycles, `weak` and `unowned`
- [Deinitialization — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/deinitialization/) — `deinit` is called immediately before an instance is freed
