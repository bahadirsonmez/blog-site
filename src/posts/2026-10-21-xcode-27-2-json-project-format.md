---
title: "Xcode 27.2 RC adds a JSON project format. Try it on a branch"
description: "Xcode 27.2 RC can store your project as JSON (.xcproj) next to project.pbxproj. How to switch, what Apple promises, and what to check in the diff."
date: 2026-10-21
tags: [apple-dev]
status: ready
---

Xcode 27.2 RC can save your project in a JSON-based format, `.xcproj`, instead of `project.pbxproj`. The idea to keep: switching is one menu item and Apple says it can be reverted in source control, so try it on a branch and read the diff before you trust it.

## What shipped

Apple released Xcode 27.2 RC (build 27B48) on October 19, 2026. It is a release candidate: the Releases page does not list a final version yet. The RC includes Swift 6.4 and needs macOS Tahoe 26.6 or later.

The new feature is called Project Format. The release notes say Xcode now supports a JSON-based project format, `.xcproj`. Apple's reasons are that the file is more readable, friendlier to merges, and easier for coding agents to edit. A project saved this way also opens in earlier Xcode 27 releases, and Xcode 27 and later support both formats.

Those are Apple's claims. I did not find an independent measurement of any of them, so read "fewer merge conflicts" as a promise to test, not a result.

## How to switch

Apple's documentation page gives the steps:

1. Select the project in the Project navigator.
2. Open the File inspector and find Project Document, then the Project Format menu.
3. Choose JSON. If a window appears, choose Continue.

After that, the change shows up in your repository as `project.pbxproj` removed and `.xcproj` added. Apple notes that you can revert the file changes in source control.

That last part is why I would do it on a branch first:

```sh
git switch -c try-json-project-format
# switch Project Format in Xcode, then:
git status
git diff --stat
```

If it worked the way Apple describes, the output shows `project.pbxproj` removed and `.xcproj` added. Build and run once before you commit anything, so you know the project still behaves the same.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" width="640" height="220" role="img" aria-labelledby="t-xproj d-xproj" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-xproj">Switching an Xcode project to the JSON format</title>
<desc id="d-xproj">Three boxes from left to right: the existing project.pbxproj, the Project Format setting in the File inspector set to JSON, and a review of the diff. A dashed arrow leads from the review back to the first box: the change can be reverted in source control.</desc>
<defs><marker id="xproj-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="xproj-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="50" width="170" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="82" text-anchor="middle" fill="#160572" font-weight="600">project.pbxproj</text>
<text x="105" y="104" text-anchor="middle" fill="#2c2c2c" font-size="13">existing format</text>
<rect x="235" y="50" width="170" height="72" rx="10" fill="#160572"/>
<text x="320" y="82" text-anchor="middle" fill="#ffffff" font-weight="600">Project Format</text>
<text x="320" y="104" text-anchor="middle" fill="#ffffff" font-size="13">File inspector: JSON</text>
<rect x="450" y="50" width="170" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="82" text-anchor="middle" fill="#160572" font-weight="600">Review the diff</text>
<text x="535" y="104" text-anchor="middle" fill="#2c2c2c" font-size="13">.xcproj added</text>
<line x1="192" y1="86" x2="233" y2="86" stroke="#2544a0" stroke-width="2" marker-end="url(#xproj-a)"/>
<line x1="407" y1="86" x2="448" y2="86" stroke="#2544a0" stroke-width="2" marker-end="url(#xproj-a)"/>
<path d="M535 124V168H105V126" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#xproj-r)"/>
<text x="212" y="76" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="427" y="76" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="320" y="196" text-anchor="middle" fill="#2c2c2c" font-size="13">3 revert in source control if needed</text>
</svg>
<figcaption>Arrows 1 and 2 follow Apple's steps; the dashed arrow 3 is the way back if the diff looks wrong.</figcaption>
</figure>

## What to check before it reaches main

**The diff itself.** Apple says the JSON format makes configuration changes in a comparison view match the actions you take in Xcode. That is checkable: change one build setting, then see whether the diff reads like what you did.

**Merge conflicts.** This is the promise that matters most to a team, and only your own history can confirm it. On my solo projects I don't run into `project.pbxproj` conflicts, but on team projects I do now and then.

**Anything that names the old file.** If a script or CI step in your repository points at `project.pbxproj` by path, it is worth a look before you merge the switch. This is my inference: Apple's page says nothing about third-party tools, so I can't tell you which ones handle `.xcproj`.

**Older Xcode versions.** Apple's note says projects in the new format open in earlier Xcode 27 releases. It does not say anything about Xcode 26 or older, so check any teammate or CI machine that is not on Xcode 27 before the format lands on main.

**Coding agents.** Apple highlights easier editing by agents as a reason for the format. Easier to edit does not mean safe to edit unreviewed: if an agent touches your project file, read that diff like you read its code.

## A small experiment worth running

Do not judge the format by reading about it. Pick one change you make often, such as adding a file to a target or changing a build setting, and make it twice: once on your current format and once on a branch with JSON. Put the two diffs side by side. If the JSON diff is shorter and says what you did, Apple's readability claim holds for your project. If it does not, you found that out before your team did.

Then run the merge test. Create two branches that each add a different file to the same target, and merge one into the other, once on each format. Count the conflicts. One small project proves little, but it is more evidence than a release note.

## One more thing in the RC: deployment targets

The 27.2 release notes list a known issue: the Xcode 27.2 SDKs for macOS, watchOS, tvOS and visionOS report 27.1 as a valid deployment target, and building with that target can behave unexpectedly. Mac Catalyst has a related note: with a 27.1 or 27.2 deployment target, new APIs may not be usable. While you test the RC, I would not raise a deployment target just to try something.

## Where this leaves things

Nothing forces you to switch today: both formats work in Xcode 27 and later, and the 27.2 build is still a release candidate. The cheap experiment is a branch, one menu choice and a close look at the diff. If it reads well and your tooling copes, you have something to bring to your team. If it does not, Apple says you can revert in source control.

## Sources

- [Releases — Apple Developer](https://developer.apple.com/news/releases/) — Xcode 27.2 RC (27B48) released October 19, 2026; no final version listed yet
- [Xcode 27.2 Release Notes](https://developer.apple.com/documentation/xcode-release-notes/xcode-27_2-release-notes) — Swift 6.4, macOS Tahoe 26.6 requirement, the Project Format feature (JSON-based `.xcproj`, File inspector, opens in earlier Xcode 27 releases), the deployment target known issue
- [Updating your Xcode project configuration file format — Apple Developer](https://developer.apple.com/documentation/xcode/updating-your-xcode-project-configuration-file-format) — the steps to switch, `.pbxproj` removed and `.xcproj` added in the diff, reverting in source control, support for both formats in Xcode 27 and later, Apple's claims on diffs, merges and coding agents
