---
title: "How SwiftUI knows what to redraw"
description: "SwiftUI updates a view when what its body read has changed. With an Observable model, that means only the properties the body actually reads."
date: 2026-11-27
tags: [how-it-works, apple-dev]
status: ready
---

SwiftUI updates a view when one of its dependencies changes: state, environment values or Observable model data. The idea to keep: with an `@Observable` model, a view depends only on the properties its `body` actually reads.

## The short version

While SwiftUI runs a view's `body`, it notes which `@Observable` properties are read there. When one of them changes, SwiftUI computes that view again and updates the screen. A property the body never read does not trigger an update. The older `ObservableObject` works at a coarser level, as the table below shows.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" width="640" height="240" role="img" aria-labelledby="t-rd d-rd" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-rd">Only the view that reads a changed property is updated</title>
<desc id="d-rd">A Book model has two properties, title and isAvailable. When title changes, the view Text(title), which reads it, is updated. The view Text(isAvailable) does not read title and is left unchanged.</desc>
<defs><marker id="rd-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="rd-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="88" width="180" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="110" y="116" text-anchor="middle" fill="#160572" font-weight="600">Book (@Observable)</text>
<text x="110" y="136" text-anchor="middle" fill="#2c2c2c" font-size="13">title changes</text>
<rect x="430" y="30" width="190" height="64" rx="10" fill="#160572"/>
<text x="525" y="58" text-anchor="middle" fill="#ffffff" font-weight="600">Text(title)</text>
<text x="525" y="78" text-anchor="middle" fill="#ffffff" font-size="13">reads title: updated</text>
<rect x="430" y="146" width="190" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="525" y="174" text-anchor="middle" fill="#160572" font-weight="600">Text(isAvailable)</text>
<text x="525" y="194" text-anchor="middle" fill="#2c2c2c" font-size="13">reads isAvailable: left alone</text>
<line x1="202" y1="108" x2="428" y2="66" stroke="#2544a0" stroke-width="2" marker-end="url(#rd-a)"/>
<line x1="202" y1="132" x2="428" y2="178" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#rd-b)"/>
<text x="300" y="72" text-anchor="middle" fill="#2c2c2c" font-size="13">1 depends on title</text>
<text x="300" y="186" text-anchor="middle" fill="#2c2c2c" font-size="13">2 no dependency</text>
</svg>
<figcaption>Simplified: when title changes, only the view whose body reads title is updated.</figcaption>
</figure>

## Step by step

1. SwiftUI runs `body`; each `@Observable` property read there becomes a dependency of the view.
2. A property changes, for example `book.title`.
3. SwiftUI computes only the views that depend on `title`, and updates them.
4. A view that read only `isAvailable` is left alone.
5. `@State` storage lives in SwiftUI, so a view struct can be created again and still keep its value.

```swift
@Observable class Book { var title = ""; var isAvailable = true }

struct TitleView: View {
    let book: Book
    var body: some View { Text(book.title) }  // depends on title, not isAvailable
}
```

| | `ObservableObject` | `@Observable` |
|---|---|---|
| What updates the view | Any `@Published` property changing, even one the view does not read | Only a property the view's `body` reads |

## Why it matters

The upside is fewer needless updates. The cost is that every property `body` reads is a dependency, so keep `body` fast and its reads few, as Apple advises.

## Sources

- [Managing model data in your app — Apple Developer Documentation](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app) — a view depends on the Observable properties its body reads, and `@State` reconnects a recreated view to the same model instance
- [Migrating from the Observable Object protocol to the Observable macro — Apple Developer Documentation](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro) — with `ObservableObject` any changed `@Published` property updates the view, with Observable only a read property does
- [Understanding and improving SwiftUI performance — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/understanding-and-improving-swiftui-performance) — a view is computed again when its dependencies change, and `body` should stay fast with limited dependencies
