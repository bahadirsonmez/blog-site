---
title: "Copilot lands in Xcode's own coding assistant: what to check"
description: "GitHub Copilot now runs inside Xcode's built-in coding assistant in the Xcode 27.3 beta, as a public preview. Here is what changed and what to check first."
date: 2026-11-06
tags: [apple-dev, ai]
status: ready
---

GitHub Copilot now works inside Xcode's own coding assistant. It is a public preview that starts with the Xcode 27.3 beta, and the separate Copilot extension stays, so there are now two ways in.

## In short

- On November 4, 2026 GitHub announced Copilot in Xcode's coding assistant, as a public preview that starts with the Xcode 27.3 beta.
- Apple's 27.3 beta notes list it under Coding Intelligence: "GitHub Copilot is now available in the coding assistant."
- The GitHub Copilot for Xcode extension remains available, and all Copilot plans are supported.
- The same beta brings UI tests with Swift Testing, a new `XCUIHinge` class, and Xcode as an `.aea` archive, with 27.3 the last release that supports `.xip`.

| | Xcode 27.2 | Xcode 27.3 beta |
|---|---|---|
| Release date | October 29, 2026 | November 3, 2026 |
| Build | 27B52 | 27C5020n |
| Needs | macOS Tahoe 26.6 or later | macOS Tahoe 26.6 or later |
| Copilot in the coding assistant | no Coding Intelligence change listed | yes, public preview |
| UI tests with Swift Testing | not in the notes | supported, with XCUIAutomation |
| Download format | not mentioned in the notes | `.aea` as well, last release with `.xip` |

## Then and now

The table shows that the requirement did not move and the coding assistant did. Xcode 27.2's notes have no Coding Intelligence section, so Copilot is the one new name this time. I covered that release in [Xcode 27.2 is out: what got fixed, what is still open](https://blog.bahadirsonmez.com/posts/xcode-27-2-what-changed/).

Copilot's road into Xcode has three earlier steps. On October 29, 2024 GitHub opened [code completion in Xcode as a public preview](https://github.blog/changelog/2024-10-29-github-copilot-code-completion-in-xcode-is-now-available-in-public-preview/), through an extension. On March 11, 2025 [Copilot Chat for Xcode became generally available](https://github.blog/changelog/2025-03-11-github-copilot-for-xcode-chat-is-now-generally-available/). And Xcode 27, from September 14, 2026, already added Google Gemini and Google Antigravity to the coding assistant, along with Agent Client Protocol support.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 256" width="640" height="256" role="img" aria-labelledby="t-cpx d-cpx" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-cpx">How Copilot got into Xcode, step by step</title>
<desc id="d-cpx">Four boxes in order. October 29, 2024: the Copilot extension with code completion. March 11, 2025: Copilot Chat generally available. September 14, 2026: Xcode 27 with Gemini, Antigravity and Agent Client Protocol support in the coding assistant. November 4, 2026: Copilot joins the coding assistant in the Xcode 27.3 beta. A dashed arrow from the last box leads to a box that says the beta needs macOS 26.6 or later.</desc>
<defs><marker id="cpx-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="12" y="24" width="136" height="112" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="80" y="56" text-anchor="middle" fill="#160572" font-weight="600">Oct 29, 2024</text>
<text x="80" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">Extension:</text>
<text x="80" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">code completion</text>
<rect x="172" y="24" width="136" height="112" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="240" y="56" text-anchor="middle" fill="#160572" font-weight="600">Mar 11, 2025</text>
<text x="240" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">Chat generally</text>
<text x="240" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">available</text>
<rect x="332" y="24" width="136" height="112" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="400" y="56" text-anchor="middle" fill="#160572" font-weight="600">Sep 14, 2026</text>
<text x="400" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">Xcode 27:</text>
<text x="400" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">Gemini, ACP,</text>
<text x="400" y="116" text-anchor="middle" fill="#2c2c2c" font-size="13">Antigravity</text>
<rect x="492" y="24" width="136" height="112" rx="10" fill="#160572"/>
<text x="560" y="56" text-anchor="middle" fill="#ffffff" font-weight="600">Nov 4, 2026</text>
<text x="560" y="80" text-anchor="middle" fill="#ffffff" font-size="13">Copilot joins the</text>
<text x="560" y="98" text-anchor="middle" fill="#ffffff" font-size="13">coding assistant,</text>
<text x="560" y="116" text-anchor="middle" fill="#ffffff" font-size="13">27.3 beta</text>
<rect x="432" y="190" width="188" height="48" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="526" y="220" text-anchor="middle" fill="#160572" font-weight="600">Needs macOS 26.6+</text>
<line x1="150" y1="80" x2="170" y2="80" stroke="#2544a0" stroke-width="2" marker-end="url(#cpx-a)"/>
<line x1="310" y1="80" x2="330" y2="80" stroke="#2544a0" stroke-width="2" marker-end="url(#cpx-a)"/>
<line x1="470" y1="80" x2="490" y2="80" stroke="#2544a0" stroke-width="2" marker-end="url(#cpx-a)"/>
<path d="M560 138V188" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#cpx-a)"/>
<text x="160" y="70" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="320" y="70" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="480" y="70" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
</svg>
<figcaption>From an extension in 2024 to a provider inside Xcode's own coding assistant, with the one requirement that comes with it.</figcaption>
</figure>

