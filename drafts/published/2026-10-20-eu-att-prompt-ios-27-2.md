---
title: "iOS 27.2 adds a second ATT prompt in the EU. What to check"
description: "iOS 27.2 brings an expanded App Tracking Transparency prompt to the EU, required in five countries, with a new API call and a once-a-year re-ask rule."
date: 2026-10-20
tags: [apple-dev]
status: draft
---

## Why this topic

Why now: Apple announced the EU change on September 16, 2026, but the details a developer needs only became concrete this week. iOS & iPadOS 27.2 RC and Xcode 27.2 RC were released on October 19, 2026, and the RC release notes plus the new API reference page now carry the final method name, the "Additional Information" button behavior and the one-year re-prompt rule. The final 27.2 release date is not confirmed in the sources, so the post says "soon" and gives no date. Search question it answers: "ATT prompt EU iOS 27.2 requestTrackingAuthorization preferExpandedInterface". Primary sources: Apple Developer News (Sep 16), the "User privacy and data use" page, the API reference page for the new method, the iOS & iPadOS 27.2 RC release notes and Apple's Releases page. No Swift snippet: the method is a 27.2 SDK API, so only its signature is quoted from Apple's reference. The post uses the final API name only; the beta name is left out on purpose. No app is promoted. Publish slot: Wednesday 15:00 Turkey time, 14:00 Berlin.

<!-- end why -->

In iOS 27.2, the App Tracking Transparency prompt gets a second form in the EU: a full-page, expanded version. In five countries it is the only form you can show, and it comes with a new method and a rule that you cannot ask the same user again for a year.

The rule for when you need to ask does not change. What changes is what the user sees and what your code has to call.

## What Apple announced

Apple's announcement from September 16 says that, beginning with iOS 27.2 and iPadOS 27.2, developers have the option to use an alternative version of the ATT system prompt in the EU. It also says the requirements for when you must seek permission to track users stay the same.

The option becomes an obligation in some places. Apple's wording: due to legal requirements, only the alternative version of the system prompt is available for apps distributed in Germany, France, Italy, Poland and Romania. The iOS 27.2 RC release notes say the same from the system side: the alternative prompt is required for users in those five countries.

So the question for your app is not "do I need to ask". It is "which prompt will my users get, and does my code ask in a way that supports it".

## The new call

The existing `requestTrackingAuthorization` call stays. Apple's reference documents a new one for iOS 27.2.0 and later:

`requestTrackingAuthorization(preferExpandedInterface:additionalInformationAction:completionHandler:)`

Three parameters matter:

- `preferExpandedInterface` is a `Bool`. It asks for the expanded prompt.
- `additionalInformationAction` is an optional closure. Apple's page says to pass `nil` to omit the button. The "Additional Information" link only appears when you give the closure.
- `completionHandler` receives the usual `ATTrackingManager.AuthorizationStatus`.

How the flag behaves depends on where the user is. Outside the EU, the method presents the system alert with your original `NSUserTrackingUsageDescription`, as before, and the new parameters have no effect. In the five countries above, the expanded prompt is shown regardless of what you set for `preferExpandedInterface`. In the rest of the EU, the flag is your option: Apple's reference lists these countries separately and says the full-page sheet is shown when `preferExpandedInterface` is `true`.

The two screens also differ in their buttons. The classic alert has "Ask App Not to Track" and "Allow". Apple's example image of the expanded sheet shows "Allow" and "Reject" instead.

<figure style="max-width:320px;margin:1.75rem auto"><img src="https://developer.apple.com/app-store/user-privacy-and-data-use/images/screen-att-eu-sheet-medium_2x.png" alt="An iPhone showing Apple's example of the expanded ATT sheet for a sample app named Example App. A text block headed App Explanation ends with a blue Additional Information link, and two full-width buttons at the bottom read Allow and Reject." width="320" loading="lazy" style="display:block;width:100%;max-width:320px;height:auto;margin:0 auto"><figcaption style="margin-top:.5rem;font-size:.9rem;color:#555">Apple's example of the expanded ATT sheet in the EU. <a href="https://developer.apple.com/app-store/user-privacy-and-data-use/">Image: Apple</a></figcaption></figure>

