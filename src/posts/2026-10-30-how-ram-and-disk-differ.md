---
title: "How RAM and disk differ"
description: "RAM is temporary working space and disk keeps files. A page cache in RAM sits between them, which is why a second read of a file skips the slow disk."
date: 2026-10-30
tags: [how-it-works, hardware]
status: ready
---

RAM is the temporary workspace a computer uses while programs run, and disk is where files stay. The idea to keep: a program works on a copy of its data in RAM, and the computer moves data between the two.

## The short version

The Linux kernel documentation calls physical memory volatile: what is in RAM does not survive without power, so most of it was read in from files. When a file is read, the kernel keeps its data in memory, in the page cache, so the next read skips the slow disk. Writes go to that cache first and reach the disk later. Apple's archived guide agrees on the cost: reading a page from disk is much slower than reading it from RAM.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" width="640" height="220" role="img" aria-labelledby="t-ram d-ram" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-ram">How a file read and write moves between disk and RAM</title>
<desc id="d-ram">Three boxes in a row: Disk, RAM as page cache, and Program. Arrow 1 goes from Disk to RAM when a file is read. Arrow 2 goes from RAM to the program for later reads. A dashed arrow 3 goes from RAM back to Disk, because changed pages are written later.</desc>
<defs><marker id="ram-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="70" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="99" text-anchor="middle" fill="#160572" font-weight="600">Disk</text>
<text x="95" y="120" text-anchor="middle" fill="#2c2c2c" font-size="13">kept without power</text>
<rect x="245" y="70" width="150" height="64" rx="10" fill="#160572"/>
<text x="320" y="99" text-anchor="middle" fill="#ffffff" font-weight="600">RAM (page cache)</text>
<text x="320" y="120" text-anchor="middle" fill="#ffffff" font-size="13">temporary, limited</text>
<rect x="470" y="70" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="99" text-anchor="middle" fill="#160572" font-weight="600">Program</text>
<text x="545" y="120" text-anchor="middle" fill="#2c2c2c" font-size="13">reads and writes</text>
<line x1="172" y1="92" x2="243" y2="92" stroke="#2544a0" stroke-width="2" marker-end="url(#ram-a)"/>
<line x1="397" y1="92" x2="468" y2="92" stroke="#2544a0" stroke-width="2" marker-end="url(#ram-a)"/>
<path d="M320 136V176H95V138" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ram-a)"/>
<text x="207" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">1 read</text>
<text x="432" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">2 use</text>
<text x="207" y="200" text-anchor="middle" fill="#2c2c2c" font-size="13">3 changed pages are written later</text>
</svg>
<figcaption>Simplified: virtual memory and swap are left out.</figcaption>
</figure>

## Step by step

1. A file sits on disk.
2. A program reads it, and its data is copied into RAM, in the page cache.
3. Later reads of the same data come from RAM, not from the disk.
4. A change is made in RAM first, and the changed page is marked dirty.
5. The kernel writes dirty pages to the storage device later, before it reuses the page.
6. RAM has a fixed size. When it runs short, the system drops cached pages or writes them out, and reads them back from disk when needed.

## Why it matters

A first read can be slower than the ones after it, and a change you just made may not be on disk yet. Think of RAM as the desk you work at and the disk as the cabinet: the desk is quick but small and gets cleared, the cabinet is slower and keeps things.

## Sources

- [Concepts overview — Linux kernel documentation](https://docs.kernel.org/admin-guide/mm/concepts.html) — volatile physical memory, the page cache, dirty pages written to the storage device later, limited RAM and reclaim
- [About the Virtual Memory System — Apple, Memory Usage Performance Guidelines (archive, 2013)](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/ManagingMemory/Articles/AboutMemory.html) — reading a page from disk is much slower than reading it from RAM
