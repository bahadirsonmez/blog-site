---
title: "How a CPU runs one instruction"
description: "A CPU gets the instruction its program counter points at, works out what it asks for, does it, and moves on. The loop is simplified, but it is the core idea."
date: 2026-10-30
tags: [how-it-works, hardware]
status: ready
---

A CPU runs a program one instruction at a time. The idea to keep: a register called the program counter points at an instruction, and the CPU fetches it, decodes it, executes it, then moves on.

## The short version

Arm describes its instructions with a simple model: the processor fetches an instruction, decodes it and executes it, in the order the instructions sit in memory. Real processors overlap these steps, so this is simplified, but they must give the same result as if they ran one at a time. In RISC-V, the program counter (pc) holds the address of the current instruction, and fetching it is an implicit read from memory.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" width="640" height="200" role="img" aria-labelledby="t-cpu d-cpu" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-cpu">The fetch, decode, execute loop</title>
<desc id="d-cpu">Four boxes in a row. The program counter points at an instruction. Fetch reads it from memory. Decode works out what it asks for. Execute does the work. A dashed arrow returns from execute to the program counter, which now points at the next instruction.</desc>
<defs><marker id="cpu-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="40" width="132" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="86" y="73" text-anchor="middle" fill="#160572" font-weight="600">pc</text>
<text x="86" y="94" text-anchor="middle" fill="#2c2c2c" font-size="13">points at it</text>
<rect x="176" y="40" width="132" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="242" y="73" text-anchor="middle" fill="#160572" font-weight="600">Fetch</text>
<text x="242" y="94" text-anchor="middle" fill="#2c2c2c" font-size="13">read from memory</text>
<rect x="332" y="40" width="132" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="398" y="73" text-anchor="middle" fill="#160572" font-weight="600">Decode</text>
<text x="398" y="94" text-anchor="middle" fill="#2c2c2c" font-size="13">which operation?</text>
<rect x="488" y="40" width="132" height="72" rx="10" fill="#160572"/>
<text x="554" y="73" text-anchor="middle" fill="#ffffff" font-weight="600">Execute</text>
<text x="554" y="94" text-anchor="middle" fill="#ffffff" font-size="13">do the work</text>
<line x1="154" y1="76" x2="174" y2="76" stroke="#2544a0" stroke-width="2" marker-end="url(#cpu-a)"/>
<line x1="310" y1="76" x2="330" y2="76" stroke="#2544a0" stroke-width="2" marker-end="url(#cpu-a)"/>
<line x1="466" y1="76" x2="486" y2="76" stroke="#2544a0" stroke-width="2" marker-end="url(#cpu-a)"/>
<path d="M554 114V152H86V114" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cpu-a)"/>
<text x="164" y="32" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="320" y="32" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="476" y="32" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
<text x="320" y="176" text-anchor="middle" fill="#2c2c2c" font-size="13">4 pc moves to the next instruction</text>
</svg>
<figcaption>Simplified: real CPUs overlap these steps, but behave as if they ran one at a time.</figcaption>
</figure>

## Step by step

1. The pc holds the address of the current instruction.
2. Fetch: the CPU reads that instruction from memory. In RV32I, every instruction is 32 bits and sits on a 4-byte boundary.
3. Decode: it works out which operation the bits ask for.
4. Execute: `ADD x3, x1, x2` reads x1 and x2 and writes the sum to x3, ignoring overflow. Only load and store instructions touch memory; arithmetic works on registers.
5. The pc moves to the next instruction. A jump can send it elsewhere: `JAL` adds an offset to its own address and saves pc+4 in a register to return to.

## Why it matters

This loop is why a program is a list: the order in memory is the order of work, until a jump says otherwise. Pipelines make the loop faster, not different: Arm requires the result to match the one-at-a-time model.

## Sources

- [Simple sequential execution — Arm A64 Instruction Set Architecture Guide](https://support.arm.com/documentation/102374/latest/Simple-sequential-execution) — fetch, decode, execute in order; real processors overlap steps but must match this model
- [RV32I Base Integer Instruction Set — RISC-V ISA manual](https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html) — the pc holds the current instruction's address, fixed 32-bit instructions on 4-byte boundaries, `ADD`, load/store, `JAL`
- [Introduction — RISC-V ISA manual](https://docs.riscv.org/reference/isa/v20260120/unpriv/intro.html) — instruction fetch is an implicit memory read
