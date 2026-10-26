---
title: "The OLED iPad mini: what to check in your app"
description: "Apple announced an iPad mini with an 8.5-inch OLED screen. What Apple has published, what it has not, and what I would check in an iPad layout."
date: 2026-10-26
tags: [apple-ecosystem]
status: draft
---

## Why this topic

Why now: Apple announced the iPad mini with an 8.5-inch OLED display and the A20 Pro chip on October 26, 2026. Pre-orders open October 28 and it reaches stores November 6. Search question it answers: "does the new iPad mini change anything for my app, and what should I check before it ships?". Claims rest on Apple's Newsroom post and its iPad mini specs and store pages, on MacRumors for the refresh rate reading and the earlier price, on the Xcode 27.2 release notes for the simulator, and on the App Store Connect screenshot specifications. Left out on purpose, because Apple has not published them: the size in points and the scale factor, the refresh rate, the OLED panel type, the RAM, the safe area and corner radius, and a simulator device. The post says "not published" for each of these instead of guessing. The publish slot is today, 15:00 Turkey time, 14:00 Berlin.

<!-- end why -->

Apple announced a new iPad mini today with an 8.5-inch OLED display. For app developers the chip is the smaller story: the screen is new, and Apple has not yet published the numbers a layout depends on.

## What Apple has published

Apple's Newsroom post calls it the biggest iPad mini update ever. The display is an 8.5-inch Super Retina XDR OLED, up from 8.3 inches on the previous LCD model, in the same footprint with bezels about 24 percent thinner. Apple's specs page lists 2316 by 1512 pixels at 326 pixels per inch. As a sanity check, the diagonal of that grid at that density comes out at about 8.5 inches, so the numbers agree with each other. Apple also notes that the size is measured with the rounded corners included.

On the panel itself, Apple gives a peak of 1,200 nits for HDR, 600 nits for full-screen content, a minimum of 1 nit and a 2,000,000:1 contrast ratio. It supports wide color (P3), True Tone and Apple Pencil hover, and there is an optional nano-texture glass on the 256 GB and 512 GB models.

The chip is the A20 Pro, with a 16-core Neural Engine. Apple's own comparison with the A17 Pro claims up to 60 percent faster multi-core CPU work and about 2.7 times the graphics speed. That is Apple's testing, not an independent measurement.

Pre-orders start October 28 and the iPad mini reaches stores November 6. Apple's store page lists the Wi-Fi model from $699 with 128 GB. MacRumors writes that this is $100 more than the previous base model at $599, the second price increase this year. I could only find that comparison in MacRumors, so I treat it as reported, not as something Apple has confirmed.

The Newsroom post does not announce a new developer API or SDK. It only mentions a few apps as examples of what the chip can do.

## What Apple has not published yet

This is the part that matters for layout work, and it is a long list. As of October 26, I could not find any of these in Apple's pages or documentation:

- **Size in points and scale factor.** Apple gives pixels and pixels per inch, not the logical size your SwiftUI or UIKit layout sees.
- **Safe area and corner radius.** The specs page only says the display has rounded corners.
- **Refresh rate.** Apple's pages do not state one and do not mention ProMotion. MacRumors reads the spec sheet as meaning 60 Hz, but that is an inference from something missing, not a figure from Apple.
- **Panel type and RAM.** Neither appears in Apple's pages.
- **A simulator device.** The Xcode 27.2 release candidate notes do not mention a new iPad mini.
- **A screenshot size class.** I come back to this below.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 190" width="640" height="190" role="img" aria-labelledby="t-mini d-mini" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-mini">The OLED iPad mini on October 26: known, unknown, to check</title>
<desc id="d-mini">Three boxes from left to right. The first lists what Apple published: an 8.5 inch OLED, 2316 by 1512 pixels at 326 ppi, in stores November 6. The second lists what Apple has not published: point size and safe area, refresh rate and RAM, a simulator device and a screenshot class. The third lists what to check in your app: size classes, safe area insets and fixed size assumptions.</desc>
<defs><marker id="mini-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="25" width="170" height="140" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="56" text-anchor="middle" fill="#160572" font-weight="600">Apple published</text>
<text x="105" y="84" text-anchor="middle" fill="#2c2c2c" font-size="13">8.5 in OLED</text>
<text x="105" y="104" text-anchor="middle" fill="#2c2c2c" font-size="13">2316 x 1512, 326 ppi</text>
<text x="105" y="124" text-anchor="middle" fill="#2c2c2c" font-size="13">in stores Nov 6</text>
<rect x="235" y="25" width="170" height="140" rx="10" fill="#160572"/>
<text x="320" y="56" text-anchor="middle" fill="#ffffff" font-weight="600">Not published yet</text>
<text x="320" y="84" text-anchor="middle" fill="#ffffff" font-size="13">point size, safe area</text>
<text x="320" y="104" text-anchor="middle" fill="#ffffff" font-size="13">refresh rate, RAM</text>
<text x="320" y="124" text-anchor="middle" fill="#ffffff" font-size="13">simulator device</text>
<text x="320" y="144" text-anchor="middle" fill="#ffffff" font-size="13">screenshot class</text>
<rect x="450" y="25" width="170" height="140" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="56" text-anchor="middle" fill="#160572" font-weight="600">Check in your app</text>
<text x="535" y="84" text-anchor="middle" fill="#2c2c2c" font-size="13">size classes</text>
<text x="535" y="104" text-anchor="middle" fill="#2c2c2c" font-size="13">safe area insets</text>
<text x="535" y="124" text-anchor="middle" fill="#2c2c2c" font-size="13">fixed-size assumptions</text>
<line x1="192" y1="95" x2="233" y2="95" stroke="#2544a0" stroke-width="2" marker-end="url(#mini-a)"/>
<line x1="407" y1="95" x2="448" y2="95" stroke="#2544a0" stroke-width="2" marker-end="url(#mini-a)"/>
</svg>
<figcaption>What Apple has published about the new iPad mini, what is still open as of October 26, and where I would look in an app.</figcaption>
</figure>

