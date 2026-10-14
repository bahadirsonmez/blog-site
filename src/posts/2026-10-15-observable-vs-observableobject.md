---
title: "Moving from ObservableObject to @Observable: what changes"
description: "How @Observable replaces ObservableObject in SwiftUI, which property wrappers map to which, and the places where a migration can surprise you."
date: 2026-10-15
tags: [apple-dev, swiftui]
status: ready
---

If your SwiftUI app targets iOS 17 or macOS 14 and later, `@Observable` can replace `ObservableObject` in most places. The code gets shorter, and views refresh based on the properties they actually read instead of on any change to the model. The migration is mostly mechanical, but a few spots deserve a second look.

## What actually changes

With `ObservableObject`, you mark each property you care about with `@Published`. Any change to one of those properties fires the object's `objectWillChange`, and every view observing that object is invalidated, even if it only reads a different property.

`@Observable` is a macro from the Observation framework. It rewrites the stored properties of a class so that reads and writes are tracked. SwiftUI records which properties a view's `body` reads and refreshes the view when one of those changes. Apple's WWDC23 session on Observation describes this per-property tracking as the main behavioral difference, and the migration guide describes the property-wrapper mapping.

Here is the same small model written both ways:

```swift
import SwiftUI
import Observation

// Before
final class OldCounter: ObservableObject {
    @Published var count = 0
    @Published var label = "Taps"
}

struct OldView: View {
    @StateObject private var model = OldCounter()
    var body: some View {
        Button("\(model.label): \(model.count)") { model.count += 1 }
    }
}

// After
@Observable
final class Counter {
    var count = 0
    var label = "Taps"
}

struct CounterView: View {
    @State private var model = Counter()
    var body: some View {
        Button("\(model.label): \(model.count)") { model.count += 1 }
    }
}
```

No `@Published`, no protocol conformance, no `import Combine`. Every stored property is observable by default.

## The wrapper mapping

The wrappers on the view side change as well. This is the mapping I use as a checklist, based on Apple's migration guide:

- `@StateObject` becomes `@State`. The view still owns the model.
- `@ObservedObject` becomes a plain property. If the view only reads the model, you don't need a wrapper at all.
- `@EnvironmentObject` becomes `@Environment` with the model type, and you inject it with `.environment(model)`.
- When a child view needs a binding into the model, use `@Bindable`:

```swift
struct ChildView: View {
    @Bindable var model: Counter
    var body: some View {
        TextField("Label", text: $model.label)
    }
}
```

A plain property cannot give you `$model.label`. `@Bindable` is what produces the binding, so it is the thing people most often forget after deleting `@ObservedObject`.

To keep a property out of tracking, mark it `@ObservationIgnored`:

```swift
@Observable
final class Cache {
    @ObservationIgnored var hits = 0
    var items: [String] = []
}
```

I typechecked all the snippets above against a macOS 14 target.

## Where a migration can surprise you

**Fewer refreshes, which can expose hidden assumptions.** If some code relied on a view refreshing because an unrelated `@Published` property changed, it will stop refreshing. That is usually a bug you were hiding, but expect to find one or two.

**Reads outside `body` are not tracked for the view.** Tracking happens for properties read while SwiftUI evaluates the view. If you copy a value into a local variable in an initializer or an `onAppear` closure, later changes to the model won't refresh the view. This follows from how the tracking works; it is my reading of the model rather than something I found called out as a pitfall in the docs.

**Minimum OS version.** The Observation framework starts with iOS 17 and macOS 14. If you still support iOS 16, keep `ObservableObject` for now. The two can live side by side in one app, so you don't need to convert everything at once.

**Combine pipelines on `$property`.** `@Published` exposes a publisher through the `$` prefix. A plain `@Observable` property doesn't. If a view model uses `$query.debounce(...)`, that code needs a new approach, such as an `async` task or `didSet`, before you can remove `@Published`.

## How I would migrate

1. Start with a leaf model that no other model depends on.
2. Swap the declaration for `@Observable` and delete `@Published`.
3. Fix the view side using the mapping above. The compiler points out most places, and `@Bindable` errors are easy to spot.
4. Run the screen and look for views that no longer refresh. Those are the hidden assumptions from the first pitfall.
5. Move to the next model.

Doing one model per commit keeps each step easy to review and to revert.

## Sources

- [Migrating from the Observable Object protocol to the Observable macro](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro) — wrapper mapping, @Bindable, @Environment
- [Observation framework](https://developer.apple.com/documentation/observation) — @Observable, @ObservationIgnored
- [Discover Observation in SwiftUI (WWDC23)](https://developer.apple.com/videos/play/wwdc2023/10149/) — per-property tracking behavior
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app) — State and Environment with observable models
