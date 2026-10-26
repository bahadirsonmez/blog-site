---
title: "Safari 27.1 previews web APIs for foldable screens"
description: "Safari 27.1 on iPhone Duo adds Device Posture and Viewport Segments as flagged previews. What they do, how to try them, and what to leave alone for now."
date: 2026-10-26
tags: [apple-dev]
status: draft
---

## Why this topic

Why now: WebKit published "WebKit Features for Safari 27.1" on October 23, 2026, the day iPhone Duo reached customers. My two earlier Duo posts only cover the native side (the prepare checklist and the Xcode 27.1 rebuild); nobody has written the web side yet. Search question it answers: "what do I change in my website or web app for iPhone Duo, and what are Device Posture and Viewport Segments in Safari?". Claims rest on the WebKit post (all Safari 27.1 behavior, the viewport sizes, the flag path), on MDN for the API definitions and their experimental status, and on Apple's iPhone Duo Prepare page for the Xcode 27.1 simulator. Left out on purpose: the Device Hub documentation page (I could not read its body) and any Safari 27.1 release notes (the page returned 404). Open question I could not settle from the sources: whether the flags apply inside WKWebView or SFSafariViewController; the post says so instead of guessing. Earliest publish date is 2026-10-25 (a Sunday); the publish job picks the real slot (15:00 Turkey time, 14:00 Berlin).

<!-- end why -->

Safari 27.1 ships with iPhone Duo, and it adds two web APIs for folding screens: Device Posture and Viewport Segments. Both are developer previews behind feature flags, so this post is about trying them, not shipping against them.

## What WebKit says is new

WebKit's October 23 post says Safari 27.1 uses the same WebKit engine and web technologies as before, so existing sites and web apps should work unchanged on iPhone Duo. The new part is two APIs that tell your page about the fold. WebKit says the APIs may still change and asks for feedback, which is the usual language for a preview.

## Device Posture: is the screen folded?

Device Posture has two values. `folded` means the device is partly folded, like a book or a laptop. `continuous` means the screen is flat, which includes fully open and fully closed. MDN adds that a device that cannot fold is always `continuous`, which makes a handy default: your normal layout is the `continuous` one.

You can read it in CSS or in JavaScript:

```css
@media (device-posture: folded) {
  /* the screen is partly folded */
}
```

```js
const posture = navigator.devicePosture.type; // "folded" or "continuous"
```

The JavaScript side also fires a `change` event when the posture changes.

## Viewport Segments: where does the screen split?

When the device is partly folded, the viewport has segments. Viewport Segments gives you their position and size. There are media queries, `horizontal-viewport-segments` for side by side (the book pose) and `vertical-viewport-segments` for stacked (the laptop pose), and six CSS environment variables: `viewport-segment-width`, `-height`, `-top`, `-right`, `-bottom` and `-left`. Each takes two indexes, column first and then row, where the top left segment is `0 0`. Side by side, the left segment is `0 0` and the right one is `1 0`. Stacked, the top is `0 0` and the bottom is `0 1`.

In JavaScript, `window.viewport.segments` returns an array of `DOMRect` objects. WebKit says to read it again when the posture changes and when the window size changes, so do not cache it at load.

Here is a small sketch of my own, not WebKit's sample, to show the shape of the idea:

```css
@media (horizontal-viewport-segments: 2) {
  .sidebar {
    width: env(viewport-segment-width 0 0);
  }
}
```

It asks for the width of the left segment and gives it to a sidebar, only when the page is split side by side.

## How wide is the viewport, really?

WebKit lists the viewport sizes in CSS pixels. Across the outer and inner screens, in portrait and landscape, widths run from 382 to 951 and heights from 368 to 902. Here are the widths:

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 190" width="640" height="190" role="img" aria-labelledby="t-sf d-sf" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-sf">iPhone Duo viewport width in Safari 27.1</title>
<desc id="d-sf">Five boxes show the viewport width in CSS pixels: 382 on the outer screen in portrait, 594 on the outer screen in landscape, 669 on the inner screen in portrait, 951 on the inner screen in landscape, and 385 for each window when two windows sit side by side. A bar under each number shows the width to scale.</desc>
<rect x="20" y="20" width="108" height="150" rx="10" fill="#160572"/>
<text x="74" y="52" text-anchor="middle" fill="#ffffff" font-size="13">Outer screen</text>
<text x="74" y="70" text-anchor="middle" fill="#ffffff" font-size="13">portrait</text>
<text x="74" y="112" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="600">382</text>
<rect x="30" y="132" width="35" height="10" rx="3" fill="#d98199"/>
<rect x="143" y="20" width="108" height="150" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="197" y="52" text-anchor="middle" fill="#160572" font-size="13">Outer screen</text>
<text x="197" y="70" text-anchor="middle" fill="#160572" font-size="13">landscape</text>
<text x="197" y="112" text-anchor="middle" fill="#160572" font-size="22" font-weight="600">594</text>
<rect x="153" y="132" width="55" height="10" rx="3" fill="#2544a0"/>
<rect x="266" y="20" width="108" height="150" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="52" text-anchor="middle" fill="#160572" font-size="13">Inner screen</text>
<text x="320" y="70" text-anchor="middle" fill="#160572" font-size="13">portrait</text>
<text x="320" y="112" text-anchor="middle" fill="#160572" font-size="22" font-weight="600">669</text>
<rect x="276" y="132" width="62" height="10" rx="3" fill="#2544a0"/>
<rect x="389" y="20" width="108" height="150" rx="10" fill="#160572"/>
<text x="443" y="52" text-anchor="middle" fill="#ffffff" font-size="13">Inner screen</text>
<text x="443" y="70" text-anchor="middle" fill="#ffffff" font-size="13">landscape</text>
<text x="443" y="112" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="600">951</text>
<rect x="399" y="132" width="88" height="10" rx="3" fill="#d98199"/>
<rect x="512" y="20" width="108" height="150" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="566" y="52" text-anchor="middle" fill="#160572" font-size="13">Two windows</text>
<text x="566" y="70" text-anchor="middle" fill="#160572" font-size="13">inner, each</text>
<text x="566" y="112" text-anchor="middle" fill="#160572" font-size="22" font-weight="600">385</text>
<rect x="522" y="132" width="36" height="10" rx="3" fill="#2544a0"/>
</svg>
<figcaption>Viewport width in CSS pixels on iPhone Duo, from WebKit's Safari 27.1 post. The bars are to scale.</figcaption>
</figure>

