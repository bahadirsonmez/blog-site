---
title: "Touch on Mac: what to check in your app"
description: "Apple announced a MacBook Pro with Touch. Many Mac apps work as they are; custom mouse code gets one-finger emulation. What Apple says to check."
date: 2026-10-29
tags: [apple-dev]
status: draft
---

## Why this topic

Why now: on October 28, 2026 Apple announced the 14 and 16 inch MacBook Pro with PROLED XDR Display, the first Mac with Touch, and published developer material the same day: a "Get ready for Touch on Mac" page, three Tech Talks, a gesture recognizer article and Group Labs. Pre-orders are open and deliveries start November 6, and Xcode 27.3 beta is still marked "Coming soon", so the preparation window is open right now. Search question it answers: "will my Mac app work on a touch screen, and which code do I check first?". Claims rest on Apple's Newsroom post, the Apple Developer news and Touch on Mac pages, the "Adopting gesture recognizers in your app" article and the Tech Talks. Left out on purpose: the touchscreen MacBook rumors that circulated before the announcement, and hardware details that do not matter for app code. No app call to action: the topic does not fit one of the apps. The publish slot is Friday 15:00 Turkey time, 14:00 Berlin.

<!-- end why -->

Apple announced a MacBook Pro with Touch, the first Mac with a touch display, and says many existing apps will work on it right away. The code that deserves a look is the code that does not: custom mouse handling gets only a one-finger emulation, and hover has no touch equivalent.

<figure><img src="/assets/posts/touch-on-mac-what-to-check/img-1.jpg" alt="A person seated at a table touching the screen of an open MacBook Pro with PROLED XDR Display" loading="lazy"><figcaption>Image: <a href="https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/">Apple Newsroom</a></figcaption></figure>

## In short

- Apple announced the 14 and 16 inch MacBook Pro with PROLED XDR Display. Touch is built into the panel and is built for macOS 27.
- macOS translates touches into clicks, so many existing apps work right away. The updated system gesture APIs are for experiences designed for touch.
- Standard AppKit controls and gesture recognizers need no changes. Custom mouse tracking runs on a one-finger emulation only.
- You can test without the hardware: an iPad connected through Sidecar sends input down the same path.

## Then and now

Apple describes Touch as new to the Mac, with the sensor inside the display panel instead of layered on top, which Apple says reduces latency. Until the hardware is in your hands, the documentation suggests Sidecar: input from a connected iPad follows the same path as input on a Mac with a touch display.

The timeline looks a lot like the iPhone Duo preparation earlier this month, as the table shows.

| | iPhone Duo | MacBook Pro with Touch |
|---|---|---|
| Developer news post | October 5 | October 28 |
| Devices available | October 23 | November 6 (deliveries start) |
| Group Labs | not checked | November 18 and 19 |
| Xcode support | not checked | 27.3 beta, "Coming soon" |

