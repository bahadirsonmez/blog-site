---
title: "How an iOS app goes from launch to background"
description: "An iOS app launches into a scene, moves to the background when you leave, gets suspended, and can be disconnected by the system at any time."
date: 2026-11-28
tags: [how-it-works, apple-dev]
status: draft
---

## Why this topic

Answers what happens to an iOS app between launch and the background. Claims rest on three Apple documentation pages (launch, app life cycle, running in the background). Simplified on purpose: only the iOS 13+ scene model is described, and "scene" is treated as one window of the app; the iOS 12 app-based model, BackgroundTasks, background modes and extra background time are left out.

<!-- end why -->

An iOS app is a process with at least one scene, which for this post you can think of as one window of your app. The idea to keep: when the user leaves, the scene moves to the background and then to suspended, and UIKit can disconnect it at any time.

## The short version

At launch, UIKit creates the `UIApplication` object and the app delegate, starts the main event loop, and then connects the app's scene. When the user leaves, the scene goes to the background and then to suspended. To reclaim resources, UIKit can disconnect a background or suspended scene whenever it needs to.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" width="640" height="230" role="img" aria-labelledby="t-ia d-ia" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-ia">The states of an iOS scene from launch to suspended</title>
<desc id="d-ia">Five boxes from left to right: Unattached, Foreground active, Foreground inactive, Background, Suspended. Numbered arrows 1 to 4 connect them in order. A dashed arrow, number 5, goes from Suspended back to Unattached and means the system can disconnect the scene.</desc>
<defs><marker id="ia-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="ia-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="14" y="60" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="64" y="100" text-anchor="middle" fill="#160572" font-weight="600">Unattached</text>
<rect x="142" y="60" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="192" y="92" text-anchor="middle" fill="#160572" font-weight="600">Foreground</text>
<text x="192" y="112" text-anchor="middle" fill="#160572" font-weight="600">active</text>
<rect x="270" y="60" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="92" text-anchor="middle" fill="#160572" font-weight="600">Foreground</text>
<text x="320" y="112" text-anchor="middle" fill="#160572" font-weight="600">inactive</text>
<rect x="398" y="60" width="100" height="70" rx="10" fill="#160572"/>
<text x="448" y="100" text-anchor="middle" fill="#ffffff" font-weight="600">Background</text>
<rect x="526" y="60" width="100" height="70" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="576" y="100" text-anchor="middle" fill="#160572" font-weight="600">Suspended</text>
<line x1="116" y1="95" x2="140" y2="95" stroke="#2544a0" stroke-width="2" marker-end="url(#ia-a)"/>
<line x1="244" y1="95" x2="268" y2="95" stroke="#2544a0" stroke-width="2" marker-end="url(#ia-a)"/>
<line x1="372" y1="95" x2="396" y2="95" stroke="#2544a0" stroke-width="2" marker-end="url(#ia-a)"/>
<line x1="500" y1="95" x2="524" y2="95" stroke="#2544a0" stroke-width="2" marker-end="url(#ia-a)"/>
<text x="128" y="84" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="256" y="84" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="384" y="84" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
<text x="512" y="84" text-anchor="middle" fill="#2c2c2c" font-size="13">4</text>
<path d="M576 132V180H64V134" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ia-b)"/>
<text x="320" y="204" text-anchor="middle" fill="#2c2c2c" font-size="13">5 system can disconnect</text>
</svg>
<figcaption>Simplified: the numbers match the steps below.</figcaption>
</figure>

## Step by step

1. UIKit connects the scene and calls `scene(_:willConnectTo:options:)`; slow work here makes the app feel slow.
2. The user leaves, and the scene resigns active (`sceneWillResignActive(_:)`).
3. The scene enters the background and `sceneDidEnterBackground(_:)` is called; once it returns, UIKit takes a snapshot of your UI for the app switcher.
4. UIKit then suspends the app. In the background it gets no extra running time by default, so it should do as little as possible.
5. While the scene is in the background or suspended, the system can disconnect it at any time.

| Moment | What Apple suggests |
|---|---|
| Entering foreground active | Get your UI ready |
| Leaving it | Save data and calm your app's behavior |
| Entering background | Finish critical work, free memory, hide sensitive information |

## Why it matters

The upside is that the system can reclaim resources from apps the user has left. The cost is that it may disconnect your scene without warning, so save user data when the scene resigns active, not later.

## Sources

- [Responding to the launch of your app — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/responding-to-the-launch-of-your-app) — launch order (UIApplication, app delegate, event loop, scene), `scene(_:willConnectTo:options:)`, and keeping launch code quick
- [Managing your app's life cycle — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/managing-your-app-s-life-cycle) — scene states, UIKit disconnecting background or suspended scenes, and what to do at each transition
- [Preparing your UI to run in the background — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/preparing-your-ui-to-run-in-the-background) — the resign-active and enter-background callbacks, the snapshot, and no extra time by default
