---
title: "Your iPhone widget can now show up on Apple HomeView"
description: "Apple HomeView shows small widgets from connected iPhones, sometimes on a shared household screen. What Apple documented and what to check first."
date: 2026-10-16
tags: [apple-dev]
status: ready
cta_app: healthbar
---

If your iOS app has a small widget, it can appear on Apple HomeView without a new build or any opt-in from you. Some of those widgets land on a screen the whole household looks at, so it is worth checking what yours shows when the person who added it is not the person reading it.

## What Apple announced

Apple introduced HomeView on October 13, 2026: a 7-inch display on a speaker base (plus a wall-mounted model) with Siri AI, home controls, and media. Pre-orders opened the same day and it is available from November 13 in the U.S., Australia, Canada, India, New Zealand, Singapore, South Africa and the UK. It is not sold in the European Union, because Siri AI is not available in iOS there. HomeView recognizes up to six people and gives each of them their own Home Screen with apps and widgets.

There is no HomeView SDK. What developers get is spread across three places:

- **Human Interface Guidelines, Widgets.** The change log for October 13, 2026 says "Added guidance for Apple HomeView". HomeView widgets come from the small system family and share the appearance of iPhone widgets.
- **Developer Program License Agreement, Section 6.4.1.** "You agree that Your iOS Application widget may be made available on CarPlay and Apple HomeView." This is one of the changes you accept when you sign the October 13 agreement.
- **The CarPlay developer page.** CarPlay audio and video apps work on HomeView without changes. That is apps, not widgets, but it shows the pattern: HomeView reuses what you already ship for other surfaces.

## Two places, two audiences

The HIG describes two places a widget can live on HomeView.

**The Home Screen** is personal. Each enrolled household member has their own, with HomeView's built-in widgets plus widgets they pick from their own connected iPhone or iPad.

**The Modular face** is shared. There is one per household and it holds up to four widgets, which can come from different people's iPhones. Apple's own example: if someone puts a Calendar widget there, "that person's calendar appears there for everyone."

That second sentence is the part I would think about first. The newsroom post says content from apps like Messages and Calendar is only surfaced when the enrolled user is recognized by face and their paired iPhone or iPad is nearby and recently unlocked. That describes Apple's own apps. I could not find any documentation that says how, or whether, the same check applies to third-party widgets on the Modular face. My reading is that you should assume your small widget can be read by anyone standing in front of the display, and design it so that this is fine.

For a health, finance or journaling app that is a real question. A step count on a shared screen is probably fine. A weight trend, a mood log, or an account balance might not be what your user expected to share with guests.

The widget of my own app HealthBar pulls its data from Health, so it would not make sense for it to show up on HomeView. My Bubbles app, on the other hand, gets its data from iCloud, so that one is a good fit.

## How it looks: background removed

On the Home Screen, a HomeView widget gets the same light, dark, clear and tinted appearances as on iPhone. On the Modular face it behaves like StandBy: the widget is scaled up and its background is removed, and in low light (Night Mode) it is drawn with a monochromatic red tint.

So if you already tested your widget in StandBy, you have most of the answer. If you have not, the usual WidgetKit tools apply. Use `containerBackground(_:for:)` so the system knows which view is the background it may remove, and read `showsWidgetContainerBackground` to adjust the foreground when the background is gone:

```swift
import SwiftUI
import WidgetKit

struct StepsEntry: TimelineEntry {
    let date: Date
    let steps: Int
}

struct StepsWidgetView: View {
    @Environment(\.showsWidgetContainerBackground) private var showsBackground
    let entry: StepsEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Steps")
                .font(.caption)
            Text(entry.steps, format: .number)
                .font(.title.bold())
                .privacySensitive()
                .widgetAccentable()
        }
        // With the background removed, white text on a green card
        // would sit directly on the display. Switch to a style that works on its own.
        .foregroundStyle(showsBackground ? AnyShapeStyle(.white) : AnyShapeStyle(.primary))
        .containerBackground(Color.green.gradient, for: .widget)
    }
}
```

`.widgetAccentable()` marks what belongs in the accent group when the system uses the accented rendering mode, which the HIG lists for HomeView's tinted and clear appearances. `.privacySensitive()` marks the value for redaction. Apple documents redaction for places like the Lock Screen, but not for HomeView, so treat it as good hygiene, not as a guarantee that the number is hidden there.

## Can you opt out?

Not cleanly, as far as I can tell. The opt-out tool for widget placement is `disfavoredLocations(_:for:)`, which moves a widget to the "Other" section of the widget gallery for the locations you list. The `WidgetLocation` values documented today are `homeScreen`, `lockScreen`, `standBy`, `carPlay`, `iPhoneWidgetsOnMac`, `smartStack` and `watchFace`. There is no HomeView value.

The license agreement only names `disfavoredLocations` for CarPlay: you are responsible for disfavoring your widget there if it is not suitable, for example if it needs a lot of interaction or an unlocked iPhone. It says nothing similar for HomeView. So I would not ship `.disfavoredLocations([.carPlay], for: [.systemSmall])` and expect it to keep a widget off HomeView. That would be a guess about undocumented behavior.

What is left is design. If a small widget would be a problem on a shared screen, the honest options today are to make the small family safe to show anyone, or to put the sensitive version in a different family. HomeView only uses the small system family.

## What I would check this week

1. Add your small widget to StandBy on an iPhone and look at it with the background removed and in the red low-light tint.
2. Read your small widget as a guest would. If a visitor to the house saw it on the Modular face, would your user mind?
3. Make sure `containerBackground(_:for:)` wraps only the background, so the system removes the right thing.
4. Watch the HIG change log and the WidgetKit docs. If Apple adds a HomeView location or a privacy rule for third-party widgets, it will likely show up there first.

If you build with HealthKit data, HealthBar is a small example of the trade-off: a gamified widget that turns Apple Health data into HP, which makes "what should a stranger see" a very concrete question.

## Sources

- [Meet Apple HomeView, a new way to enjoy entertainment and manage the home (Apple Newsroom, Oct 13, 2026)](https://www.apple.com/newsroom/2026/10/meet-apple-homeview-a-new-way-to-enjoy-entertainment-and-manage-the-home/) — dates, countries, no EU sale, up to six people, personal Home Screens, Messages/Calendar privacy check
- [Human Interface Guidelines: Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets) — HomeView section, small system family, Modular face (up to four widgets, one per household, shared), background removal and red low-light tint, rendering modes, Oct 13, 2026 change log
- [Updated Apple Developer Program License Agreement now available (Apple Developer News, Oct 13, 2026)](https://developer.apple.com/news/?id=17mwd36z) — Sections 6.4, 6.4.1, 6.4.2 added
- [Apple Developer Program License Agreement](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/) — Section 6.4.1 text on widgets for CarPlay and HomeView, and the CarPlay-only `disfavoredLocations` obligation
- [CarPlay for developers](https://developer.apple.com/carplay/) — CarPlay audio and video apps work on HomeView without changes
- [WidgetLocation](https://developer.apple.com/documentation/widgetkit/widgetlocation) — documented location values (no HomeView value)
- [disfavoredLocations(_:for:)](https://developer.apple.com/documentation/swiftui/widgetconfiguration/disfavoredlocations%28_:for:%29) — what disfavoring does in the widget gallery
- [showsWidgetContainerBackground](https://developer.apple.com/documentation/swiftui/environmentvalues/showswidgetcontainerbackground) — detecting a removed background
- [containerBackground(_:for:)](https://developer.apple.com/documentation/swiftui/view/containerbackground%28_:for:%29) — marking the removable background