Same pattern: developer news first, hardware afterwards, videos and labs in between. I covered the first one in [Is your iPhone app ready for iPhone Duo?](https://blog.bahadirsonmez.com/posts/prepare-your-app-for-iphone-duo/), where Apple's advice came down to not assuming what the screen tells you about your app's shape. My take, not Apple's words: Touch asks for a similar habit, which is not assuming the pointer is a mouse.

## What works as it is

The page to read is Apple's "Adopting gesture recognizers in your app". Gesture recognizers are the shared input model across AppKit, SwiftUI and Mac Catalyst, and they cover the mouse, a Sidecar iPad and a Mac with a touch display. The table below sums up what the article says about each kind of code.

| Your code | What happens with Touch |
|---|---|
| Standard AppKit controls | work without changes |
| Gesture recognizers | work without changes; the only way to receive multi-finger gestures and individual touches |
| `mouseDown(with:)` overrides and tracking loops | AppKit emulates one-finger tap and drag; no multi-finger input |
| `NSButton` or `NSSlider` subclass overriding a mouse method | AppKit falls back to the tracking loop |
| Custom `NSGestureRecognizer` that never reaches a terminal state | the app can look frozen |
| Hover with `mouseMoved(with:)` and `NSTrackingArea` | pointer input only; there is no hover on a touch display |
| Swipes handled with `trackSwipeEvent` | not translated by AppKit; your code has to handle them |

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 264" width="640" height="264" role="img" aria-labelledby="t-touch d-touch" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-touch">What your Mac code does on a MacBook Pro with Touch</title>
<desc id="d-touch">Three rows, each with an arrow from a kind of code to what happens on a touch Mac. Standard controls and gesture recognizers need no change. mouseDown overrides and tracking loops get one-finger emulation with no multi-finger input. Hover handlers get pointer input only, with no hover on touch.</desc>
<defs><marker id="touch-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="24" width="250" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="145" y="52" text-anchor="middle" fill="#160572" font-weight="600">Standard controls</text>
<text x="145" y="72" text-anchor="middle" fill="#2c2c2c" font-size="13">and gesture recognizers</text>
<rect x="370" y="24" width="250" height="64" rx="10" fill="#160572"/>
<text x="495" y="52" text-anchor="middle" fill="#ffffff" font-weight="600">No change needed</text>
<text x="495" y="72" text-anchor="middle" fill="#ffffff" font-size="13">work with touch as they are</text>
<line x1="272" y1="56" x2="368" y2="56" stroke="#2544a0" stroke-width="2" marker-end="url(#touch-a)"/>
<rect x="20" y="100" width="250" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="145" y="128" text-anchor="middle" fill="#160572" font-weight="600">mouseDown overrides</text>
<text x="145" y="148" text-anchor="middle" fill="#2c2c2c" font-size="13">and tracking loops</text>
<rect x="370" y="100" width="250" height="64" rx="10" fill="#160572"/>
<text x="495" y="128" text-anchor="middle" fill="#ffffff" font-weight="600">One-finger emulation</text>
<text x="495" y="148" text-anchor="middle" fill="#ffffff" font-size="13">no multi-finger input</text>
<line x1="272" y1="132" x2="368" y2="132" stroke="#2544a0" stroke-width="2" marker-end="url(#touch-a)"/>
<rect x="20" y="176" width="250" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="145" y="204" text-anchor="middle" fill="#160572" font-weight="600">Hover handlers</text>
<text x="145" y="224" text-anchor="middle" fill="#2c2c2c" font-size="13">mouseMoved, NSTrackingArea</text>
<rect x="370" y="176" width="250" height="64" rx="10" fill="#160572"/>
<text x="495" y="204" text-anchor="middle" fill="#ffffff" font-weight="600">Pointer input only</text>
<text x="495" y="224" text-anchor="middle" fill="#ffffff" font-size="13">no hover on touch</text>
<line x1="272" y1="208" x2="368" y2="208" stroke="#2544a0" stroke-width="2" marker-end="url(#touch-a)"/>
</svg>
<figcaption>Three kinds of Mac input code and what each gets on a touch display, following Apple's gesture recognizer article.</figcaption>
</figure>

Two details the table cannot show. For embedded UI frameworks that have no touch support of their own, Apple's article describes an automatic mouse emulation: a tap becomes mouse down and up, touch and drag becomes a trackpad scroll, press and hold becomes a right click, and a two-finger pinch or rotate becomes a trackpad magnify or rotate. The emulation stops at one or two fingers. A framework that adds its own touch support can switch the extra emulation off with the `NSIsTouchNative` Info.plist key.

The second detail is new in macOS 27 and later. Instead of overriding a mouse method, you can add a target-action for tracking events in `NSControl.Events`, with `@objc` actions. If you only need the action to fire, `primaryActionTriggered` is enough.

## What I would search for first

Apple's own search list is short, and it is a good place to begin:

- `nextEvent(matching:until:inMode:dequeue:)` and `trackEvents(matching:timeout:mode:handler:)`, the tracking loops.
- Overrides of `mouseDown(with:)` and `mouseDragged(with:)`.
- `currentEvent` inside control actions. It no longer reliably returns the event that started the action; read `modifierFlags` and `pressedMouseButtons` instead.
- Hover code. It only fires for a pointer, so anything a user must reach by touch needs another route.
- Swipes. AppKit does not translate touch swipes for you, and for full-page navigation swipes Apple says to check `isTouchSwipeNavigationEnabled`.

To add touch to an existing tracking loop, the article suggests a gesture recognizer made for touch. Setting `buttonMask = 0` makes it recognize touches only, so the mouse and trackpad stay in the loop.

On target sizes: the "Bring Touch to your Mac app" Tech Talk has a section on expanding hit targets, and a code comment in its sample expands to a minimum of 36 points on each axis. That is a comment in a sample, not a published guideline value, so I treat it as an example. The test checklist in the article also asks you to make sure small targets, such as resize handles, are easy to hit with a finger.

The other two talks cover the design side and one adjacent feature. "Design for Touch on Mac" goes through touch interactions, custom and system gestures, hover actions and expanding controls. "Bring Live Activities to Mac" shows ActivityKit for the menu bar and Dynamic Island appearances, and Apple's announcement says Dynamic Island is coming to Mac for Spotlight, Live Activities and Siri AI.

## The good and the not-so-good

Good:

- Many existing apps work right away, because macOS translates touches into clicks (Apple).
- Standard controls and gesture recognizers need no changes (Apple's article).
- You can test with Sidecar, without a touch Mac.
- Mouse, trackpad and keyboard keep working next to touch.

Not so good:

- Mouse tracking code gets a one-finger emulation, with no multi-finger gestures or individual touches.
- Hover does not exist on touch, swipes are not translated, and `currentEvent` is no longer a safe way to read the starting event.
- Xcode 27.3 beta is still "Coming soon", and Apple's footnote says the third-party apps it names will be available later this year.
- Apple's pages give no hit target size to design against, apart from that code comment.

## What I would do

My suggestions, not facts:

1. Search the codebase for the list above before anything else. That is where touch behaviour can differ from the mouse.
2. Run the app with Sidecar and go through every window, sheet and popover with a finger, following Apple's checklist: tap the controls, drag, select and scroll with one finger, try pinch and rotate, hit the small targets.
3. Where a tracking loop needs more than one finger, move that part to a gesture recognizer.
4. Do not put anything essential behind hover.
5. If something stays unclear, the Group Labs are the place to ask.

## Sources

- [Say hello to Touch on Mac — Apple Developer News](https://developer.apple.com/news/?id=i9boeiqc) — the announcement for developers: new videos, Group Labs and articles
- [Get ready for Touch on Mac — Apple Developer](https://developer.apple.com/touch-on-mac/) — the three Tech Talks, the Group Labs dates, Xcode 27.3 beta "Coming soon", the documentation links
- [Apple unveils groundbreaking MacBook Pro with PROLED XDR Display — Apple Newsroom](https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/) — Touch on Mac, the sensor in the panel, macOS translating touches into clicks, the pre-order and delivery dates, Dynamic Island on Mac, the "later this year" footnote
- [Adopting gesture recognizers in your app — Apple Developer Documentation](https://developer.apple.com/documentation/appkit/adopting-gesture-recognizers-in-your-app) — the behaviour table, emulation, `currentEvent`, hover, swipes, Sidecar testing, `NSIsTouchNative`, the macOS 27 target-action change
- [Bring Touch to your Mac app — Apple Tech Talks](https://developer.apple.com/videos/play/tech-talks/111468/) — touch across frameworks, gesture recognizers, hit targets (the 36 point comment)
- [Design for Touch on Mac — Apple Tech Talks](https://developer.apple.com/videos/play/tech-talks/111456/) — touch interactions, custom and system gestures, hover actions, expanding controls
- [Bring Live Activities to Mac — Apple Tech Talks](https://developer.apple.com/videos/play/tech-talks/111467/) — Live Activities in the menu bar and Dynamic Island on Mac
- [Prepare and submit your apps for iPhone Duo — Apple Developer News](https://developer.apple.com/news/?id=kkphp5qo) — the earlier device preparation post, October 5
- [Apple Newsroom](https://www.apple.com/newsroom/) — iPhone Duo arriving at Apple Store locations on October 23
- [Is your iPhone app ready for iPhone Duo? — this blog](https://blog.bahadirsonmez.com/posts/prepare-your-app-for-iphone-duo/) — my earlier post on the same kind of preparation

## LinkedIn

🖐️ Touch is coming to the Mac, and many existing apps will work on it right away.

✅ #macOS turns touches into clicks, so standard #AppKit controls and gesture recognizers need no changes
❓ Custom mouse tracking only gets one-finger emulation, and there is no hover on touch
📅 Same prep pattern as the iPhone Duo news earlier this month: developer guidance first, hardware right after

More details:
https://blog.bahadirsonmez.com/posts/touch-on-mac-what-to-check/?utm_source=linkedin&utm_medium=social&utm_campaign=touch-on-mac-what-to-check

## X

macbook'a dokunmatik gelmiş, çoğu uygulama hemen çalışır. ama mouse takip kodu tek parmak emülasyonuyla kalıyor, hover yok.
more details:
https://blog.bahadirsonmez.com/posts/touch-on-mac-what-to-check/?utm_source=x&utm_medium=social&utm_campaign=touch-on-mac-what-to-check
