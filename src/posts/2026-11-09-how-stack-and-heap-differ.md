---
title: "How the stack and the heap differ"
description: "The stack stores fixed-size values in last-in, first-out order. The heap holds data of any size, and you reach it through a pointer."
date: 2026-11-09
tags: [how-it-works, os]
status: ready
---

The stack and the heap are two places a program keeps data while it runs. The idea to keep: the stack is orderly and fast but needs a known size, while the heap is flexible but is reached through a pointer.

## The short version

The stack holds values in the order it gets them and removes them in the opposite order: last in, first out. Every value on it must have a known, fixed size. Data whose size is unknown at compile time, or can change, goes on the heap instead. There, an allocator finds a free spot big enough, marks it as in use and returns a pointer to it.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" width="640" height="260" role="img" aria-labelledby="t-sh d-sh" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-sh">Stack and heap side by side</title>
<desc id="d-sh">The stack on the left holds local variables, a fixed-size pointer and arguments, with push and pop at the top. The pointer leads to the heap on the right, which holds data of any size and is managed by an allocator that finds space and returns an address.</desc>
<defs><marker id="sh-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="sh-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<text x="120" y="32" text-anchor="middle" fill="#160572" font-weight="600">Stack (LIFO)</text>
<rect x="20" y="46" width="200" height="48" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="120" y="76" text-anchor="middle" fill="#160572" font-weight="600">local variables</text>
<rect x="20" y="110" width="200" height="48" rx="10" fill="#160572"/>
<text x="120" y="140" text-anchor="middle" fill="#ffffff" font-weight="600">pointer (fixed size)</text>
<rect x="20" y="174" width="200" height="48" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="120" y="204" text-anchor="middle" fill="#160572" font-weight="600">arguments</text>
<text x="120" y="246" text-anchor="middle" fill="#2c2c2c" font-size="13">push and pop at the top</text>
<rect x="410" y="20" width="210" height="52" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="515" y="42" text-anchor="middle" fill="#160572" font-weight="600">allocator</text>
<text x="515" y="60" text-anchor="middle" fill="#2c2c2c" font-size="12">finds space, returns address</text>
<rect x="410" y="104" width="210" height="64" rx="10" fill="#160572"/>
<text x="515" y="142" text-anchor="middle" fill="#ffffff" font-weight="600">Heap: data of any size</text>
<line x1="515" y1="74" x2="515" y2="102" stroke="#2544a0" stroke-width="2" marker-end="url(#sh-a)"/>
<line x1="222" y1="134" x2="408" y2="134" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#sh-b)"/>
<text x="315" y="124" text-anchor="middle" fill="#2c2c2c" font-size="13">follow the pointer</text>
</svg>
<figcaption>Simplified: stack values are pushed and popped in order; heap data is reached through a pointer.</figcaption>
</figure>

## Step by step

1. A function is called, and its arguments and local variables are pushed onto the stack.
2. Data of unknown or changing size asks the heap for space.
3. The allocator finds a free spot, marks it in use and returns its address.
4. A pointer has a fixed size, so it sits on the stack while the data sits on the heap.
5. When the function ends, its values are popped off the stack. Cleaning up heap data depends on the language: Go uses a garbage collector, Rust uses ownership.

| | Stack | Heap |
|---|---|---|
| Order | last in, first out | no fixed order |
| Size of each value | known and fixed | can be unknown or change |
| Adding data | push at the top, no search | allocator finds space, returns a pointer |
| Reading data | directly | follow a pointer, generally slower |

## Why it matters

The stack is simple and quick but needs a fixed size; the heap is flexible, but each use costs a search for space and a pointer to follow. Which one a variable lands in is often the language's call: in Go it is an implementation detail, and the compiler moves a variable to the heap when it cannot prove the stack is safe.

## Sources

- [What is Ownership? — The Rust Programming Language](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) — last in, first out, fixed size on the stack, allocation and pointers on the heap, push versus allocate, function calls
- [Go FAQ](https://go.dev/doc/faq) — "How do I know whether a variable is allocated on the heap or the stack?": placement is an implementation detail, and the compiler uses the heap when it cannot prove the variable is unused after the function returns
