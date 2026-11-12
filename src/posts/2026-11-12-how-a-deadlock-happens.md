---
title: "How a deadlock happens"
description: "A deadlock is two threads each holding a lock the other one needs. Neither can move, so the program hangs."
date: 2026-11-12
tags: [how-it-works, os]
status: ready
---

A deadlock is when threads wait on each other forever and the program stops. The idea to keep: each thread holds something the other one needs.

## The short version

Say Thread 1 holds Lock A and Thread 2 holds Lock B. Thread 1 now asks for Lock B, and Thread 2 asks for Lock A. Each waits for a lock its owner will not release, because the owner is waiting too. Nothing crashes, the program just stops moving. Whether it happens depends on thread timing, so it can show up only some of the time.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-labelledby="t-dl d-dl" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-dl">Two threads wait for each other's lock</title>
<desc id="d-dl">Thread 1 holds Lock A and Thread 2 holds Lock B. Thread 1 waits for Lock B and Thread 2 waits for Lock A, so the dashed arrows cross and neither thread can move.</desc>
<defs><marker id="dl-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="dl-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="60" y="30" width="150" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="135" y="64" text-anchor="middle" fill="#160572" font-weight="600">Thread 1</text>
<rect x="430" y="30" width="150" height="56" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="505" y="64" text-anchor="middle" fill="#160572" font-weight="600">Thread 2</text>
<rect x="60" y="170" width="150" height="56" rx="10" fill="#160572"/>
<text x="135" y="204" text-anchor="middle" fill="#ffffff" font-weight="600">Lock A</text>
<rect x="430" y="170" width="150" height="56" rx="10" fill="#160572"/>
<text x="505" y="204" text-anchor="middle" fill="#ffffff" font-weight="600">Lock B</text>
<line x1="135" y1="88" x2="135" y2="168" stroke="#2544a0" stroke-width="2" marker-end="url(#dl-a)"/>
<line x1="505" y1="88" x2="505" y2="168" stroke="#2544a0" stroke-width="2" marker-end="url(#dl-a)"/>
<line x1="195" y1="88" x2="445" y2="168" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#dl-b)"/>
<line x1="445" y1="88" x2="195" y2="168" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#dl-b)"/>
<text x="147" y="134" fill="#2c2c2c" font-size="13">1 holds</text>
<text x="517" y="134" fill="#2c2c2c" font-size="13">2 holds</text>
<text x="238" y="96" fill="#2c2c2c" font-size="13">3 waits</text>
<text x="402" y="96" text-anchor="end" fill="#2c2c2c" font-size="13">4 waits</text>
</svg>
<figcaption>Simplified: each thread holds one lock and waits for the other; neither can move.</figcaption>
</figure>

## Step by step

1. Thread 1 locks A.
2. Thread 2 locks B.
3. Thread 1 asks for B and waits.
4. Thread 2 asks for A and waits.
5. Neither lock is released, so neither thread runs again.

One thread can also deadlock itself, for example by relocking a normal POSIX mutex it already holds. In Swift, Apple's docs say a `sync` call that targets the queue it is already running on deadlocks:

```swift
let queue = DispatchQueue(label: "demo")
queue.sync {
    queue.sync { }
}
```

## Why it matters

The usual defense is to take locks in the same order everywhere, so the circle cannot form; the Linux kernel's lockdep tool checks for this. My reading: the rule is simple, but keeping it across a large codebase takes discipline, and in Swift `async` is the safer choice when you are unsure which queue you are on.

## Sources

- [The Java Tutorials: Deadlock](https://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html) — two threads blocked forever, each waiting for the other; the outcome depends on thread timing
- [pthread_mutex_lock (POSIX)](https://pubs.opengroup.org/onlinepubs/9799919799/functions/pthread_mutex_lock.html) — relocking a normal mutex from its owner deadlocks
- [DispatchQueue.sync(execute:)](https://developer.apple.com/documentation/dispatch/dispatchqueue/sync(execute:)-3segw) — a call that targets the current queue results in deadlock
- [Runtime locking correctness validator](https://docs.kernel.org/locking/lockdep-design.html) — taking locks in opposite orders (AB-BA) is a lock inversion deadlock; the validator finds it before it hangs
