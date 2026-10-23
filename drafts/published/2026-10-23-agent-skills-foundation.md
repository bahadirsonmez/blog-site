---
title: "Agent Skills moves to a foundation. A skill is just a folder"
description: "Anthropic says it is donating Agent Skills to the Agentic AI Foundation. What a skill is, how an agent loads one, and what the announcement does not change."
date: 2026-10-23
tags: [ai]
status: draft
---

## Why this topic

Why now: Anthropic announced on October 22, 2026 that it is donating Agent Skills to the Agentic AI Foundation (AAIF), one day before this draft. The format is small and anyone who writes skills for an AI coding agent can read the whole spec in a few minutes. Search question it answers: "what is an agent skill, what is SKILL.md, why did Anthropic donate it". Primary sources: Anthropic's donation announcement, agentskills.io (home page and specification), and Anthropic's December 2025 post that founded AAIF. Caveat: the donation itself rests on one source, Anthropic's own page. I did not find a Linux Foundation or AAIF statement, and the AAIF site did not list Agent Skills when checked. The post says "Anthropic says" throughout and does not treat the donation as an accepted decision. Left out on purpose because they are only Anthropic's own claims or unconfirmed: adoption numbers (platforms, skills published, installs), the list of donated assets, maintainer names, the roadmap, and the exact day the format was first published (secondary sources disagree; only "December 2025" is safe). Publish slot: earliest Saturday 15:00 Turkey time, 14:00 Berlin.

<!-- end why -->

Anthropic announced on October 22, 2026 that it is donating Agent Skills to the Agentic AI Foundation. The idea to keep: a skill is a folder with one required file, so the format is small enough to read in one sitting, whoever ends up governing it.

## What was announced

The announcement is on Anthropic's own site, in its news section. As far as I can tell from the sources, that page is the only place the donation is described, so everything below about the donation is "Anthropic says", not a confirmed decision by the foundation.

The foundation itself is not new. Anthropic's earlier post says the Agentic AI Foundation was set up on December 9, 2025 under the Linux Foundation, with Anthropic, Block and OpenAI as founding members. At the same time Anthropic donated MCP, the Model Context Protocol, which it describes as an open standard for connecting AI applications to external systems.

Agent Skills has a different job. The project site describes it as an open standard for giving agents specialized knowledge and workflows, originally developed by Anthropic and open to contributions. My reading, not Anthropic's wording: MCP is how an agent reaches a system, and a skill is what the agent knows about doing a particular job. Two standards, two jobs, one foundation.

## A skill is a folder

The specification defines a skill as a folder containing a `SKILL.md` file. Everything else is optional:

```text
release-notes-writer/
├── SKILL.md        required
├── scripts/        optional: code the agent can run
├── references/     optional: documentation
└── assets/         optional: templates, images, data
```

`SKILL.md` has two required fields at the top, `name` and `description`. The name is 1 to 64 characters, uses only lowercase letters, digits and hyphens, and has to match the folder name. The description is 1 to 1024 characters. Here is a small example I made up to show the shape:

```markdown
---
name: release-notes-writer
description: Drafts App Store release notes from a git log. Use when asked for "what's new" text for an app update.
---

Instructions for the agent go here, in plain Markdown.
```

That is a complete, valid-looking skill. The part below the two fields is whatever you want the agent to know once the skill is in use; the spec leaves the content to you.

## How an agent loads a skill

The spec describes three stages. In discovery, the agent loads only the name and the description. In activation, it reads the whole `SKILL.md`. In execution, it opens scripts, references and assets only when the task needs them.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 192" width="640" height="192" role="img" aria-labelledby="t-skills d-skills" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-skills">The three stages of loading a skill</title>
<desc id="d-skills">Three boxes from left to right. Discovery loads only the name and description. Activation loads the whole SKILL.md. Execution loads scripts, references and assets when they are needed.</desc>
<defs><marker id="skills-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="10" y="60" width="180" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="100" y="92" text-anchor="middle" fill="#160572" font-weight="600">1 Discovery</text>
<text x="100" y="114" text-anchor="middle" fill="#2c2c2c" font-size="13">name + description</text>
<rect x="230" y="60" width="180" height="72" rx="10" fill="#160572"/>
<text x="320" y="92" text-anchor="middle" fill="#ffffff" font-weight="600">2 Activation</text>
<text x="320" y="114" text-anchor="middle" fill="#ffffff" font-size="13">the whole SKILL.md</text>
<rect x="450" y="60" width="180" height="72" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="540" y="92" text-anchor="middle" fill="#160572" font-weight="600">3 Execution</text>
<text x="540" y="114" text-anchor="middle" fill="#2c2c2c" font-size="13">files, when needed</text>
<line x1="192" y1="96" x2="228" y2="96" stroke="#2544a0" stroke-width="2" marker-end="url(#skills-a)"/>
<line x1="412" y1="96" x2="448" y2="96" stroke="#2544a0" stroke-width="2" marker-end="url(#skills-a)"/>
</svg>
<figcaption>Stage 1 reads only the name and description. Stage 3 opens scripts/, references/ and assets/ only when the task calls for them.</figcaption>
</figure>

