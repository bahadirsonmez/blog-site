---
title: "How a hash chain shows tampering"
description: "A hash chain stores each record's hash inside the next record, so editing an old record breaks every later link and the change shows."
date: 2026-11-22
tags: [how-it-works, security]
status: draft
---

## Why this topic

Answers how a list of records can show that an old record was changed. Claims rest on NIST FIPS 180-4 (digests are used to detect changes), the Pro Git chapter on Git objects (objects are named by a hash of their content, a commit stores its parent's hash) and sections 3 and 4 of the Bitcoin white paper (chained timestamps, redoing proof-of-work). Simplified on purpose: three records and plain hashing; signatures, Merkle trees and the proof-of-work details are left out, and the diagram uses labels like "hash 1" instead of real hash values.

<!-- end why -->

A hash chain is a list of records where each record carries the hash of the record before it. Edit one record in the middle and every record after it stops matching.

## The short version

A hash function turns data into a digest, and if the data changes, the digest changes. That is why digests are used to detect changes (FIPS 180-4). In a chain, each record stores the previous record's hash next to its own data. Change record 2 and its hash changes, but record 3 still holds the old one, so the mismatch shows.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-labelledby="t-hc d-hc" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-hc">A hash chain of three records with one edited record</title>
<desc id="d-hc">Three records in a row. Record 1 holds data only, record 2 holds data plus hash 1, and record 3 holds data plus hash 2. Arrows carry each hash to the next record. Record 2 is edited, so its hash changes and no longer matches the copy stored in record 3, shown by a dashed arrow.</desc>
<defs><marker id="hc-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="hc-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="15" y="60" width="170" height="90" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="100" y="98" text-anchor="middle" fill="#160572" font-weight="600">Record 1</text>
<text x="100" y="122" text-anchor="middle" fill="#2c2c2c" font-size="13">data (first record)</text>
<rect x="235" y="60" width="170" height="90" rx="10" fill="#f2ebe6" stroke="#d98199" stroke-width="3"/>
<text x="320" y="98" text-anchor="middle" fill="#160572" font-weight="600">Record 2 (edited)</text>
<text x="320" y="122" text-anchor="middle" fill="#2c2c2c" font-size="13">data + hash 1</text>
<rect x="455" y="60" width="170" height="90" rx="10" fill="#160572"/>
<text x="540" y="98" text-anchor="middle" fill="#ffffff" font-weight="600">Record 3</text>
<text x="540" y="122" text-anchor="middle" fill="#ffffff" font-size="13">data + hash 2</text>
<line x1="187" y1="105" x2="233" y2="105" stroke="#2544a0" stroke-width="2" marker-end="url(#hc-a)"/>
<line x1="407" y1="105" x2="453" y2="105" stroke="#2544a0" stroke-width="2" marker-end="url(#hc-a)"/>
<path d="M320 152V200H540V152" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#hc-r)"/>
<text x="210" y="92" text-anchor="middle" fill="#2c2c2c" font-size="13">1 hash 1</text>
<text x="430" y="92" text-anchor="middle" fill="#2c2c2c" font-size="13">2 hash 2</text>
<text x="430" y="224" text-anchor="middle" fill="#2c2c2c" font-size="13">3 stored copy no longer matches</text>
</svg>
<figcaption>Simplified: three records, labels instead of real hashes; the dashed arrow is the mismatch.</figcaption>
</figure>

## Step by step

1. Hash record 1 to get hash 1.
2. Store hash 1 inside record 2, then hash record 2 (its data plus hash 1) to get hash 2. Repeat for every record.
3. To check the chain, recompute each hash and compare it with the copy stored in the next record.
4. An edited record produces a new hash, so the copy in the next record no longer matches.

## Why it matters

Git works like this: it names every object by a hash of its content, and a commit stores the hash of its parent. The Bitcoin white paper chains timestamps the same way, and changing one block would mean redoing the proof-of-work for that block and every block after it. My take: checking is one cheap pass of hashing, but a chain only shows tampering and cannot prevent it, and someone who rewrites every later record can make it look consistent unless you keep the latest hash somewhere you trust.

## Sources

- [FIPS 180-4, Secure Hash Standard (NIST)](https://csrc.nist.gov/pubs/fips/180-4/upd1/final): hash algorithms produce message digests that are used to detect whether a message has changed since the digest was generated
- [Git Internals, Git Objects (Pro Git)](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects): objects are named by a SHA-1 hash of their content, so changed content gets a new name, and a commit stores its parent commit's hash
- [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf): each timestamp includes the previous one in its hash (section 3), and changing a block means redoing the proof-of-work for it and all later blocks (section 4)