## Two ways to run Copilot in Xcode

GitHub's changelog says the integration is set up in Settings > Intelligence in Xcode and that the standalone GitHub Copilot for Xcode extension stays available. It needs macOS Tahoe 26.6 or later, which is also what the beta itself needs. Every Copilot plan is supported. Feedback goes to the GitHub Copilot for Xcode repository or to Apple's Feedback Assistant.

## What else is in the beta

- **UI tests.** You can now write UI tests with Swift Testing and XCUIAutomation, and a new `XCUIHinge` class sets the hinge angle on iPhone Duo.
- **Device Hub.** You can drag an app (`.app` or `.ipa`) onto a device to install it. A known issue: with Sidecar or a touch-enabled Mac only two touches get through, because three or more count as system gestures on macOS. Apple's workaround is turning off touch gestures in the Touch Display settings.
- **Xcode itself.** It now also ships as an Apple Encrypted Archive (`.aea`), unpacked on the command line with `archiveutil extractXcodeAEA`. Xcode 27.3 is the final release that supports the `.xip` format.

## What to check before you turn it on

Apple's page on setting up coding intelligence says that an agent can access your project files and other information while it processes requests. It also says that on managed devices an MDM profile can switch the coding assistant off with the key `CodingAssistantAllowExternalIntegrations` set to `false`.

That sentence is about agents in general. My take, not fact: assume anything you connect there can see your project, and read what it asks for in Settings > Intelligence before you sign in.

## The good and the not-so-good

Good:

- Copilot now sits in Xcode's own coding assistant, next to the other providers.
- All Copilot plans are supported, and the extension stays, so you can pick the path that suits you.

Not so good:

- It is a public preview, in a beta Xcode, and it needs macOS Tahoe 26.6 or later.
- Apple's page says agents can reach your project files.
- The sources I read do not say which models Copilot offers in Xcode's assistant, what it costs, or whether its agent features come along. The extension's repository page does not mention Xcode 27.3 yet.
- `.xip` ends with 27.3, which matters if a script downloads Xcode.

My take, not fact: this is worth trying, on a machine and a project where you are happy for the assistant to read the code.

## What I would do

My suggestions, not facts:

1. Install the beta next to your release Xcode, not instead of it.
2. Open Settings > Intelligence and read the permission text before you sign in to Copilot.
3. If the extension works for you, there is no rush to move; GitHub keeps it available.
4. If a script or CI job downloads Xcode, check which format it fetches. 27.3 is the last release with `.xip`.
5. If you manage Macs with MDM, look at the `CodingAssistantAllowExternalIntegrations` key.
6. Try writing one UI test with Swift Testing on a branch, and `XCUIHinge` if you target iPhone Duo.
7. If something misbehaves, report it in the extension's repository or with Feedback Assistant.

## Sources

- [GitHub Copilot is now available in Xcode's coding assistant — GitHub Changelog, November 4, 2026](https://github.blog/changelog/2026-11-04-github-copilot-is-now-available-in-xcodes-coding-assistant/) — public preview, starts with Xcode 27.3 beta, Settings > Intelligence, the extension stays, macOS Tahoe 26.6 or later, all Copilot plans, feedback channels
- [Xcode 27.3 Beta Release Notes — Apple Developer Documentation](https://developer.apple.com/documentation/xcode-release-notes/xcode-27_3-release-notes) — Copilot in the coding assistant, UI tests with Swift Testing, `XCUIHinge`, Device Hub changes and the two-touch known issue, `.aea` and the last `.xip` release, macOS requirement
- [Xcode 27.2 Release Notes — Apple Developer Documentation](https://developer.apple.com/documentation/xcode-release-notes/xcode-27_2-release-notes) — no Coding Intelligence section, the comparison column
- [Xcode 27 Release Notes — Apple Developer Documentation](https://developer.apple.com/documentation/xcode-release-notes/xcode-27-release-notes) — Gemini, Antigravity and Agent Client Protocol in the coding assistant
- [Setting up coding intelligence — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/setting-up-coding-intelligence) — agents can access project files, the MDM key
- [Releases — Apple Developer News](https://developer.apple.com/news/releases/) — dates and builds of Xcode 27, 27.2 and the 27.3 beta
- [GitHub Copilot code completion in Xcode is now available in public preview — GitHub Changelog, October 29, 2024](https://github.blog/changelog/2024-10-29-github-copilot-code-completion-in-xcode-is-now-available-in-public-preview/) — the extension's first step
- [GitHub Copilot for Xcode: Chat is now generally available — GitHub Changelog, March 11, 2025](https://github.blog/changelog/2025-03-11-github-copilot-for-xcode-chat-is-now-generally-available/) — Chat general availability
- [github/CopilotForXcode — GitHub](https://github.com/github/CopilotForXcode) — the open source extension; its page does not mention 27.3
- [Xcode 27.2 is out: what got fixed, what is still open — this blog](https://blog.bahadirsonmez.com/posts/xcode-27-2-what-changed/) — my earlier post on the previous release
