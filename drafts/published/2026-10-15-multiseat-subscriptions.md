---
title: "Multiseat subscriptions are on by default. Check yours before Oct 22"
description: "Apple turned multiseat purchases on for most subscriptions and Volume Purchasing opens October 22. Here is what to check in App Store Connect first."
date: 2026-10-15
tags: [apple-dev]
status: draft
---

## Why this topic

Why now: on Oct 13, 2026 Apple updated the Apple Developer Program License Agreement with new terms for Group Purchases (Schedule 2) and Volume Purchasing (Schedule 3), and every developer has to accept them. Volume Purchasing goes live on Oct 22, and multiseat purchases have been on by default for most subscriptions since Sept 16, so many indie developers are already opted in without having looked. Search question it answers: "what are multiseat subscriptions and do I need to do anything before October 22?". Sources: Apple's two news posts, the App Store Connect help pages for purchase options and pricing, and WWDC26 session 391. I did not find Apple documentation naming the StoreKit or App Store Server API fields for seats, so the post says so instead of guessing. Publish slot: Friday 15:00 Turkey time, 14:00 Berlin.

<!-- end why -->

If you sell an auto-renewable subscription with StoreKit 2, it can probably already be bought in bulk, because Apple turned multiseat purchases on by default. Volume Purchasing opens on October 22, 2026, so this week is a good time to decide whether you actually want that, and at what price.

## What changed

Apple announced two ways to sell one subscription to many people at WWDC26 and set the dates in a news post on September 16:

- **Volume Purchasing.** Organizations using Apple Business or Apple School Manager buy your subscription in one In-App Purchase and assign seats through their device management provider. This launches on **October 22, 2026**.
- **Group Purchases.** A regular App Store customer buys several seats and invites other people to join. Apple handles the invitation and seat assignment. This launches "this winter".

On October 13, Apple updated the Developer Program License Agreement. Among other changes, it adds terms for offering multiple seats through Group Purchases (Schedule 2) and for offering subscriptions to Apple Business and Apple School Manager organizations through Volume Purchasing (Schedule 3). You have to sign in and accept the new terms, so it is worth reading those schedules while you are there.

## Am I opted in?

Apple's App Store Connect help page is clear about the defaults:

- Multiseat purchases are **turned on by default for all auto-renewable subscriptions**.
- Subscriptions created **before September 14, 2026** that **don't use StoreKit 2**, or that have **Family Sharing** turned on, are opted out by default.
- Subscriptions in **custom apps** are automatically available on Apple Business and Apple School Manager, and you can't opt out.

So if your app uses StoreKit 2 and your subscription doesn't use Family Sharing, the answer is most likely yes.

You find the setting under your app's **Subscriptions**, then the subscription, then **Purchase Options**. It asks two questions: whether a customer can buy multiple seats, and where the subscription can be bought (the App Store, Apple Business, Apple School Manager). Apple Business and Apple School Manager only sell multiple seats; the App Store sells both individual and group purchases. You need the Account Holder, Admin or App Manager role to change it.

## Read the fine print before you flip anything

A few rules on that help page are easy to miss, and some of them can't be undone:

- Once a subscription is approved, **App Store availability can't be removed** from the purchase options.
- If you **turn multiseat off** later, new customers can only buy one seat and the subscription leaves Apple Business and Apple School Manager. Existing group subscriptions keep renewing until the group purchaser cancels. The purchaser can remove seats but can't add new ones.
- If you **remove Apple Business or Apple School Manager** from an approved subscription, those subscribers don't renew and are canceled at the end of their next renewal. Only the Account Holder can do this.
- With **Family Sharing** and multiseat both on, only the group purchaser can share with family. All other seats are for one person each. And Family Sharing, once on, can't be turned off.

My reading is that "on" is the low-risk default and "off later" is the one with consequences for real customers. If you are unsure, it's better to decide now, before October 22, than after an organization has bought 40 seats.

## Price it on purpose

By default every seat sells at your current price. In session 391, Apple shows **volume pricing**: up to five price bands, each with its own seat range and per-seat price. Apple's example uses $19.99 per seat per month for seats 1–20, $13.99 for 21–40 and $10.99 from seat 41, which works out to about 20% below the base price for a 50-seat purchase. The same session mentions plans available only on Apple School Manager, for verified educational institutions, with their own pricing.

