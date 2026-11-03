---
title: "Xcode 27.2 is out: what got fixed, what is still open"
description: "Xcode 27.2 adds touch, StandBy and new simulator tools to Device Hub, closes some 27.1 issues, keeps the Mac Catalyst build error and adds two new known issues."
date: 2026-11-03
tags: [apple-dev]
status: draft
---

## Why this topic

Why now: Xcode 27.2 final came out on October 29, iOS 27.2 on October 26, and App Store Connect has accepted builds made with 27.2 since October 30, all within the last three days. My earlier posts covered the release candidate's JSON project format and the iOS 27.2 ATT change, not Device Hub, the known issues or the upload side. Question it answers: "Should I move to Xcode 27.2, and what is still broken?" Sources: the Xcode 27.1 and 27.2 release notes, the iOS & iPadOS 27.2 release notes, the Device Hub documentation, Apple's Releases and support pages, and the App Store Connect release notes (all opened). No official press image exists for this release, so the post uses a diagram only. Publish slot: earliest Sunday 15:00 Turkey time, 14:00 Berlin (the publish job picks the real day).

<!-- end why -->

Xcode 27.2 is out, and its headline is Device Hub: it now passes touch input to a device, supports StandBy on iPhone Duo and adds a few simulator tools. It also leaves one 27.1 build error open and brings two new known issues, so the update comes with a short list of things to check.

## In short

- Device Hub gets the biggest set of changes: touch from Sidecar, StandBy on iPhone Duo, and simulator shake, fall and memory pressure.
- A few 27.1 problems are closed (the camera accessory issue and two Interface Builder bugs). The Mac Catalyst build error is not.
- Two known issues are new: four platform SDKs report 27.1 as a valid deployment target, and cloning a 27.2 simulator can fail.
- App Store Connect accepts apps built with Xcode 27.2 for the App Store and TestFlight.

| | Xcode 27.1 | Xcode 27.2 |
|---|---|---|
| Release date | October 15, 2026 | October 29, 2026 |
| Build | 27A9275 | 27B52 |
| SDKs | iOS 27.1, the rest 27 | 27.2 for iOS, iPadOS, tvOS, watchOS, visionOS and macOS |
| Swift | 6.4 | 6.4 |
| Needs | macOS Tahoe 26.6 | macOS Tahoe 26.6 |
| App Store Connect builds | accepted from release day | accepted from October 30 (RC builds from October 20) |
| StandBy in the iPhone Duo simulator | missing (known issue) | supported in Device Hub |
| Camera accessory on two screens | known issue | listed as fixed |
| Mac Catalyst build error with iOS 27.1 APIs | known issue | still a known issue |

## Then and now

Swift and the macOS requirement stayed where they were. The SDK set is now consistent, where 27.1 mixed one newer iOS SDK with older ones. The rows from StandBy down are where the interesting changes are.

