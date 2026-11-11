---
title: "How a process differs from a thread"
description: "A process owns its memory. The threads inside it share that memory, and each thread keeps its own stack and registers."
date: 2026-11-11
tags: [how-it-works, os]
status: draft
---

## Why this topic

Answers "what is the difference between a process and a thread?" and follows the stack and heap post (each thread has its own stack, the heap is shared). Claims rest on Microsoft's process and thread overview, the Linux pthreads(7) page and the fork(2) page. Simplified on purpose: no inter-process communication, no context-switch cost, no green threads, and no copy-on-write detail (Linux implements fork that way, but the visible rule is separate memory). Windows and Linux terms are mixed only where both sources agree.

<!-- end why -->

A process is a running program together with the resources it needs. A thread is one line of execution inside it. The idea to keep: a process owns its memory, and the threads inside it share that memory.

## The short version

The operating system creates a process when a program starts. The process gets its own virtual address space, its code, open handles, a security context and a process ID, and it begins with one thread. That thread is what the system schedules to run. A program can start more threads. They share the process's address space and system resources, and each one has its own stack and registers.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-labelledby="t-pt d-pt" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-pt">Threads share memory inside a process</title>
<desc id="d-pt">Process A contains one shared box for the heap and open files and two thread boxes, each with its own stack, and both threads point to the shared box. Process B is a separate box with its own memory space. A dashed line between the two processes is labelled separate memory.</desc>
<defs><marker id="pt-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="pt-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="20" width="360" height="210" rx="12" fill="#ffffff" stroke="#160572" stroke-width="2"/>
<text x="40" y="46" fill="#160572" font-weight="600">Process A</text>
<rect x="40" y="60" width="320" height="52" rx="10" fill="#160572"/>
<text x="200" y="91" text-anchor="middle" fill="#ffffff" font-weight="600">Shared heap and files</text>
<rect x="40" y="150" width="150" height="60" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="115" y="176" text-anchor="middle" fill="#160572" font-weight="600">Thread 1</text>
<text x="115" y="196" text-anchor="middle" fill="#2c2c2c" font-size="13">own stack</text>
<rect x="210" y="150" width="150" height="60" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="285" y="176" text-anchor="middle" fill="#160572" font-weight="600">Thread 2</text>
<text x="285" y="196" text-anchor="middle" fill="#2c2c2c" font-size="13">own stack</text>
<line x1="115" y1="148" x2="115" y2="114" stroke="#2544a0" stroke-width="2" marker-end="url(#pt-a)"/>
<line x1="285" y1="148" x2="285" y2="114" stroke="#2544a0" stroke-width="2" marker-end="url(#pt-a)"/>
<rect x="470" y="20" width="150" height="210" rx="12" fill="#ffffff" stroke="#160572" stroke-width="2"/>
<text x="490" y="46" fill="#160572" font-weight="600">Process B</text>
<rect x="490" y="70" width="110" height="140" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="136" text-anchor="middle" fill="#160572" font-weight="600">Own memory</text>
<text x="545" y="156" text-anchor="middle" fill="#160572" font-weight="600">space</text>
<line x1="383" y1="125" x2="467" y2="125" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-start="url(#pt-b)" marker-end="url(#pt-b)"/>
<text x="425" y="113" text-anchor="middle" fill="#2c2c2c" font-size="13">separate</text>
<text x="425" y="148" text-anchor="middle" fill="#2c2c2c" font-size="13">memory</text>
</svg>
<figcaption>Simplified: the threads of Process A share one heap and its open files, while Process B has a memory space of its own.</figcaption>
</figure>

## Step by step

1. The system creates a process with its own address space and one primary thread.
2. The program starts more threads when it wants work to run side by side.
3. All threads in the process see the same heap and the same open files.
4. Each thread has its own stack and registers, so each one tracks its own place in the code.
5. A second process gets a separate memory space: after a fork, a write in one does not appear in the other.

| | Process | Thread |
|---|---|---|
| Memory | Its own address space | Shares the address space of its process |
| Stack and registers | One set per thread | Its own |
| Open files | Belong to the process | Shared by all threads of that process |
| Scheduled by the system | Through its threads | Yes, the unit that gets scheduled |

## Why it matters

My reading: shared memory makes handing data between threads easy, and it also means one thread's write is visible to all the others. Separate processes cannot overwrite each other's memory.

## Sources

- [About processes and threads](https://learn.microsoft.com/en-us/windows/win32/procthread/about-processes-and-threads) — what a process owns, the primary thread, threads sharing the address space and system resources, thread context (registers and stack)
- [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html) — threads share global memory (data and heap), process ID and open file descriptors; each thread has its own stack
- [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html) — parent and child run in separate memory spaces; a write by one does not affect the other