One more detail for the EU: the full-page sheet uses `NSUserTrackingMarkdownUsageDescription` if you define it. Apple's reference says it supports bold, italics, bullets and paragraphs.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" width="640" height="280" role="img" aria-labelledby="t-att d-att" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-att">Which ATT prompt a user sees in iOS 27.2</title>
<desc id="d-att">A decision flow. A box asks whether the user is in the EU. Outside the EU the classic system alert is shown and the new parameters are ignored. In Germany, France, Italy, Poland and Romania only the expanded prompt is shown. In other EU countries the preferExpandedInterface flag decides. After the user answers in the EU, the prompt is not shown again for one year.</desc>
<defs><marker id="att-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="104" width="150" height="64" rx="10" fill="#160572"/>
<text x="95" y="134" text-anchor="middle" fill="#ffffff" font-weight="600">User in the EU?</text>
<text x="95" y="154" text-anchor="middle" fill="#ffffff" font-size="13">iOS 27.2 or later</text>
<rect x="250" y="20" width="190" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="345" y="50" text-anchor="middle" fill="#160572" font-weight="600">Classic alert</text>
<text x="345" y="70" text-anchor="middle" fill="#2c2c2c" font-size="13">new parameters ignored</text>
<rect x="250" y="104" width="190" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="345" y="134" text-anchor="middle" fill="#160572" font-weight="600">Expanded prompt</text>
<text x="345" y="154" text-anchor="middle" fill="#2c2c2c" font-size="13">required: DE FR IT PL RO</text>
<rect x="250" y="188" width="190" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="345" y="218" text-anchor="middle" fill="#160572" font-weight="600">Other EU: your call</text>
<text x="345" y="238" text-anchor="middle" fill="#2c2c2c" font-size="13">preferExpandedInterface</text>
<rect x="490" y="104" width="130" height="64" rx="10" fill="#160572"/>
<text x="555" y="134" text-anchor="middle" fill="#ffffff" font-weight="600">User answers</text>
<text x="555" y="154" text-anchor="middle" fill="#ffffff" font-size="13">silent for a year</text>
<line x1="172" y1="116" x2="248" y2="64" stroke="#2544a0" stroke-width="2" marker-end="url(#att-a)"/>
<line x1="172" y1="136" x2="248" y2="136" stroke="#2544a0" stroke-width="2" marker-end="url(#att-a)"/>
<line x1="172" y1="156" x2="248" y2="214" stroke="#2544a0" stroke-width="2" marker-end="url(#att-a)"/>
<line x1="442" y1="136" x2="488" y2="136" stroke="#2544a0" stroke-width="2" marker-end="url(#att-a)"/>
<path d="M442 220H555V170" fill="none" stroke="#2544a0" stroke-width="2" marker-end="url(#att-a)"/>
<text x="196" y="80" text-anchor="middle" fill="#2c2c2c" font-size="13">no</text>
<text x="210" y="128" text-anchor="middle" fill="#2c2c2c" font-size="13">1 of 5</text>
<text x="196" y="200" text-anchor="middle" fill="#2c2c2c" font-size="13">other</text>
</svg>
<figcaption>Read left to right: the user's location picks the prompt, and an answer in the EU starts a one-year pause.</figcaption>
</figure>

## Three details that are easy to miss

**The yearly re-ask.** Apple's reference says that after the user responds, the system notes the date and does not allow the prompt to display again until a year passes. The privacy page words it as being able to re-prompt a user one year after the previous choice, regardless of whether that choice was to accept or reject. The RC release notes list this as part of the same feature: re-prompting on a yearly basis for EU users.

The practical effect is that a second call inside that year is not a retry. If your code asks on every launch until it sees `authorized`, a user in the EU who has answered will not see the prompt again for twelve months, whatever the answer was. If you want to ask again after a year, you need your own record of when and why, and a place in your flow where asking again makes sense.

**The "Additional Information" button.** When you pass a closure, the prompt shows "Additional Information". In Apple's example image it is a blue text link at the end of the explanation, not a button at the bottom next to "Allow" and "Reject". Apple's reference says that when the user taps it, the sheet dismisses without recording an answer, your closure runs, and the completion handler is called with `notDetermined`, so you have to call the method again to get a decision. Whatever your closure shows, usually your own explanation screen, has to lead somewhere: back to the prompt, or to an explicit "not now". If you want the button, plan the screen first. If you do not, pass `nil`.