Price increases also work differently for groups. According to Apple's pricing help page, the first seat follows the normal consent rules. Beyond the first seat, consent is needed if the group purchaser's total price goes up by more than 50%, or if they are in a country or region that needs consent for any increase. If the purchaser doesn't consent in time, **the entire subscription expires, including all seats**. One missed consent prompt can now cancel a whole team, so I would be careful with price increases on subscriptions that sell to groups.

## What your code has to do

Less than I expected. For Volume Purchasing, session 391 describes no purchase code at all: the organization buys outside your app, and your job is making the subscription available. For Group Purchases, you build the UI where the buyer picks a number of seats and pass that count into the StoreKit 2 purchase. Apple then creates the invite link, tracks who accepts, and handles cancellations.

The detail that matters for most apps: for each member assignment, the App Store creates a transaction, and you grant that member access. If your app already decides access from the current entitlements, the member's device is handled like any other subscriber:

```swift
import StoreKit

func hasActiveSubscription(in groupID: String) async -> Bool {
    for await result in Transaction.currentEntitlements {
        guard case .verified(let transaction) = result else { continue }
        if transaction.subscriptionGroupID == groupID,
           transaction.revocationDate == nil {
            return true
        }
    }
    return false
}
```

This is my own sketch, not Apple's sample, and it only uses APIs that existed before iOS 27. What I could not find is Apple documentation that names the new seat-related fields in StoreKit or the App Store Server API. The session says there are new App Store Server API endpoints for group management (finding the groups a customer belongs to and the members of a group), and for custom invitation systems. If your access logic lives on a server keyed to the original purchaser, read those docs before winter, when Group Purchases arrives.

## My short checklist

1. Accept the updated license agreement and read Schedules 2 and 3.
2. Open **Purchase Options** for each subscription and confirm what is on.
3. Decide whether Apple Business or Apple School Manager makes sense for your app before October 22.
4. If you keep multiseat, consider volume pricing instead of the flat default.
5. Make sure access comes from verified transactions, not from who made the purchase.

## Sources

- [Updated Apple Developer Program License Agreement now available (Apple Developer News, Oct 13, 2026)](https://developer.apple.com/news/?id=17mwd36z) — new Schedule 2 and 3 terms for Group Purchases and Volume Purchasing; accepting the terms
- [Get your subscriptions ready for iOS 27 (Apple Developer News, Sept 16, 2026)](https://developer.apple.com/news/?id=likeohx4) — multiseat on by default, Volume Purchasing on Oct 22, Group Purchases this winter, Apple handles invites and seat assignment
- [Manage purchase options for an auto-renewable subscription (App Store Connect Help)](https://developer.apple.com/help/app-store-connect/manage-subscriptions/manage-purchase-options-for-auto-renewable-subscriptions/) — defaults, opt-out exceptions, steps, consequences of turning options off, Family Sharing rules, roles
- [Manage pricing for auto-renewable subscriptions (App Store Connect Help)](https://developer.apple.com/help/app-store-connect/manage-subscriptions/manage-pricing-for-auto-renewable-subscriptions/) — price-increase consent rules for multiseat purchases
- [Offer subscriptions to groups and organizations (WWDC26 session 391)](https://developer.apple.com/videos/play/wwdc2026/391/) — volume pricing bands and example, Apple School Manager–only plans, seat count in the purchase, one transaction per member, group management endpoints
- [Transaction.currentEntitlements (StoreKit documentation)](https://developer.apple.com/documentation/storekit/transaction/currententitlements) — API used in the sketch

## LinkedIn

🤔 Your subscription can probably be bought by the seat already.

Apple turned multiseat purchases on by default for most StoreKit 2 subscriptions, and Volume Purchasing goes live on October 22.

Two things worth knowing:
- Check Purchase Options in App Store Connect. If you have no Family Sharing, you're most likely opted in.
- Opting out later cancels Apple Business and School Manager subscribers at their next renewal.

Keeping multiseat on, or opting out? 👇

https://blog.bahadirsonmez.com/posts/multiseat-subscriptions/?utm_source=linkedin&utm_medium=social&utm_campaign=multiseat-subscriptions

#iOSDevelopment #IndieDev #BuildInPublic

## X

Subscription'ın muhtemelen şu an toplu satılabiliyor 👀 Apple multiseat'i varsayılan açtı, 22 Ekim'de şirketler de alıyor. Kapatmanın bedeli var.
https://blog.bahadirsonmez.com/posts/multiseat-subscriptions/?utm_source=x&utm_medium=social&utm_campaign=multiseat-subscriptions
