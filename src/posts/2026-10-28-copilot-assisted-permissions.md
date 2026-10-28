---
title: "Copilot assisted permissions: a model decides what is safe"
description: "GitHub made assisted permissions GA in Copilot CLI, the Copilot app and VS Code. The three modes compared, and what the docs say it does not replace."
date: 2026-10-28
tags: [ai]
status: ready
---

GitHub has made assisted permissions generally available in Copilot CLI, the Copilot app and Visual Studio Code. Instead of asking you about every command, a model reviews each request, lets the clearly safe ones through and asks you about the rest.

## In short

- Assisted is a third mode between "approve everything" and "allow everything". It is now GA in Copilot CLI, the Copilot app and VS Code.
- A model reviews commands, file paths and URLs. What it finds clearly safe goes through; anything it is unsure about comes to you.
- Deny rules and enterprise restrictions still apply in every mode.
- GitHub's docs say the model can make mistakes and that this is not a replacement for a sandbox.

## Three modes, one question: who decides?

The question behind every permission prompt is who gets to say yes. The docs describe three answers:

| | Manual | Assisted | Allow-all (`--yolo`) |
|---|---|---|---|
| Who decides | You, for each request | A model for clearly safe requests, you for the rest | Nobody: no review, no prompts |
| Deny rules | Apply | Apply | Apply |
| Enterprise limits | Apply | Apply | Apply |
| CLI | `/permissions manual` | `/permissions assisted` | `--allow-all` or `--yolo` |
| What the docs say | Shell commands can do anything your account can | Not a replacement for a sandbox | Only in an isolated environment |

The middle column is the one that changed. Everything in the other two was already there; assisted gives you a way to stop being asked about the boring requests without giving up the question entirely.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 216" width="640" height="216" role="img" aria-labelledby="t-perm d-perm" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-perm">Three Copilot permission modes: who decides</title>
<desc id="d-perm">Three boxes from left to right. Manual: you approve each request. Assisted: a model approves clearly safe requests and asks you about the rest. Allow-all, also called yolo: no review and no prompts. A strip underneath says deny rules and enterprise limits apply in every mode.</desc>
<defs><marker id="perm-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="20" width="170" height="110" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="54" text-anchor="middle" fill="#160572" font-weight="600">Manual</text>
<text x="105" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">You approve</text>
<text x="105" y="102" text-anchor="middle" fill="#2c2c2c" font-size="13">each request</text>
<rect x="235" y="20" width="170" height="110" rx="10" fill="#160572"/>
<text x="320" y="54" text-anchor="middle" fill="#ffffff" font-weight="600">Assisted</text>
<text x="320" y="82" text-anchor="middle" fill="#ffffff" font-size="13">Model approves safe,</text>
<text x="320" y="102" text-anchor="middle" fill="#ffffff" font-size="13">asks you the rest</text>
<rect x="450" y="20" width="170" height="110" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="54" text-anchor="middle" fill="#160572" font-weight="600">Allow-all</text>
<text x="535" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">aka --yolo</text>
<text x="535" y="102" text-anchor="middle" fill="#2c2c2c" font-size="13">no review, no prompts</text>
<line x1="192" y1="75" x2="233" y2="75" stroke="#2544a0" stroke-width="2" marker-end="url(#perm-a)"/>
<line x1="407" y1="75" x2="448" y2="75" stroke="#2544a0" stroke-width="2" marker-end="url(#perm-a)"/>
<rect x="20" y="156" width="600" height="40" rx="10" fill="#ffffff" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5"/>
<text x="320" y="181" text-anchor="middle" fill="#2c2c2c" font-size="13">Deny rules and enterprise limits apply in every mode</text>
</svg>
<figcaption>The three Copilot permission modes, from most asking to least. Based on GitHub's docs on safe commands and on allowing tools.</figcaption>
</figure>

Deny rules deserve a note: `--deny-tool` beats the allow options, including `--allow-all`. So the rules you write for the things you never want Copilot to do keep working, whichever mode you pick.

## What still reaches you in assisted mode

The docs list what comes back to you: requests the model is not sure about, requests to get around the local sandbox, and cases where the review is unavailable or cannot judge the request. Requests that are already allowed run without review.

Two things the docs leave open. "Safe" has no fixed list: the decision depends on the model's confidence in each request. And the page does not say what request data goes to the review model. It does say that the review model may differ from the model you chat with, and that if it is unavailable the session's active model is used.

In autopilot and other non-interactive runs there is nobody to ask. Requests that would need your approval are denied, and the reason goes back to Copilot so it can try something else.

