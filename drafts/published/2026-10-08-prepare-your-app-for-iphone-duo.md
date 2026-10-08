---
title: "Is your iPhone app ready for iPhone Duo?"
description: "iPhone Duo ships October 23. Apple's checklist boils down to one rule: stop assuming screen size, orientation or idiom tell you what shape your app is."
date: 2026-10-08
tags: [apple-dev]
status: draft
---

## Why this topic

Why now: Apple published "Prepare and submit your apps for iPhone Duo" on Oct 5, 2026 and a "Prepare" page with a concrete checklist. iPhone Duo reaches customers on Oct 23, so there are about two weeks left. It also sets a dated requirement: from April 2027, submissions need iPhone Duo screenshots. Search question it answers: "what do I have to change in my iPhone app for iPhone Duo?". Sources are Apple's news post and the iPhone Duo Prepare page only; I did not verify anything beyond them. Publish slot: Friday 15:00 Turkey time, 14:00 Berlin.

<!-- end why -->

iPhone Duo reaches customers on October 23, 2026, and Apple's guidance for developers comes down to one idea: on this device, nothing about the screen tells you the shape of your app. Orientation, idiom and screen bounds can all mislead you, so layout has to follow the space your view is actually given.

## What happens if you do nothing

Apple says every app will run on iPhone Duo, but what it looks like depends on the SDK you build with.

- **Built with the iOS 26 SDK or earlier:** the app runs but does not adapt to all layouts. Unfolded, it sits in the center of the inner display with empty space around it. Folded, the outer display shows it to the left of the status bar and camera.
- **Built with the iOS 27 SDK:** the app resizes to fill most of the inner display, still avoiding the status bar on the right edge.
- **Built with the iOS 27.1 SDK or later:** the app is optimized for Duo and uses the full display. Toolbars and tab bars appear vertically below the status bar.

That last point matters. Apple's own advice is to check that your content adapts to the bars becoming vertical before you ship a build with the 27.1 SDK. Recompiling is not a free upgrade; it changes your layout.

One more thing from the same page: the app's size changes whenever the device folds or unfolds, and it does not always match the screen size. A fold can resize your app in the middle of a session.

## The checklist, in plain terms

Apple's Prepare page groups the fixes into three steps: run an assessment, fix patterns, test resizing. The patterns are the useful part.

**Stop sizing from the main screen.** Search for `UIScreen.main`. Replace `UIScreen.main.bounds` with `view.bounds` or `window.bounds`. In SwiftUI, use `GeometryReader` or `onGeometryChange`. Reading the size once at launch, or in `viewIsAppearing`, is not enough. Apple points to `layoutSubviews`, `viewDidLayoutSubviews` and `viewWillTransition(to:with:)` for size-dependent work. Scale comes from `traitCollection.displayScale` or `@Environment(\.displayScale)`, windows from `UIWindow(windowScene:)`, and you should not store a `UIScreen`.

**Stop using orientation to decide layout.** Apple lists `UIDevice.current.orientation`, `statusBarOrientation` and `interfaceOrientation` (including `windowScene.effectiveGeometry.interfaceOrientation`) as things to remove from layout logic. If you need to know whether you are wider than tall, compare width and height of the space you have.

**Stop assuming idiom or size class identifies the device.** With iPhone Duo and resizable iPhone Mirroring, an iPhone app can have any combination of size classes. So:

- Do not branch on `userInterfaceIdiom == .phone` or `.pad`.
- Do not treat "regular width" as "iPad". That code will now run its iPad layout on an iPhone.
- Remove comparisons like `bounds.height == 844`.
- Check full-bleed media. Hero images using `.scaleAspectFill` can lose important content on wider displays.

## A small SwiftUI version

This is my own sketch of the idea, not Apple's sample. The layout depends only on the space the view receives.

```swift
import SwiftUI

struct PhotoGallery: View {
    let names: [String]

    var body: some View {
        GeometryReader { proxy in
            let isWide = proxy.size.width > proxy.size.height
            let columns = Array(repeating: GridItem(.flexible()), count: isWide ? 4 : 2)
            ScrollView {
                LazyVGrid(columns: columns) {
                    ForEach(names, id: \.self) { name in
                        Image(systemName: name)
                            .resizable()
                            .scaledToFit()
                    }
                }
            }
        }
    }
}
```

`GeometryReader` re-evaluates when the size changes, so a fold or unfold produces a new column count without any orientation code. Apple names `GeometryReader` and `onGeometryChange` as the SwiftUI tools for this. A fixed column count would be a better choice for some screens; the point is only that the input is the size, not the device.

## How to test

Apple lists three ways to test resizing: the iOS resizable simulator in Device Hub, iPhone Mirroring on macOS 27 (resize the window to extreme sizes in both directions), and the iPhone Duo simulator in Xcode 27.1. Apple calls the Duo simulator the best way to test the full native experience.

For the first pass, Apple says to ask the coding assistant in Xcode to "get my app ready for iPhone Duo". It runs a resizability skill that scans for these patterns and suggests fixes. Apple adds that it finds most issues, not all, so the manual search for the patterns above is still worth doing. For other coding agents, Apple documents `xcrun agent skills export`.

## App Store dates

Apple's news post says you can submit iPhone Duo optimized apps in App Store Connect today. Starting April 2027, any app or game submitted will need to include screenshots for iPhone Duo. Updated screenshot and preview specs are published, and App Store Connect has a new preview tool for how your assets look on Duo. There is also a featuring nomination option where you can say the app supports all device poses.

## Where I would start

I would grep for `UIScreen.main`, `.orientation` and `userInterfaceIdiom` first. Those three searches cover most of what Apple's page lists, and each hit is a place where the app assumes something the device no longer guarantees.

## Sources

- [Prepare and submit your apps for iPhone Duo (Apple Developer News, Oct 5, 2026)](https://developer.apple.com/news/?id=kkphp5qo) — Oct 23 availability, Xcode 27.1, Device Hub, April 2027 screenshot requirement, submission and preview tool
- [Prepare — iPhone Duo (Apple Developer)](https://developer.apple.com/iphone-duo/prepare/) — SDK behavior by version, the three steps, the patterns to fix, testing tools
- [Get ready for iPhone Duo (Apple Developer)](https://developer.apple.com/iphone-duo/) — videos, labs, workshops and documentation links

## LinkedIn

iPhone Duo ships on October 23, and Apple's checklist for developers fits in one sentence: stop assuming the screen tells you what shape your app is.

Here is what Apple's own guidance says to look for:

- UIScreen.main in layout code
- UIDevice orientation and interfaceOrientation
- userInterfaceIdiom checks, and "regular width means iPad"
- hardcoded sizes like bounds.height == 844
- fill-mode hero images that lose content on wider displays

Apps built with the iOS 26 SDK still run, but sit in the middle of the inner display. Build with the 27.1 SDK and toolbars and tab bars go vertical, so recompiling changes your layout. From April 2027, submissions also need iPhone Duo screenshots.

I wrote up the checklist, a small SwiftUI example and the three ways Apple suggests testing resizing.

https://blog.bahadirsonmez.com/posts/prepare-your-app-for-iphone-duo/?utm_source=linkedin&utm_medium=social&utm_campaign=prepare-your-app-for-iphone-duo

## X

iPhone Duo ships Oct 23. Apple's checklist: stop using UIScreen.main, orientation and idiom to decide layout. https://blog.bahadirsonmez.com/posts/prepare-your-app-for-iphone-duo/?utm_source=x&utm_medium=social&utm_campaign=prepare-your-app-for-iphone-duo
