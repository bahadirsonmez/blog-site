---
title: "How an SSD stores data"
description: "Flash memory cannot overwrite data in place, so an SSD's controller erases whole blocks, spreads the wear and hides it all from the operating system."
date: 2026-10-30
tags: [how-it-works, hardware]
status: ready
---

An SSD stores data in flash memory, and flash cannot overwrite a block in place the way a hard disk can. The idea to keep: a controller inside the drive hides that rule and spreads the wear, so the operating system sees an ordinary disk.

## The short version

Flash must erase a whole erase block before it can be written again, and erase blocks are large. Each erase wears the block a little, and some blocks go bad. Bootlin's overview of managed flash says the controller deals with erasing, wear leveling and bad blocks, while the operating system sees an emulated block device. How exactly a drive does this is usually the vendor's secret.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" width="640" height="220" role="img" aria-labelledby="t-ssd d-ssd" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-ssd">How an SSD hides flash rules from the operating system</title>
<desc id="d-ssd">Three boxes in a row: Operating system, Controller and Flash memory. Arrow 1 goes from the operating system to the controller as a write. Arrow 2 goes from the controller to the flash memory, which must erase a block before writing it again. A dashed arrow 3 goes from the operating system to the controller to tell it which blocks are unused, called TRIM.</desc>
<defs><marker id="ssd-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="70" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="99" text-anchor="middle" fill="#160572" font-weight="600">Operating system</text>
<text x="95" y="120" text-anchor="middle" fill="#2c2c2c" font-size="13">sees a block device</text>
<rect x="245" y="70" width="150" height="64" rx="10" fill="#160572"/>
<text x="320" y="99" text-anchor="middle" fill="#ffffff" font-weight="600">Controller</text>
<text x="320" y="120" text-anchor="middle" fill="#ffffff" font-size="13">hides the flash rules</text>
<rect x="470" y="70" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="99" text-anchor="middle" fill="#160572" font-weight="600">Flash memory</text>
<text x="545" y="120" text-anchor="middle" fill="#2c2c2c" font-size="13">erase, then write</text>
<line x1="172" y1="92" x2="243" y2="92" stroke="#2544a0" stroke-width="2" marker-end="url(#ssd-a)"/>
<line x1="397" y1="92" x2="468" y2="92" stroke="#2544a0" stroke-width="2" marker-end="url(#ssd-a)"/>
<path d="M95 136V176H320V138" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ssd-a)"/>
<text x="207" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">1 write</text>
<text x="432" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">2 erase</text>
<text x="207" y="200" text-anchor="middle" fill="#2c2c2c" font-size="13">3 TRIM: unused blocks</text>
</svg>
<figcaption>Simplified: real controllers differ, and their algorithms are often the vendor's secret.</figcaption>
</figure>

## Step by step

1. A hard disk can overwrite a block in place. Raw flash cannot.
2. Flash must erase a whole block before writing it again (see the table).
3. Each erase wears the block. Dense NAND may manage only a few thousand.
4. Wear leveling spreads erases so no block dies far ahead of the rest, for example by swapping a heavily written block with a rarely used one.
5. The controller also manages bad blocks, so the operating system does not have to.
6. TRIM lets the file system tell the drive which blocks are unused.

| | Hard disk block | Flash erase block |
|---|---|---|
| Rewrite | overwritten in place | erased first |
| Typical size | 512 bytes | about 128 KiB (example) |
| Bad blocks | usually hidden by hardware | must be handled by software or the controller |

## Why it matters

The upside is that the operating system needs no special handling for flash. The downside is that every erase uses up some of a block's life and the wear logic is hidden. Running `fstrim` weekly is enough for most desktops and servers, but trimming constantly can shorten the life of low-quality SSDs.

## Sources

- [UBIFS — Linux kernel documentation](https://docs.kernel.org/filesystems/ubifs.html) — erase before rewrite, erase block size, block device block size, limited erase cycles, bad blocks on NAND
- [Managing flash storage with Linux — Bootlin](https://bootlin.com/blog/managing-flash-storage-with-linux/) — managed flash (controller does erasing, wear leveling and bad blocks, emulated block device), swapping hot and cold blocks, vendor-specific algorithms
- [fstrim(8) — Linux man page](https://man7.org/linux/man-pages/man8/fstrim.8.html) — TRIM discards unused blocks, weekly is enough for most systems, constant trimming and low-quality SSDs