WebKit itself says not to memorize these numbers. Its advice is the old one: media queries, flexible layouts, CSS Grid and Flexbox, and feature detection instead of user-agent sniffing. The diagram is there to show how much the width moves, not to give you breakpoints.

## What is still rough

Two things from the post stand out.

First, WebKit describes the outer screen as wider and shorter, and iOS pulls its controls to the edge. Safari 27.1 does not extend web content behind those edge controls. It fills that area with the page's background color. `viewport-fit="cover"` is one way around it, but WebKit says many sites do not inset all four edges correctly, and the team is looking for a sturdier approach. There is no promise or date.

Second, a plain user-facing change: partly folded, Safari shows PDFs as two pages side by side, and goes back to one page when the screen is flat or closed. Nothing for you to do there.

## What I could not find out

WebKit's post does not mention WKWebView or SFSafariViewController. Whether the two flags work in web views inside apps is not stated anywhere I could check, so treat it as unknown. If your app shows web content, test that case yourself before you assume anything.

## How to try it

1. Use Xcode 27.1 or later. WebKit's post and Apple's iPhone Duo Prepare page both point to the iPhone Duo simulator, and Apple lists the iOS resizable simulator in Device Hub next to it.
2. In the Settings app, go to Apps, then Safari, then Advanced, then Feature Flags. Turn on both "Device Posture API" and "Viewport Segments API". They are separate switches. I could not confirm from the sources that the simulator shows the same list, so look for it there.
3. Open a page of yours in Safari, add one of the queries above and see whether it matches.

## My suggestions, not facts

MDN marks both APIs as experimental with limited availability and not Baseline. That is the fact that matters most. My reading is that today the safe order is: make the page work at any width first, with the tools WebKit names, and treat posture as a small extra. A `device-posture: folded` rule that adds a second column is a good first use, because the page still works if the rule never matches. I would not make anything depend on the segment values until the APIs leave preview.

## Sources

- [WebKit Features for Safari 27.1 — WebKit blog](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/) — Safari 27.1 on iPhone Duo with the same engine; both APIs as developer previews behind flags; the flag path; the posture values, media queries, environment variables and `window.viewport.segments`; the viewport sizes; the advice on media queries and feature detection; PDFs side by side; the outer-screen edge behavior and `viewport-fit="cover"`; the Xcode 27.1 Device Hub simulator
- [Device Posture API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Device_Posture_API) — the `folded` and `continuous` definitions, a non-folding device is always `continuous`, experimental status and limited availability
- [Viewport Segments API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Viewport_Segments_API) — what segments are, the two media queries and `Window.viewport.segments`, experimental status and limited availability
- [Prepare your app for iPhone Duo — Apple](https://developer.apple.com/iphone-duo/prepare/) — the iPhone Duo simulator in Xcode 27.1 and the iOS resizable simulator in Device Hub as test tools (it says nothing about Safari or web content)

## LinkedIn

📱 A foldable iPhone means your website may have to fit two screens.

#Safari 27.1 on iPhone Duo previews two web APIs behind feature flags, one more thing for #iOSDevelopment folks with a web side:
- Device Posture: is the screen folded or flat
- Viewport Segments: where the screen splits
- My take, not fact: use them as a small extra, not a dependency 🧩

Details and a diagram on the blog:
https://blog.bahadirsonmez.com/posts/safari-27-1-foldable-web-apis/?utm_source=linkedin&utm_medium=social&utm_campaign=safari-27-1-foldable-web-apis

## X

katlanan iPhone'da site iki parçaya bölünebilir. Safari 27.1 Device Posture ve Viewport Segments'i flag arkasında açmış.
https://blog.bahadirsonmez.com/posts/safari-27-1-foldable-web-apis/?utm_source=x&utm_medium=social&utm_campaign=safari-27-1-foldable-web-apis