**The rename.** The RC release notes list a Resolved Issue: the API name changed during the beta, and the Objective-C name changed too. Code or blog snippets written against an early 27.2 beta can fail to compile for that reason. Check the parameter labels against Apple's reference page, not against a snippet you found earlier.

## What to check this week

1. Look at where you call `requestTrackingAuthorization`. The sources I used do not say what the old call shows in the five required countries, so test that case rather than assume it. Decide whether you want the expanded form elsewhere in the EU too.
2. If you adopt the new call, remember it is iOS 27.2.0 and later. Keep your old call for earlier systems, behind an availability check.
3. Decide on the Additional Information button before you write code. Passing `nil` is a valid answer.
4. Look for loops that re-ask. Under the one-year rule, a second request in the same year does not show anything.
5. Check your `NSUserTrackingUsageDescription`. Outside the EU it is still the text users see in the system alert. For the full-page sheet in the EU, consider adding `NSUserTrackingMarkdownUsageDescription`, which supports bold, italics, bullets and paragraphs.
6. Test on a real device or a configuration where you can confirm the region behavior, rather than assuming it from reading. The sources I used describe the behavior but I have no first-hand test of it.

Apple's wording is careful about one more thing, so I will be too: nothing in these sources says you have to design a new screen. The change is the prompt format, the five required countries and the yearly rule.

iOS 27.2 reached release candidate status on October 19, together with Xcode 27.2 RC. The final release date is not stated in the sources, so treat this as a "soon" and read the RC notes for the ATT section before your next build.

## Sources

- [Apple Developer News: App Tracking Transparency changes in the EU (September 16, 2026)](https://developer.apple.com/news/?id=idsft9ai) — alternative ATT prompt from iOS 27.2 and iPadOS 27.2, unchanged requirements, the five countries where only the alternative prompt is available
- [User privacy and data use — Apple Developer](https://developer.apple.com/app-store/user-privacy-and-data-use/) — "ATT in the European Union" section: Additional Information button, re-prompt one year after the previous choice, example image of the expanded sheet with "Allow" and "Reject" buttons
- [requestTrackingAuthorization(preferExpandedInterface:additionalInformationAction:completionHandler:) — Apple Developer Documentation](https://developer.apple.com/documentation/AppTrackingTransparency/ATTrackingManager/requestTrackingAuthorization(preferExpandedInterface:additionalInformationAction:completionHandler:)) — signature, iOS 27.2.0 availability, `nil` omits the button, behavior outside the EU, in the five countries and in the rest of the EU, `NSUserTrackingMarkdownUsageDescription` for the full-page sheet, answer not recorded on Additional Information, one-year rule
- [iOS & iPadOS 27.2 Release Candidate Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27_2-release-notes) — expanded prompt and yearly re-prompting for EU users, required in France, Germany, Italy, Poland and Romania, API rename in Resolved Issues
- [Releases — Apple Developer](https://developer.apple.com/news/releases/) — iOS 27.2 RC (24B115) and Xcode 27.2 RC (27B48), October 19, 2026

## LinkedIn

🔔 Same ATT rule, different screen: iOS 27.2 adds an expanded tracking prompt in the EU 🇪🇺

- Required in Germany, France, Italy, Poland and Romania, optional elsewhere in the EU
- New call: preferExpandedInterface plus an optional "Additional Information" button
- Once a user answers, you can't ask again for a year

If you ship in the EU, the RC notes are worth a read before your next build.

https://blog.bahadirsonmez.com/posts/eu-att-prompt-ios-27-2/?utm_source=linkedin&utm_medium=social&utm_campaign=eu-att-prompt-ios-27-2

#iOSDevelopment #Swift #IndieDev #BuildInPublic

## X

iOS 27.2 ile AB'de ATT izin ekranı tam sayfa geliyor, 5 ülkede zorunlu. Kullanıcı cevap verince bir yıl tekrar soramıyorsun 👀 #iOS
https://blog.bahadirsonmez.com/posts/eu-att-prompt-ios-27-2/?utm_source=x&utm_medium=social&utm_campaign=eu-att-prompt-ios-27-2