## Turning it on

- **CLI:** `/permissions assisted`, check with `/permissions show`. To make it the default, set `"defaultPermissionMode": "assisted"` in `~/.copilot/settings.json`.
- **Copilot app:** mode picker, Tool permissions, Assisted.
- **VS Code:** permissions picker, Assisted permissions.
- **Non-interactive runs:** `--assisted-approval`, or `COPILOT_ASSISTED_APPROVAL=true`.

One detail for scripts and CI. `--assisted-approval` overrides `--allow-all-tools`, but it does not change `--allow-all-paths` or `--allow-all-urls`. And if assisted mode cannot be enabled, Copilot writes a warning to stderr, and `--allow-all-tools` can still approve a tool without any review. If you rely on this in a pipeline, read stderr.

Admins have two switches: `permissions.disableBypassPermissionsMode: "disable"` turns off only the unconditional mode, and `permissions.disableAssistedPermissionsMode: true` turns assisted off. With enterprise-managed settings they can disable Allow All and keep Assisted, and they can set the default permission mode for new sessions. If the default is not available, the session starts with manual approval.

## Where it came from

The feature did not appear out of nowhere. It had a quieter start in another editor, and one other approval-related change landed in between:

| Date | What | Where |
|---|---|---|
| 22 Sep 2026 | "Assisted approvals": low-risk tool calls approved automatically (public preview) | Copilot for JetBrains 1.18.0 |
| 1 Oct 2026 | Computer use: Copilot can drive desktop apps, asks before controlling one (public preview) | Copilot CLI and Copilot app |
| 26 Oct 2026 | Assisted permissions (GA) | Copilot CLI, Copilot app, VS Code |

The JetBrains preview was the same idea under a different name: low-risk tool calls went through, high-risk ones kept asking. The computer-use preview asks before Copilot controls an app, and lets you review and reset the apps you marked "always allow". My reading, not GitHub's wording: the more an agent can reach, the more prompts there are, and assisted permissions is the answer to prompts piling up.

## The good and the not-so-good

**What works better**

- Fewer interruptions for low-risk requests, which is the point of the feature.
- Deny rules and enterprise restrictions still apply in every mode, and deny beats allow.
- Admins can switch off Allow All and keep Assisted.
- One idea across the CLI, the app and VS Code.

**What is missing, unclear or costs something**

- The model can make a mistake and approve a dangerous action. GitHub says so itself, and says this does not replace a sandbox or access restrictions.
- No fixed definition of "safe", and no description of what request data the review model receives.
- In autopilot and non-interactive runs, requests that need approval are denied.
- If assisted mode cannot start, `--allow-all-tools` may still approve tools without review. The only signal is a warning on stderr.

My take, not fact: the open question is how you check a model's approvals afterwards. The pages I read document neither what "safe" means nor what the review model sees, so I would treat assisted as a convenience layer, not a security boundary.

## What to do

1. Write deny rules for the commands you never want run. They win in every mode.
2. For risky work, keep using an isolated environment. The docs recommend it for allow-all and say assisted does not replace it.
3. In CI, use `--assisted-approval` deliberately and watch stderr for the fallback warning.
4. If you manage a team, decide whether to disable Allow All with `permissions.disableBypassPermissionsMode`, and whether you want Assisted on at all.

## Sources

- [GitHub Copilot assisted permissions are generally available — GitHub changelog](https://github.blog/changelog/2026-10-26-github-copilot-assisted-permissions-generally-available) — the October 26, 2026 GA in Copilot CLI, the Copilot app and VS Code, how a model reviews requests, how to enable it in each app, enterprise controls
- [Allowing safe commands to run without manual approval — GitHub Docs](https://docs.github.com/copilot/concepts/customizations/allowing-safe-commands) — the three modes, what still reaches you, the limits (not a sandbox replacement, no fixed "safe" list), CLI settings and flags, admin settings
- [Allowing and denying tool use — GitHub Docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) — `--allow-tool`, `--deny-tool`, `--allow-all`/`--yolo`, that deny beats allow, and the advice to use allow-all only in an isolated environment
- [New features and improvements in Copilot for JetBrains — GitHub changelog](https://github.blog/changelog/2026-09-22-new-features-and-improvements-in-copilot-for-jetbrains) — the September 22, 2026 public preview of assisted approvals in version 1.18.0
- [GitHub Copilot can now interact with desktop apps — GitHub changelog](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/) — the October 1, 2026 computer-use preview, the approval before controlling an app, and reviewing "always allow" apps
