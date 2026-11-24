---
title: "How semantic versioning works"
description: "SemVer numbers a release MAJOR.MINOR.PATCH. Which part goes up tells you whether the change is a bug fix, new functionality or a break."
date: 2026-11-23
tags: [how-it-works]
status: ready
---

Semantic versioning, or SemVer, numbers a release as MAJOR.MINOR.PATCH. Which part goes up tells you what kind of change is inside.

## The short version

PATCH goes up for a backward compatible bug fix, MINOR for backward compatible new functionality, and MAJOR for a change that breaks the public API. When a number goes up, every number to its right resets to 0.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 270" width="640" height="270" role="img" aria-labelledby="t-sv d-sv" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-sv">One example release, three kinds of change, three next versions</title>
<desc id="d-sv">From the example release 1.4.2, a bug fix leads to 1.4.3 with PATCH up, a new feature leads to 1.5.0 with MINOR up and PATCH reset to 0, and a breaking change leads to 2.0.0 with MAJOR up and MINOR and PATCH reset to 0.</desc>
<defs><marker id="sv-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="100" width="130" height="70" rx="10" fill="#160572"/>
<text x="85" y="132" text-anchor="middle" fill="#ffffff" font-weight="600" font-size="18">1.4.2</text>
<text x="85" y="154" text-anchor="middle" fill="#ffffff" font-size="13">example release</text>
<rect x="380" y="16" width="240" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="500" y="44" text-anchor="middle" fill="#160572" font-weight="600">1.4.3</text>
<text x="500" y="64" text-anchor="middle" fill="#2c2c2c" font-size="13">PATCH up</text>
<rect x="380" y="103" width="240" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="500" y="131" text-anchor="middle" fill="#160572" font-weight="600">1.5.0</text>
<text x="500" y="151" text-anchor="middle" fill="#2c2c2c" font-size="13">MINOR up, PATCH to 0</text>
<rect x="380" y="190" width="240" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="500" y="218" text-anchor="middle" fill="#160572" font-weight="600">2.0.0</text>
<text x="500" y="238" text-anchor="middle" fill="#2c2c2c" font-size="13">MAJOR up, MINOR and PATCH to 0</text>
<line x1="152" y1="122" x2="378" y2="52" stroke="#2544a0" stroke-width="2" marker-end="url(#sv-a)"/>
<line x1="152" y1="135" x2="378" y2="135" stroke="#2544a0" stroke-width="2" marker-end="url(#sv-a)"/>
<line x1="152" y1="148" x2="378" y2="218" stroke="#2544a0" stroke-width="2" marker-end="url(#sv-a)"/>
<text x="262" y="74" text-anchor="middle" fill="#2c2c2c" font-size="13" transform="rotate(-17 262 74)">bug fix</text>
<text x="265" y="126" text-anchor="middle" fill="#2c2c2c" font-size="13">new feature</text>
<text x="262" y="206" text-anchor="middle" fill="#2c2c2c" font-size="13" transform="rotate(17 262 206)">breaking change</text>
</svg>
<figcaption>1.4.2 is an example release; each arrow is a kind of change and each box the next version.</figcaption>
</figure>

## Step by step

1. Look at what changed since the last release.
2. If the public API changed in a way that is not backward compatible, raise MAJOR.
3. Otherwise, if you added backward compatible functionality, raise MINOR. Marking a public API feature as deprecated also raises MINOR.
4. Otherwise, raise PATCH for a backward compatible bug fix.
5. Never edit a release that is already published. A change ships as a new version.
6. Versions below 1.0.0 are initial development, where anything may change. 1.0.0 is the version that defines the public API.

| Comparison | Why |
|---|---|
| 1.9.0 is lower than 1.10.0 | the parts compare as numbers, not as text |
| 1.0.0-alpha is lower than 1.0.0 | a pre-release ranks below its normal version |
| 1.0.0+001 equals 1.0.0+002 | build metadata is ignored when comparing |

## Why it matters

Tools lean on this contract. Swift Package Manager's `from: "1.2.3"` accepts 1.2.3, 1.2.4 and 1.3.0 but never 2.0.0, and npm's `^1.0.0` and `~2.2.0` ranges use the same numbers (the range operators are defined in npm's docs, not in the SemVer spec). The upside is that the number tells you how risky an update is. The catch, in practice, is that it only works when a package declares its public API and raises the numbers honestly.

## Sources

- [Semantic Versioning 2.0.0](https://semver.org/): what MAJOR, MINOR and PATCH mean, the resets, deprecation raising MINOR, 0.y.z and 1.0.0, published releases never changing, and the order of numeric, pre-release and build-metadata versions
- [npm, About semantic versioning](https://docs.npmjs.com/about-semantic-versioning): npm's reading of PATCH, MINOR and MAJOR, and the `^1.0.0` and `~2.2.0` range examples
- [Apple, Package.Dependency.package(url:from:traits:)](https://developer.apple.com/documentation/packagedescription/package/dependency/package(url:from:traits:).md): `from:` allows updates up to the next major version, so `from: "1.2.3"` selects 1.2.3, 1.2.4 and 1.3.0 but not 2.0.0
