---
title: "Xcode 27.1 is out. Three things change when you rebuild"
description: "Xcode 27.1 shipped October 15. Same Swift, new iOS 27.1 SDK: your iPhone Duo layout changes, Catalyst needs a guard, widget debugging has limits."
date: 2026-10-19
tags: [apple-dev]
status: ready
---

Xcode 27.1 is the first Xcode that builds against the iOS 27.1 SDK, and that SDK is the switch that turns your app into an "optimized for iPhone Duo" app. Rebuilding is not a neutral update: it changes your layout on the new device, it breaks Mac Catalyst builds that touch 27.1 APIs, and the Duo simulator cannot run most of your extensions yet.

## What is actually in 27.1

Not much, if you look at the toolchain. Xcode 27 already shipped with Swift 6.4, and 27.1 ships the same Swift 6.4. The macOS requirement is the same too: macOS Tahoe 26.6 or later. Deployment targets are unchanged, iOS 15 to 27, watchOS 9 to 27.

The one real difference is the SDK list. Xcode 27 had the iOS 27 SDK; Xcode 27.1 has the iOS 27.1 SDK, while tvOS, watchOS, visionOS and macOS stay on their 27.0 SDKs. The release notes list a single new feature outside the Duo work: the Previews canvas overrides picker now has a Display group, so you can preview a view on a device's alternative display. For Duo that means the outer screen.

So the question is not "what new API do I get". It is "what changes because I compiled against 27.1".

## Change 1: your layout on iPhone Duo

Apple's Prepare page is explicit about the SDK tiers. Built with the iOS 27 SDK, your app resizes to fill most of the inner display but still avoids the status bar on the right edge. Built with the iOS 27.1 SDK or later, the app is treated as optimized: it extends to the full display, and toolbars and tab bars appear vertically below the status bar.

That last sentence is the whole reason to read the release notes before shipping. Apple's own line is: before shipping a build with the iOS 27.1 SDK, make sure your content adapts to the bars becoming vertical. A tab bar you have treated as a fixed-height strip at the bottom becomes a column on one side. Anything that computes its own safe area from "tab bar height" will be wrong.

The Prepare page also repeats the rule that app size changes on every fold and unfold and does not always match the screen size. I covered the patterns to fix in the earlier Duo post (no `UIScreen.main`, no orientation checks, no idiom checks), so I will not repeat them. The new fact this week is that the moment you upload a 27.1 build, those patterns are no longer theoretical.

I haven't rebuilt my apps with 27.1 yet. That is this week's job, and the tab bar is the first thing I will look at.

## Change 2: Mac Catalyst builds can stop compiling

Two known issues in the 27.1 release notes are about Mac Catalyst, and both bite only after you start using 27.1-specific API.

First, projects that use APIs specific to iOS 27.1 show compile errors when building for Mac Catalyst: "undeclared identifier", "not found", "has no member", "cannot find" and similar. The Catalyst SDK in 27.1 is still a 27.0 SDK, so the symbols do not exist there. Apple's workaround is a build-time conditional, not an availability check:

```swift
import Foundation

enum DuoSupport {
    static func configure() {
        #if targetEnvironment(macCatalyst)
        // The 27.1-only API does not exist in the Catalyst SDK yet. Skip it.
        #else
        if #available(iOS 27.1, *) {
            // Call the iOS 27.1 API here.
        }
        #endif
    }
}
```

`#available` is not enough on its own, because the problem is at compile time: the declaration is missing from the SDK, so the compiler never gets to the runtime check. The `#if` removes the code from the Catalyst build entirely. In Objective-C the equivalent is `#if !TARGET_OS_MACCATALYST`.

Second, projects that target iOS 27.1 show no Mac Catalyst run destination at all. The workaround from the release notes is to add a Mac Catalyst 27.0 minimum deployment target in the target settings.

If you do not ship Catalyst, neither matters. If you do, bump the iOS deployment target to 27.1 only when you have both guards in place.

## Change 3: the Duo simulator and your extensions

