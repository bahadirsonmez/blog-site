---
title: "How CI tests every push"
description: "A push starts a workflow, a fresh machine builds and tests the code, and the result comes back as a check on the commit or pull request."
date: 2026-11-25
tags: [how-it-works, git]
status: ready
---

Continuous integration, or CI, builds and tests your code on a server every time you push. The result comes from a fresh machine, so it does not depend on yours.

## The short version

A push is an event. The event starts a workflow, a YAML file kept in the repository. The workflow's jobs run on runners, and the outcome is reported on the commit or pull request as a check.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 254" width="640" height="254" role="img" aria-labelledby="t-ci d-ci" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-ci">From a push to a check on a pull request</title>
<desc id="d-ci">A push starts a workflow. The workflow's job runs on a runner, a fresh virtual machine. The runner builds and tests the code. The result becomes a check, and the check shows on the pull request. A dashed path goes from the pull request back up to the push for a fix.</desc>
<defs><marker id="ci-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="ci-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="30" width="160" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="100" y="57" text-anchor="middle" fill="#160572" font-weight="600">Push</text>
<text x="100" y="78" text-anchor="middle" fill="#2c2c2c" font-size="13">an event</text>
<rect x="240" y="30" width="160" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="57" text-anchor="middle" fill="#160572" font-weight="600">Workflow</text>
<text x="320" y="78" text-anchor="middle" fill="#2c2c2c" font-size="13">a YAML file</text>
<rect x="460" y="30" width="160" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="540" y="57" text-anchor="middle" fill="#160572" font-weight="600">Runner</text>
<text x="540" y="78" text-anchor="middle" fill="#2c2c2c" font-size="13">fresh virtual machine</text>
<rect x="460" y="170" width="160" height="64" rx="10" fill="#160572"/>
<text x="540" y="197" text-anchor="middle" fill="#ffffff" font-weight="600">Build and test</text>
<text x="540" y="218" text-anchor="middle" fill="#ffffff" font-size="13">steps run in order</text>
<rect x="240" y="170" width="160" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="197" text-anchor="middle" fill="#160572" font-weight="600">Check</text>
<text x="320" y="218" text-anchor="middle" fill="#2c2c2c" font-size="13">success or failure</text>
<rect x="20" y="170" width="160" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="100" y="197" text-anchor="middle" fill="#160572" font-weight="600">Pull request</text>
<text x="100" y="218" text-anchor="middle" fill="#2c2c2c" font-size="13">can block the merge</text>
<line x1="182" y1="62" x2="238" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#ci-a)"/>
<line x1="402" y1="62" x2="458" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#ci-a)"/>
<line x1="540" y1="96" x2="540" y2="168" stroke="#2544a0" stroke-width="2" marker-end="url(#ci-a)"/>
<line x1="458" y1="202" x2="402" y2="202" stroke="#2544a0" stroke-width="2" marker-end="url(#ci-a)"/>
<line x1="238" y1="202" x2="182" y2="202" stroke="#2544a0" stroke-width="2" marker-end="url(#ci-a)"/>
<line x1="100" y1="168" x2="100" y2="98" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ci-r)"/>
<text x="210" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="430" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="552" y="136" fill="#2c2c2c" font-size="13">3</text>
<text x="430" y="192" text-anchor="middle" fill="#2c2c2c" font-size="13">4</text>
<text x="210" y="192" text-anchor="middle" fill="#2c2c2c" font-size="13">5</text>
<text x="112" y="137" fill="#2c2c2c" font-size="13">fix and push again</text>
</svg>
<figcaption>Numbers show the order; the dashed path is the fix after a red check.</figcaption>
</figure>

## Step by step

1. You push a commit. The push is an event that can start a workflow.
2. The workflow lists the jobs to run.
3. Each job gets a runner, a fresh virtual machine, and its steps run there in order.
4. A step is a shell command or a reusable action, such as the command that runs your tests.
5. Jobs run in parallel unless one declares that it needs another.
6. The result shows on the commit or pull request as a check: queued, in progress, then success or failure.

## Why it matters

A protected branch can require a check to pass before a pull request merges, so a broken change is caught before it lands. The catch is speed: Fowler asks for a self-testing build that is fixed the moment it breaks, and he calls a build of about ten minutes reasonable for most projects, because a slow one delays the feedback.

## Sources

- [GitHub Docs, Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions): events, workflows as YAML files, jobs, runners as fresh virtual machines, steps in order, and parallel jobs unless one needs another
- [GitHub Docs, About status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks): queued, in progress, success and failure, and required checks blocking a merge into a protected branch
- [Martin Fowler, Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html): the self-testing build, fixing broken builds immediately, and the ten minute build guideline
