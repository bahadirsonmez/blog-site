---
title: "Siri AI opens to every app: what to do with App Intents"
description: "Siri AI Developer Preview lets any app give Siri custom actions and content through App Intents, but only in dev builds and TestFlight internal testing."
date: 2026-11-04
tags: [apple-dev, ai]
status: draft
---

## Why this topic

Why now: Apple opened the Siri AI Developer Preview on November 3 with the 27.3 betas, and App Store submission opens in the spring, so the preparation window starts now. Question it answers: how does my app give Siri AI its own actions, and what does the preview not cover yet? Claims rest on Apple Developer News (November 3), the App Intents pages for the Siri AI Developer Preview, custom actions, app skills and Spotlight entities, and on Apple Newsroom (June 8 and September 14) for the earlier steps. I did not assert that any of my own apps already uses App Intents: no source says so. No official press image: the Developer News hero image is on Apple's CDN, a different domain from the source page, and it shows the Siri AI icon, not the news. Publish slot: Thursday 15:00 Turkey time, 13:00 Berlin.

<!-- end why -->

On November 3 Apple opened a Siri AI Developer Preview to every developer: with the 27.3 betas, any app can hand Siri AI its own custom actions and content through App Intents. The catch is that it works only in development builds and TestFlight internal testing for now, so this is a window to prepare, not to ship.

## In short

- Siri AI can now find custom content and run custom actions in your app, not only what fits Apple's system-defined schemas. You mark an App Intent with `@AppIntent(.tool)`.
- For multi-step jobs there are app skills: a skills bundle in your Xcode project with a `SKILL.md` per skill, a subset of the Agent Skills format.
- It is a preview. Only development-signed device builds and TestFlight internal testers get it; App Store submission opens in the spring.
- The one thing to check: whether your most useful one or two actions can be written as small, well-described App Intents.

| | June to September | 3 November |
|---|---|---|
| What Siri can reach in your app | content and functions that fit system-defined schema domains | custom actions and custom content too |
| Languages | English at launch, five more announced for "next month" | English, French, Japanese, Korean, Portuguese, Spanish; Turkish "coming soon", no date |
| Who can try your integration | Siri AI developer testing began on the iOS 27, iPadOS 27, macOS 27 and visionOS 27 betas | development-signed device builds and TestFlight internal testers; not external TestFlight, not the App Store |
| EU (iOS, iPadOS, watchOS) | not available | not available; Apple says it is looking for a way |
| First customer release | not published | App Store submission opens in the spring; customers a few months after the preview, no date |

## Then and now

The table above shows how far this step goes. Apple announced Siri AI in [June](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/), and it shipped as a beta in [September](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/). The June announcement talked about personal context and Spotlight and did not mention App Intents. This week's documentation does, and that is the new part.

