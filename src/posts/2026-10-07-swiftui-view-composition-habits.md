---
title: "Three SwiftUI habits that keep large screens readable"
description: "Small data-driven views, modifiers for repeated styling, and state kept close to where it is used: three habits for SwiftUI screens that stay readable."
date: 2026-10-07
tags: [apple-dev, swiftui]
status: ready
---

Large SwiftUI screens go wrong in a predictable way: one `body` that runs for 200 lines, conditionals nested three levels deep, and every piece of state declared at the top. Nothing is broken, but nobody wants to touch it. Three habits keep that from happening, and none of them needs a framework or a new architecture.

## 1. Split views by data, not by layout

The tempting way to break up a big view is by position: `headerView`, `middleSection`, `footerView`, each a computed property on the same struct. That makes the file shorter, but the pieces still share one `body` and one set of dependencies.

Split by the data a piece displays instead. Give each extracted view a name and only the values it reads:

```swift
struct WorkoutRow: View {
    let title: String
    let minutes: Int

    var body: some View {
        HStack {
            Text(title)
            Spacer()
            Text("\(minutes) min")
                .foregroundStyle(.secondary)
        }
    }
}

// At the call site:
ForEach(workouts) { workout in
    WorkoutRow(title: workout.title, minutes: workout.minutes)
}
```

The row takes two plain values rather than the whole `Workout`. It is easy to preview with made-up numbers, and it cannot quietly start depending on a property you did not mean to show. The WWDC sessions on how SwiftUI works ([Demystify SwiftUI](https://developer.apple.com/videos/play/wwdc2021/10022/) and [Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)) describe a view's body as a function of the things it depends on. My reading is that a view which takes two values depends on those two values, and nothing else, which is a good property to have.

## 2. Name repeated styling with a modifier

If the same three modifiers appear on every card in your app, they belong in a [`ViewModifier`](https://developer.apple.com/documentation/swiftui/viewmodifier):

```swift
struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.background, in: RoundedRectangle(cornerRadius: 12))
    }
}

extension View {
    func card() -> some View {
        modifier(CardStyle())
    }
}
```

Now a screen reads `VStack { ... }.card()` and a design change happens in one place. The small extension on `View` is what makes the call site read like the built-in modifiers.

When the repeated part is a container rather than a style, take the content as a [`@ViewBuilder`](https://developer.apple.com/documentation/swiftui/viewbuilder) closure:

```swift
struct LabeledCard<Content: View>: View {
    let title: String
    let content: Content

    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            content
        }
        .card()
    }
}
```

Callers write `LabeledCard(title: "Sleep") { ... }` and put whatever views they like inside, just as they would with `VStack`.

## 3. Keep state close to where it is used

State declared at the top of a screen is easy to write and hard to live with. A [`@State`](https://developer.apple.com/documentation/swiftui/state) value that only a search field needs, but that lives on the screen, makes the whole screen a dependent of that value. The fix is to move it down to the smallest view that uses it, and send results up through a closure:

```swift
struct FilterField: View {
    @State private var text = ""
    let onCommit: (String) -> Void

    var body: some View {
        TextField("Filter", text: $text)
            .onSubmit { onCommit(text) }
    }
}
```

Typing now changes state inside `FilterField` only, and the screen hears about it when the user submits. Apple's guide to [managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app) is the place to decide where each kind of state should live: view-local `@State` for transient UI details, and shared models for data several views read.

The second half of this habit is keeping `body` cheap. Sorting, filtering and formatting belong in your model or in a value you compute once, not inside the view builder where they can run on every update. The performance session above makes the same point about keeping work out of `body`.

## A short checklist

- Does each extracted view take only the values it reads?
- Is styling that repeats three times behind a modifier?
- Is every `@State` declared in the smallest view that needs it?
- Is `body` free of sorting, filtering and formatting work?

None of this is clever, and that is the point. A screen built from small views with narrow inputs is one you can still change in six months.

## Sources

- [Demystify SwiftUI (WWDC21)](https://developer.apple.com/videos/play/wwdc2021/10022/): how SwiftUI treats identity, lifetime and dependencies
- [Demystify SwiftUI performance (WWDC23)](https://developer.apple.com/videos/play/wwdc2023/10160/): dependencies and keeping `body` fast
- [ViewModifier](https://developer.apple.com/documentation/swiftui/viewmodifier): reusable styling
- [ViewBuilder](https://developer.apple.com/documentation/swiftui/viewbuilder): composing content with closures
- [State](https://developer.apple.com/documentation/swiftui/state): view-local state
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app): where state should live
