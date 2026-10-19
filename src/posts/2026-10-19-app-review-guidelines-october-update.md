---
title: "Apple updated the App Review Guidelines: three rules to re-read"
description: "Apple's October 16 guideline update targets nudification and bait-and-switch apps, but 2.5.19, 2.3.14 and 1.2 touch ordinary indie apps too."
date: 2026-10-19
tags: [apple-ecosystem]
status: ready
---

Apple revised the App Review Guidelines on October 16. The headline is about "nudification" apps and bait-and-switch tactics, but three of the changes apply to ordinary indie apps, including mine, and are worth ten minutes of your time before your next submission.

## What changed

Apple's own change list is short. The items that matter for most developers:

- **2.5.19** is a new guideline on hidden, dormant, or undocumented features. Apple says it clarifies a long-standing policy that used to live under 2.3.1.
- **2.3.14** is a new guideline covering the creative assets Apple introduced for product page headers and search results.
- **1.2** (user-generated content) now names AI content creation apps explicitly and adds nonconsensual intimate imagery, including AI-generated imagery, to the content apps must prevent and remove.
- **Section 5** now states that apps facilitating human trafficking or child exploitation are removed from the App Store and blocked from alternative distribution.

In the companion post Apple also says it blocked over 150K apps with safety issues and terminated over 193K developer accounts for fraud and abuse last year. That is the context: the update is aimed at coordinated fraud, not at you. The wording still binds everyone.

## 2.5.19: dormant features and your feature flags

The new text reads: "Don't include any hidden, dormant, or undocumented features in your app; your app's functionality should be clear to end users and App Review." Hiding undocumented features in the binary, for example through code obfuscation, is grounds for removal and account termination.

The companion post is more specific about the target: apps that misrepresent what they do during review and then change after approval, "for example, adding features or functionality that weren't included in the version of the app that was submitted to App Review."

Here is my reading, and this part is inference, not Apple's words. A remote feature flag by itself is not what Apple is describing. The pattern they describe is code that is dark during review and wakes up afterwards, with reviewers never seeing what it does. The safe side of the line is the one 2.3.1(a) has always asked for: describe new functionality with specificity in Notes for Review and make it accessible to the reviewer. So, before you submit:

- If a feature ships behind a flag, mention it in Notes for Review and give the reviewer a way to see it, such as enabling the flag for the review period or including a demo account with it on.
- Do not ship a feature in a dormant state that only a later server switch reveals, unless the reviewer has been told and can test it.
- Strip debug menus, hidden gestures and developer screens from release builds. "Undocumented" covers things you forgot about, not only things you meant to hide.

I do ship features behind remote flags in my apps, and until now I never mentioned them in Notes for Review. From my next submission on, every flag-gated feature goes into the notes, with a way for the reviewer to turn it on.

## 2.3.14: the new creative assets now have a rule

On October 5 Apple introduced creative assets: image and video assets for the product page header and for search results, managed through a new Asset Library in App Store Connect, with a preview tool that shows how they render in Dark Mode and on different devices. Eleven days later they got their own guideline.

2.3.14 says creative assets "must pertain to your app's content and functionality or overarching brand, follow standard metadata guidelines, and be appropriate for all audiences." They must not include inappropriate content, references to other apps with an intent to mislead, unverifiable product claims, or specific or discounted pricing information.

Two practical consequences. First, a header that says "50% off this week" is out, even though a seasonal campaign is exactly what Apple suggests these assets are for. Promote the season, not the price. Second, "appropriate for all audiences" applies regardless of your app's age rating, so a 17+ game still needs an all-ages header. Apple's asset best practices page has templates and more detail; read it before you brief a designer.

## 1.2: AI content creation apps are now named

Guideline 1.2 has always required four things from apps with user-generated content: a filter for objectionable material, a way to report content with timely responses, the ability to block abusive users, and published contact information. The scope line now reads: "This includes social media, user-generated content platforms, and AI content creation apps."

The new paragraph adds teeth. Developers "who fail to implement appropriate safeguards or fail to remediate identified violations after notice may be considered in violation of the Developer Code of Conduct." Apple's process is: ask you to remove the content and provide a compliance plan, possibly remove the app until you do, and remove repeat offenders from the Developer Program.

If your app lets users generate images or text with an AI model and share them with other users, you are now clearly inside 1.2. If generation is private to the user and nothing is shared, the guideline text does not obviously apply, but that is my inference and Apple has not said so. An in-app way to report a bad output and a contact address cost little and remove the question.

In HealthBar, Master Ronnie's chat generates text, but nothing is shared between users, so I treat it as outside 1.2. The app has no way to report an AI reply yet, and after this update adding one is on my list.

## The ten-minute check

1. Open your Notes for Review template. Does it list every flag-gated or server-enabled feature in the build, and how the reviewer can reach it?
2. Grep your release build for debug menus, hidden gestures and test-only screens.
3. If you have uploaded creative assets, check them against 2.3.14: no prices, no discounts, no unverifiable claims, all-ages content.
4. If users can generate or share content, confirm the four 1.2 requirements exist in the app, not only on your website.

Translations of the new guidelines arrive within a month. The English text is live now, and it is the one App Review uses.

## Sources

- [Updated App Review Guidelines are now available](https://developer.apple.com/news/?id=92th7e5i) — Apple Developer News, October 16, 2026; the official change list (1.2, 2.3.14, 2.5.19, 3.1.1(a), Section 5)
- [Strengthening App Review Guidelines against nonconsensual intimate imagery and bait-and-switch apps](https://developer.apple.com/news/?id=vvzx6cul) — Apple Developer News, October 16, 2026; intent behind the changes, the 150K/193K figures, the "adding features after review" example
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — live text of 1.2, 2.3.1, 2.3.14, 2.5.19 and Section 5 quoted in the post
- [Showcase your apps with new assets on the App Store](https://developer.apple.com/news/?id=ljpl7kyn) — Apple Developer News, October 5, 2026; creative assets, Asset Library and preview tool
- [App Store asset best practices and resources](https://developer.apple.com/app-store/asset-best-practices/) — Apple's templates and guidance for creative assets