I wrote about Siri AI in passing in [Your iPhone widget can now show up on Apple HomeView](https://blog.bahadirsonmez.com/posts/iphone-widgets-on-apple-homeview/), where the EU gap already showed up. It is still there.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160" width="640" height="160" role="img" aria-labelledby="t-siri d-siri" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-siri">Siri AI so far, from announcement to the App Store window</title>
<desc id="d-siri">Four boxes from left to right: June 8, developer testing; September 14, English-only beta; November 3, custom actions open in a preview; spring, App Store submissions open.</desc>
<defs><marker id="siri-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="10" y="44" width="128" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="74" y="76" text-anchor="middle" fill="#160572" font-weight="600">Jun 8</text>
<text x="74" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">developer testing</text>
<rect x="174" y="44" width="128" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="238" y="76" text-anchor="middle" fill="#160572" font-weight="600">Sep 14</text>
<text x="238" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">English-only beta</text>
<rect x="338" y="44" width="128" height="72" rx="10" fill="#160572"/>
<text x="402" y="76" text-anchor="middle" fill="#ffffff" font-weight="600">Nov 3</text>
<text x="402" y="98" text-anchor="middle" fill="#ffffff" font-size="13">custom actions</text>
<rect x="502" y="44" width="128" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="566" y="76" text-anchor="middle" fill="#160572" font-weight="600">Spring</text>
<text x="566" y="98" text-anchor="middle" fill="#2c2c2c" font-size="13">submissions open</text>
<line x1="140" y1="80" x2="172" y2="80" stroke="#2544a0" stroke-width="2" marker-end="url(#siri-a)"/>
<line x1="304" y1="80" x2="336" y2="80" stroke="#2544a0" stroke-width="2" marker-end="url(#siri-a)"/>
<line x1="468" y1="80" x2="500" y2="80" stroke="#2544a0" stroke-width="2" marker-end="url(#siri-a)"/>
</svg>
<figcaption>Siri AI so far: the June announcement, the September beta, this week's preview for custom actions, and the spring App Store window Apple mentions.</figcaption>
</figure>

## Custom actions with App Intents

Apple's documentation says Siri used to work mainly with data and functions that match system-defined app schema domains. Now it can also work with custom actions and custom information, but only what you expose through App Intents. There is no new entitlement and no separate program: you update the App Intents code you already have.

The mechanical part is small. Add the `@AppIntent(.tool)` macro to an existing or new App Intent, and it adds `ToolIntent` conformance. If the intent already fits a schema in a main domain, such as `sendMessage` in a messaging app, you do not add the macro. Where a schema is also supported by Shortcuts, you write `@AppIntent(.tool, schema:)`, for example `.tool, schema: .journal.createEntry`. Siri tells intents apart by their `title` and `description`, and every `@Property`, `@DeferredProperty` and `@ComputedProperty` of an entity needs a `description` too.

To be found, an entity has to be in Spotlight: conform it to `IndexedEntity` and index it with `indexAppEntities(_:priority:)` on a named `CSSearchableIndex`. Apple says the default index is only for prototypes.

Privacy is your call. By default, entities do not ask for authentication before Shortcuts or Siri show them. For sensitive data, Apple's example is a bank account: `IntentAuthenticationPolicy` can require authentication, and `visibility: .internal` hides an app-only property from Siri and Shortcuts.

In some cases people do not have to say your app's name: your app in the foreground, a Live Activity running, or a Siri conversation that already mentioned it. Siri can also show your content in a card with your own views.

## Skills for bigger jobs

A single tool intent does one thing. For multi-step jobs, Apple adds app skills: you add a `Skills.skillsbundle` to your project (one per target), and each skill is a folder with a `SKILL.md` inside. The frontmatter takes a `name` (1 to 64 characters, the same as the folder name) and a one-line `description` of up to 1,024 characters. The body is free text of up to 10,000 characters, and Siri reads it only after it has decided the skill fits the request.

Apple says skills use a subset of the Agent Skills format. My reading: it is the same folder-with-a-`SKILL.md` idea I wrote about in [Agent Skills moves to a foundation. A skill is just a folder](https://blog.bahadirsonmez.com/posts/agent-skills-foundation/), cut down. Other frontmatter fields and support files such as scripts are not supported. And a skill does not force behaviour: Siri does not run the tool intents you list in order, the skill only gives it more to go on.

## The good and the not-so-good

Good:

- No new entitlement or program; existing App Intents code is the starting point.
- Xcode gets a Siri Integration Advisor for feedback on your intents and a Siri Evaluations framework that sends scripted requests to Siri, so you can measure what your edits change.

Not so good:

- It is a preview, and the App Intents API and Siri behaviour can change during it.
- It does not reach external TestFlight testers or the App Store; submission opens in the spring and customers get the first release a few months after the preview.
- Siri AI is not available on iOS, iPadOS and watchOS in the EU, and under-13 users do not get it.
- Server-side features have a daily usage limit, extended access will be paid later, and the terms for Siri AI experiences are still to come.
- Skills are not deterministic.

My take, not fact: since Siri finds only what you offer, small and clearly named actions look like the safest start.

## What I would do

My suggestions, not facts:

1. Install the 27.3 betas and Xcode 27.3 beta on a real device. Apple says to validate skills on a device, not in Simulator.
2. Pick one or two actions people would actually ask for, and turn them into App Intents with a clear `title` and `description`.
3. Put the entities behind them in Spotlight with `IndexedEntity`.
4. Decide what is sensitive: add an authentication policy, or mark app-only properties `visibility: .internal`.
5. Run Siri Integration Advisor and Siri Evaluations before you touch anything else.
6. Write a skill only when a job really takes several steps.
7. Do not promise this to users yet: it is not in App Store builds.

Apple lists a Group Lab with its engineers on November 5 if you want to ask questions.

## Sources

- [Siri AI is now open to all developers — Apple Developer News](https://developer.apple.com/news/?id=gdk2umrf) — the preview, 27.3 betas, custom actions and skills, languages, EU, limits, spring App Store submission, the Group Labs
- [Siri AI Developer Preview — Apple Developer Documentation](https://developer.apple.com/documentation/appintents/siri-ai-developer-preview) — what changed for Siri, no new entitlement, the usage scenarios, Siri Integration Advisor and Siri Evaluations, testing limits
- [Bringing custom actions and content to Siri — Apple Developer Documentation](https://developer.apple.com/documentation/appintents/bringing-custom-actions-and-content-to-siri) — `@AppIntent(.tool)`, schemas, descriptions, authentication policy and `visibility: .internal`
- [Orchestrating complex actions with app skills — Apple Developer Documentation](https://developer.apple.com/documentation/appintents/orchestrating-complex-actions-with-app-skills) — the skills bundle, `SKILL.md` limits, the Agent Skills subset, no deterministic behaviour
- [Making app entities available in Spotlight — Apple Developer Documentation](https://developer.apple.com/documentation/appintents/making-app-entities-available-in-spotlight) — `IndexedEntity`, `indexAppEntities(_:priority:)`
- [Get ready with the latest beta releases — Apple Developer News](https://developer.apple.com/news/?id=6gpufove) — the 27.3 betas and Xcode 27.3
- [Apple introduces Siri AI — Apple Newsroom, June 8, 2026](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/) — the announcement, developer testing from that day, no EU on iOS, iPadOS and watchOS
- [Siri AI is here — Apple Newsroom, September 14, 2026](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/) — the English-only beta, more languages the next month
- [Your iPhone widget can now show up on Apple HomeView — this blog](https://blog.bahadirsonmez.com/posts/iphone-widgets-on-apple-homeview/) — my earlier post, where the EU gap for Siri AI came up
- [Agent Skills moves to a foundation. A skill is just a folder — this blog](https://blog.bahadirsonmez.com/posts/agent-skills-foundation/) — my earlier post on the format that app skills build on
- [Donating Agent Skills to the Agentic AI Foundation — Anthropic](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation) — a skill is a folder with a `SKILL.md`

## LinkedIn

🗣️ Siri AI is now open to every #iOSDevelopment app as a developer preview.

Before → now:
• Before: Siri reached only what fit its system-defined schema domains
• Now: your custom actions and content too, through #AppIntents, plus short skill files for multi-step jobs

✅ No new entitlement, just updates to your existing App Intents code
⚠️ For now it works only in dev builds and TestFlight internal; App Store submissions open in the spring

Siri AI launched in September as an English-only beta; this preview lets your own app add custom actions, so it's a window to prepare, not to ship.

More details:
https://blog.bahadirsonmez.com/posts/siri-ai-app-intents/?utm_source=linkedin&utm_medium=social&utm_campaign=siri-ai-app-intents

## X

eylülde sadece ingilizce çıkmıştı, şimdi siri ai kendi eylemlerini veren her uygulamaya açık. ama önizleme, App Store baharda, AB'de yok 😅
more details:
https://blog.bahadirsonmez.com/posts/siri-ai-app-intents/?utm_source=x&utm_medium=social&utm_campaign=siri-ai-app-intents