The Simulator section of the release notes lists four known issues for the iPhone Duo runtime. Two of them affect everyday work:

- Running and debugging most app extensions is unavailable in the iPhone Duo simulator runtime. Widgets, Live Activities, watch complications shipped from the same project: you cannot attach to them there yet. Test them on a regular iPhone simulator and only check the host app's layout on Duo.
- Initial simulator launch can take several minutes. Not a bug you can fix, but worth knowing before you assume the build hung.

The other two: StandBy is unavailable in the Duo runtime, and an app using `CameraCaptureAccessory` can use both displays at once without an active capture session. Both are edge cases for most apps.

The extension limitation is the one I would plan around. If a widget needs its own Duo check, the Previews Display group above is the only Duo-shaped surface you can inspect without a device.

## The App Store side

App Store Connect accepts builds made with Xcode 27.1 since October 15, for the App Store and for internal and external TestFlight testing. Nothing changes in the submission flow itself.

Two dates from Apple's Duo post are worth putting in your calendar. iPhone Duo screenshots are optional today; when you add them, your product page shows an "optimized for iPhone Duo" badge. Starting April 2027, any app or game submitted will need to include iPhone Duo screenshots. "Any" means every update, not only Duo-optimized apps, so a screenshot set for Duo joins the list of required assets for every release next spring.

On CI: GitHub made its Xcode 27 runner image generally available on October 15, labels `xcode-27` and `xcode-27-xlarge`, macOS 27, Apple Silicon only. The changelog does not say which minor version of Xcode 27 the image carries, so check the actions/runner-images software list before you rely on it for 27.1 builds. I have not checked Xcode Cloud's status for 27.1.

## What I would do this week

1. Rebuild with 27.1 and run the app in the Duo simulator folded and unfolded. Look at tab bars and toolbars first; that is the change you did not ask for.
2. If you ship Catalyst, wrap any 27.1-only call in `#if !targetEnvironment(macCatalyst)` and keep a Catalyst 27.0 deployment target.
3. Keep extension debugging on a non-Duo simulator for now.
4. Decide whether you want the Duo badge now or in April. Either way, the screenshot set becomes mandatory for all submissions from April 2027.

The toolchain did not change. The SDK did, and the SDK is what the App Store and the device react to.

## Sources

- [Releases — Apple Developer](https://developer.apple.com/news/releases/) — Xcode 27.1 (27A9275) released October 15, 2026
- [Xcode 27.1 Release Notes](https://developer.apple.com/documentation/xcode-release-notes/xcode-27_1-release-notes) — Swift 6.4, SDK list, macOS 26.6 requirement, Previews Display group, Mac Catalyst and Simulator known issues and workarounds
- [Xcode Support — Apple Developer](https://developer.apple.com/support/xcode/) — SDK and deployment target tables for Xcode 27 and 27.1
- [App Store Connect release notes](https://developer.apple.com/help/app-store-connect/release-notes/) — October 15, 2026: uploads built with Xcode 27.1 accepted for App Store and TestFlight
- [Prepare and submit your apps for iPhone Duo — Apple Developer News](https://developer.apple.com/news/?id=kkphp5qo) — October 23 availability, Duo badge, April 2027 screenshot requirement
- [Prepare — iPhone Duo](https://developer.apple.com/iphone-duo/prepare/) — app behavior by SDK version, vertical toolbars and tab bars with the iOS 27.1 SDK, size changes on fold
- [Swift 6.4 Released — Swift.org](https://www.swift.org/blog/swift-6.4-released/) — Swift 6.4 shipped September 15, 2026 (same toolchain in Xcode 27 and 27.1)
- [Xcode 27 Release Notes](https://developer.apple.com/documentation/xcode-release-notes/xcode-27-release-notes) — Xcode 27 already includes Swift 6.4 and the iOS 27 SDK
- [Xcode 27 runner image generally available — GitHub Changelog](https://github.blog/changelog/2026-10-15-xcode-27-runner-image-generally-available/) — labels, macOS 27, Apple Silicon only, GA on October 15, 2026