I wrote up the previous release in [Xcode 27.1 is out. Three things change when you rebuild](https://blog.bahadirsonmez.com/posts/xcode-27-1-rebuild-checklist/), and the release candidate's project format in [Xcode 27.2 RC adds a JSON project format. Try it on a branch](https://blog.bahadirsonmez.com/posts/xcode-27-2-json-project-format/). The JSON project from that post carries over: Apple's notes say it also opens in earlier Xcode 27 versions.

## Device Hub grew up

Apple describes Device Hub as the place in Xcode where every simulated and physical device that shows up as a run destination is managed. It opens as a compact window and expands into a sidebar, a canvas and an inspector, and it has a command-line page too.

The 27.2 notes add a long list to it:

- Touches made through Sidecar, or on a MacBook with touch, reach the remote device as touches, so multi-finger gestures such as pinch and rotate can be tested.
- StandBy works in the iPhone Duo simulator.
- iOS 17 simulator runtimes now accept input.
- Slow Motion Animation, Simulate Shake, Simulate Fall and Simulate Memory Pressure, all simulator-only.
- Smaller things: a context menu for screenshots, hiding the device frame, Secure Keyboard Entry, hardware keyboard simulation and a choice of where captures are saved.

In my [Touch on Mac post](https://blog.bahadirsonmez.com/posts/touch-on-mac-what-to-check/) the way to try touch without the new hardware was an iPad over Sidecar. My take, not Apple's words: the touch support in Device Hub is the first thing I would open if you build for the Mac, because it makes pinch and rotate testable without leaving Xcode.

## What closed and what did not

Beyond Device Hub, the notes list fixes in a few places:

- Interface Builder: the toolchain encoded a standard or system `UIStackView.spacing` as 0, and `UIButtonConfiguration.contentInsets` was not encoded at all. Both are marked fixed.
- Previews: the `RenderPreview` MCP tool now lists the available render targets and lets you choose one, and a preview error with CRLF line endings is fixed.
- StoreKit Testing: three `SKTestSession` fixes. Intro offer eligibility was not reset after `clearTransactions()`, a storefront or locale change did not reach `Storefront.updates`, and error dialogs could appear while `dialogsDisabled` was true.

The 27.1 known issues are a mixed picture. StandBy and the camera accessory item are closed. Three others, most app extensions not running in the iPhone Duo simulator, a slow first Simulator launch and a missing Mac Catalyst run destination when you target iOS 27.1, are not in the 27.2 notes. The notes do not say they were fixed, so I would not call them resolved.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 272" width="640" height="272" role="img" aria-labelledby="t-x272 d-x272" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-x272">What Xcode 27.2 changed compared with 27.1</title>
<desc id="d-x272">Arrow 1 goes from a box for Xcode 27.1 to a box for Xcode 27.2. From Xcode 27.2, one arrow leads to a box for what was fixed or added: StandBy on iPhone Duo, the camera accessory fix and Interface Builder fixes. A dashed arrow leads to a box for what is still open: the Mac Catalyst build error, the deployment target report and simulator cloning.</desc>
<defs><marker id="x272-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="100" width="150" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="132" text-anchor="middle" fill="#160572" font-weight="600">Xcode 27.1</text>
<text x="95" y="154" text-anchor="middle" fill="#2c2c2c" font-size="13">the known issues</text>
<rect x="230" y="100" width="150" height="72" rx="10" fill="#160572"/>
<text x="305" y="132" text-anchor="middle" fill="#ffffff" font-weight="600">Xcode 27.2</text>
<text x="305" y="154" text-anchor="middle" fill="#ffffff" font-size="13">the release notes</text>
<rect x="440" y="24" width="180" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="530" y="56" text-anchor="middle" fill="#160572" font-weight="600">Fixed or added</text>
<text x="530" y="78" text-anchor="middle" fill="#2c2c2c" font-size="13">Duo StandBy, camera, IB</text>
<rect x="440" y="176" width="180" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="530" y="208" text-anchor="middle" fill="#160572" font-weight="600">Still open</text>
<text x="530" y="230" text-anchor="middle" fill="#2c2c2c" font-size="13">Mac Catalyst, cloning</text>
<line x1="172" y1="136" x2="228" y2="136" stroke="#2544a0" stroke-width="2" marker-end="url(#x272-a)"/>
<line x1="382" y1="122" x2="438" y2="76" stroke="#2544a0" stroke-width="2" marker-end="url(#x272-a)"/>
<path d="M382 152L438 198" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#x272-a)"/>
<text x="200" y="124" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="396" y="94" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="396" y="192" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
</svg>
<figcaption>What the 27.2 release notes close or add, and what they leave open, compared with 27.1.</figcaption>
</figure>

The Mac Catalyst build error is the one that carries over. Projects that use APIs introduced in iOS 27.1 can fail to build for Mac Catalyst, and both release notes give the same workaround: wrap the code in `#if !targetEnvironment(macCatalyst)` in Swift, or `#if !TARGET_OS_MACCATALYST` in Objective-C.

```swift
func useNewestAPI() {
    #if !targetEnvironment(macCatalyst)
    // call the API that only exists in the iOS 27.1 SDK here
    print("not running on Mac Catalyst")
    #endif
}
```

Two issues are new in 27.2. The macOS, watchOS, tvOS and visionOS SDKs report 27.1 as a valid deployment target, and building against it can behave unexpectedly. And cloning a simulator that runs a 27.2 runtime can fail because of wrong file permissions. Apple's workaround, from the Xcode and iOS & iPadOS release notes, deletes the leftover files from the source simulator's data folder (replace `<SOURCE_UDID>` with the simulator you clone from):

```sh
find ~/Library/Developer/CoreSimulator/Devices/<SOURCE_UDID>/data -name '*.sb-????????-??????' -delete
```

Device Hub has known issues too, mostly on iPhone Duo: VoiceOver and the Accessibility Inspector cannot pass screen content, and screenshots and recordings can come out black for a few minutes after launch.

## The good and the not-so-good

Good:

- Device Hub covers touch, StandBy on iPhone Duo, iOS 17 input and several simulator tools in one release.
- The camera accessory, Interface Builder and StoreKit Testing fixes are marked fixed in the notes.

Not so good:

- The Mac Catalyst build error with iOS 27.1 APIs is still a known issue.
- Four SDKs report 27.1 as a valid deployment target, and simulator cloning can fail with a 27.2 runtime.
- Several Device Hub gaps remain on iPhone Duo.

My take, not fact: the Device Hub list is the reason to update, and the known issues are the reason to do it on a branch first.

## What I would do

My suggestions, not facts:

1. Update on a branch and build every target once, Mac Catalyst included. If the 27.1 build error is still there, add the guard above.
2. Do not move a deployment target to 27.1 only because the SDK lists it.
3. If you clone simulators, keep Apple's delete command at hand.
4. If you use storyboards or xibs, check stack view spacing and button content insets after the rebuild.
5. In UIKit, the iOS & iPadOS 27.2 notes say a `UIView`'s default layout margins are zero from iOS 27.1. A child view that should inherit them needs `preservesSuperviewLayoutMargins = true`.
6. If your tests use `SKTestSession`, rerun them.

## Sources

- [Xcode 27.2 Release Notes — Apple Developer Documentation](https://developer.apple.com/documentation/xcode-release-notes/xcode-27_2-release-notes) — Device Hub improvements and known issues, Interface Builder, Previews and StoreKit Testing fixes, the deployment target and simulator cloning issues, Mac Catalyst
- [Xcode 27.1 Release Notes — Apple Developer Documentation](https://developer.apple.com/documentation/xcode-release-notes/xcode-27_1-release-notes) — the 27.1 known issues: iPhone Duo simulator, CameraCaptureAccessory, Mac Catalyst
- [iOS & iPadOS 27.2 Release Notes — Apple Developer Documentation](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27_2-release-notes) — simulator cloning workaround, UIKit default layout margins
- [Device Hub — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/device-hub) — what Device Hub is and how it is laid out
- [Releases — Apple Developer News](https://developer.apple.com/news/releases/) — release dates and builds of Xcode 27.1 and 27.2, iOS 27.2 on October 26
- [Xcode support — Apple Developer](https://developer.apple.com/support/xcode/) — Swift version and SDKs of both releases
- [App Store Connect release notes — Apple Developer](https://developer.apple.com/app-store-connect/release-notes/) — builds from Xcode 27.2 accepted for the App Store and TestFlight, and the earlier acceptance of the release candidate
- [Xcode 27.1 is out. Three things change when you rebuild — this blog](https://blog.bahadirsonmez.com/posts/xcode-27-1-rebuild-checklist/) — my earlier post on the previous release
- [Xcode 27.2 RC adds a JSON project format. Try it on a branch — this blog](https://blog.bahadirsonmez.com/posts/xcode-27-2-json-project-format/) — my earlier post on the release candidate
- [Touch on Mac: what to check in your app — this blog](https://blog.bahadirsonmez.com/posts/touch-on-mac-what-to-check/) — my earlier post on testing touch with Sidecar

## LinkedIn

🛠️ Xcode 27.2 closes some 27.1 problems and leaves a few open.

✅ Device Hub adds Sidecar touch, StandBy on iPhone Duo and shake, fall and memory-pressure simulation
✅ The CameraCaptureAccessory two-screen issue is fixed
❓ The Mac Catalyst build error from 27.1 is still a known issue, and cloning a 27.2 simulator can fail on file permissions

App Store Connect already accepts 27.2 builds. My 27.1 rebuild checklist is the earlier post on this, for anyone doing #iOSDevelopment in #Xcode.

More details:
https://blog.bahadirsonmez.com/posts/xcode-27-2-what-changed/?utm_source=linkedin&utm_medium=social&utm_campaign=xcode-27-2-what-changed

## X

xcode 27.2'de device hub'a dokunmatik girdi, duo'ya standby gelmiş. ama mac catalyst hatası duruyor, simülatör klonlama da sorunlu.
more details:
https://blog.bahadirsonmez.com/posts/xcode-27-2-what-changed/?utm_source=x&utm_medium=social&utm_campaign=xcode-27-2-what-changed