## About the App Store screenshots

App Store Connect currently requires 13-inch iPad screenshots, and it lists the previous iPad mini, the A17 Pro model, under the 11-inch class, with the other sizes scaled from the 13-inch set. The page does not list the new 8.5-inch model as of today. Whether it gets its own class, or lands in an existing one, is not stated anywhere I could check.

## My suggestions, not facts

Everything below is my reading of the situation, not something Apple has said.

1. **Do not hard-code a point size yet.** Until the iPad mini is in someone's hands or in a simulator, any number in points is a guess. When a device or simulator is available, log the real size from `GeometryProxy` or the window, together with the safe area insets and the size classes, and design against those.
2. **Lean on size classes and safe area, not on device checks.** A layout that adapts to the space it gets should not care what the screen is called. A layout that assumes a fixed width or a fixed corner inset is the kind that breaks on a new size. Run it on the other iPad sizes in both orientations in the meantime.
3. **Do not build around a refresh rate.** Apple has not stated one. If you need to know it, read it from the screen on the device, for example with `UIScreen.maximumFramesPerSecond`, rather than assuming.
4. **Look at dark screens on OLED.** Apple gives a 2,000,000:1 contrast ratio and a 1 nit minimum. I would check dark mode, low-brightness reading and bright HDR content by eye. I would not claim any battery saving from dark themes on this iPad, because Apple does not say so.
5. **Wait on the screenshots.** The current table has no class for the new model, so regenerating a set now could mean doing it twice. I would look at the page again when Apple updates it.

## Sources

- [Apple gives iPad mini its biggest update ever — Apple Newsroom](https://www.apple.com/newsroom/2026/10/apple-gives-ipad-mini-its-biggest-update-ever/) — the OLED display, 8.5 inches, thinner bezels, the A20 Pro, the dates, and that no developer API is announced
- [iPad mini technical specifications — Apple](https://www.apple.com/ipad-mini/specs/) — 2316 x 1512 at 326 ppi, the rounded corners note, the brightness and contrast figures, no refresh rate or RAM listed
- [Buy iPad mini — Apple Store](https://www.apple.com/shop/buy-ipad/ipad-mini) — the Wi-Fi model from $699, the nano-texture option
- [Apple announces iPad mini with OLED display — MacRumors](https://www.macrumors.com/2026/10/26/apple-announces-ipad-mini-with-oled-display/) — the announcement coverage, the reading that the screen appears to stay at 60 Hz
- [OLED iPad mini second price hike of 2026 — MacRumors](https://www.macrumors.com/2026/10/26/oled-ipad-mini-second-price-hike-2026/) — the previous base model at $599 and the second increase this year
- [OLED iPad mini pre-orders and launch date — MacRumors](https://www.macrumors.com/2026/10/26/oled-ipad-mini-pre-orders-launch-date/) — pre-orders on October 28 and the November 6 launch
- [Xcode 27.2 release notes — Apple](https://developer.apple.com/documentation/xcode-release-notes/xcode-27_2-release-notes.md) — no new iPad mini device in the release candidate notes
- [Screenshot specifications — App Store Connect Help](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/) — the required 13-inch iPad screenshots and the 11-inch class that lists the previous iPad mini

## LinkedIn

📱 The new iPad mini has an 8.5-inch OLED screen, and Apple has not published its size in points yet.

The spec sheet gives pixels, but a few things for #iOSDevelopment are still open:
- safe area and refresh rate are not published
- no new device in the Xcode 27.2 RC notes
- My take, not fact: measure on a device before changing layouts, and keep #iPadOS screens flexible 🧩

Details and a diagram on the blog:
https://blog.bahadirsonmez.com/posts/ipad-mini-oled-what-to-check/?utm_source=linkedin&utm_medium=social&utm_campaign=ipad-mini-oled-what-to-check
