---
title: "How a compiler turns code into machine code"
description: "A compiler turns source code into machine code in stages: a front end, an optimizer and a back end joined by a shared form, then a linker."
date: 2026-11-10
tags: [how-it-works, apple-dev]
status: ready
---

A processor cannot run Swift or C source code; it runs machine instructions. A compiler translates one into the other in stages, and the idea to keep is that every stage hands a simpler form to the next.

## The short version

A compiler is usually described in three parts. The front end reads your source, reports errors and builds a syntax tree (AST) for that language. The optimizer improves the code, mostly independent of the language and the machine. The back end maps the code to the instruction set of one processor. Between them sits a shared intermediate representation (IR): LLVM IR, for example, is a low-level, strongly typed virtual instruction set.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" width="640" height="240" role="img" aria-labelledby="t-cm d-cm" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-cm">From source code to executable</title>
<desc id="d-cm">Source code goes to the front end, which produces the intermediate representation. The optimizer improves it, the back end produces machine code for one processor, and the linker combines the result into an executable.</desc>
<defs><marker id="cm-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="30" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="67" text-anchor="middle" fill="#160572" font-weight="600">Source code</text>
<rect x="245" y="30" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="67" text-anchor="middle" fill="#160572" font-weight="600">Front end</text>
<rect x="470" y="30" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="67" text-anchor="middle" fill="#160572" font-weight="600">IR</text>
<rect x="470" y="150" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="187" text-anchor="middle" fill="#160572" font-weight="600">Optimizer</text>
<rect x="245" y="150" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="187" text-anchor="middle" fill="#160572" font-weight="600">Back end</text>
<rect x="20" y="150" width="150" height="64" rx="10" fill="#160572"/>
<text x="95" y="187" text-anchor="middle" fill="#ffffff" font-weight="600">Executable</text>
<line x1="172" y1="62" x2="243" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#cm-a)"/>
<line x1="397" y1="62" x2="468" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#cm-a)"/>
<line x1="545" y1="96" x2="545" y2="148" stroke="#2544a0" stroke-width="2" marker-end="url(#cm-a)"/>
<line x1="468" y1="182" x2="397" y2="182" stroke="#2544a0" stroke-width="2" marker-end="url(#cm-a)"/>
<line x1="243" y1="182" x2="172" y2="182" stroke="#2544a0" stroke-width="2" marker-end="url(#cm-a)"/>
<text x="207" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">1 read</text>
<text x="432" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">2 lower</text>
<text x="557" y="127" text-anchor="start" fill="#2c2c2c" font-size="13">3 improve</text>
<text x="432" y="172" text-anchor="middle" fill="#2c2c2c" font-size="13">4 emit</text>
<text x="207" y="172" text-anchor="middle" fill="#2c2c2c" font-size="13">5 link</text>
</svg>
<figcaption>Simplified: each arrow hands a simpler form to the next stage; the last one links the pieces into one file.</figcaption>
</figure>

## Step by step

1. The front end parses the source, reports mistakes and builds the AST.
2. The AST is lowered to the IR. Swift adds a layer here: its own IR, called SIL, comes first, then LLVM IR.
3. The optimizer rewrites the IR to improve it.
4. The back end turns the IR into machine code for one instruction set.
5. The linker joins the pieces into one executable.

GCC can stop after each stage:

| Flag | Stops after | You get |
|---|---|---|
| `-E` | preprocessing | preprocessed source on standard output |
| `-S` | compiling | an assembly file (`.s`) |
| `-c` | assembling | an object file (`.o`) |
| none | linking | an executable (`a.out`) |

## Why it matters

Because the IR is shared, a new language needs only a new front end and a new processor only a new back end. Without it, every pair of language and processor would need its own compiler.

## Sources

- [Overall Options — GCC documentation](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html) — the order of stages, what `-E`, `-S` and `-c` stop at, and that linking produces `a.out` by default
- [LLVM — The Architecture of Open Source Applications](https://aosabook.org/en/v1/llvm.html) — front end, optimizer and back end, the shared IR, and the language-times-target argument
- [Swift Compiler — swift.org](https://www.swift.org/documentation/swift-compiler/) — parsing to AST, type checking, SIL, then LLVM IR