This explains why the description matters more than it looks. In the first stage it is the only thing the agent has to decide whether a skill fits the task. That is my inference from the three stages, and the advice that follows is mine too: write the description like a label that says what the skill does and when to use it, not like a title.

## What changes, and what does not

Nothing in the file format changes with this announcement, as far as the sources show. What changes is who holds the project: Anthropic says it is moving to a neutral foundation, the same one that now holds MCP.

Whether that matters in practice depends on things I cannot check from these sources, such as how many tools will keep supporting the format and how the foundation will run it. Anthropic's page also gives adoption figures. They are Anthropic's own counts with no independent tally, so I left them out. If you build skills today, the safe reading is narrow: the spec you can read on agentskills.io is the thing you are writing to.

## A ten-minute experiment

Pick one task you explain to an AI agent again and again, such as writing release notes, and make it a skill. Create the folder, write the two fields, and check the two rules the spec is strict about:

```sh
dir=release-notes-writer
grep -m1 '^name:' "$dir/SKILL.md"
echo -n "$dir" | wc -c
```

The first line should print the same name as the folder. The second prints the folder name length, which has to be 64 or less. Then point an agent tool that supports skills at the folder and ask for the task in your own words, without naming the skill. If the agent picks it up, your description works. If it does not, rewrite the description first, before touching the instructions below it.

## Where this leaves things

A skill is a folder with a `SKILL.md`, two required fields and three optional directories. Anthropic says the standard is moving to a foundation, and that is the news. The format you can read today is the same one. If you already keep notes for your agent in a long prompt, splitting one repeated task into a skill is a cheap way to see what the format feels like.

## Sources

- [Donating Agent Skills to the Agentic AI Foundation — Anthropic](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation) — the October 22, 2026 announcement that Anthropic is donating Agent Skills to AAIF (single source for the donation)
- [Agent Skills — agentskills.io](https://agentskills.io/home) — a skill is a folder containing a SKILL.md file; open standard for specialized knowledge and workflows, originally developed by Anthropic; the three loading stages
- [Agent Skills specification — agentskills.io](https://agentskills.io/specification.md) — required `name` (1 to 64 characters, lowercase letters, digits, hyphens, matches the folder name) and `description` (1 to 1024 characters), optional scripts/, references/ and assets/
- [Donating the Model Context Protocol and establishing the Agentic AI Foundation — Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) — AAIF founded on December 9, 2025 under the Linux Foundation by Anthropic, Block and OpenAI; MCP donated at the same time; MCP described as an open standard for connecting AI applications to external systems

## LinkedIn

🧩 A skill for an AI agent is just a folder with one file in it.

Anthropic says it is donating Agent Skills to the Agentic #AI Foundation, where #MCP already lives. My short read of the spec:
- A skill = a folder with a SKILL.md (name and description)
- The agent loads only the name and description first, the rest when needed
- My take, not fact: write the description like a label 🏷️

I use skills in Claude Code. I think they bring out what Claude can really do: focusing it on one job makes it work more efficiently.

Written up on the blog, with a diagram:
https://blog.bahadirsonmez.com/posts/agent-skills-foundation/?utm_source=linkedin&utm_medium=social&utm_campaign=agent-skills-foundation

## X

skill dediğimiz şey aslında içinde tek bir SKILL.md olan bir klasör. Anthropic bunu da MCP gibi bir vakfa bağışlıyor 🧩 #AI
https://blog.bahadirsonmez.com/posts/agent-skills-foundation/?utm_source=x&utm_medium=social&utm_campaign=agent-skills-foundation
