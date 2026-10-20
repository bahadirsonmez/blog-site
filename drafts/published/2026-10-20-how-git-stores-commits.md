---
title: "How Git stores your commits"
description: "Git saves a commit as small objects named by the SHA-1 hash of their contents: blobs for files, trees for folders, and a commit that points at both."
date: 2026-10-20
tags: [how-it-works, git]
status: draft
---

## Why this topic

Answers "what is actually inside a Git commit". Claims rest on the Git Book chapter "Git Internals - Git Objects" (content-addressable filesystem, blob, tree and commit objects, the object file path, the header, hash and zlib steps) and the gitglossary entries for object, blob, tree and commit. Simplified on purpose: SHA-1 naming only, one file per object as in the Git Book walkthrough, and no other storage details. The sentence that an unchanged file is stored once is my inference from the definition (the name comes from the content), and the post says so.

<!-- end why -->

Git is a content-addressable filesystem: it stores everything as objects named after their contents. The idea to keep: a commit does not copy your project, it points at a snapshot by hash.

## The short version

Git uses three kinds of object. A blob holds the contents of a file. A tree holds a list of file names and modes, each with a reference to a blob or to another tree. A commit points at the top-level tree of the project at that moment, plus its parent commit, the author and the message. Every object is named by the SHA-1 of its contents, so it cannot be changed: a changed file becomes a new object.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" width="640" height="230" role="img" aria-labelledby="t-git d-git" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-git">How a Git commit points at a tree, a blob and its parent</title>
<desc id="d-git">Commit C2 points at a tree, and the tree points at a blob that holds file contents. A dashed arrow from commit C2 points at commit C1, its parent.</desc>
<defs><marker id="git-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="git-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="30" width="170" height="64" rx="10" fill="#160572"/>
<text x="105" y="58" text-anchor="middle" fill="#ffffff" font-weight="600">commit C2</text>
<text x="105" y="78" text-anchor="middle" fill="#ffffff" font-size="13">tree, parent, message</text>
<rect x="235" y="30" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="58" text-anchor="middle" fill="#160572" font-weight="600">tree</text>
<text x="320" y="78" text-anchor="middle" fill="#2c2c2c" font-size="13">names and hashes</text>
<rect x="450" y="30" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="58" text-anchor="middle" fill="#160572" font-weight="600">blob</text>
<text x="535" y="78" text-anchor="middle" fill="#2c2c2c" font-size="13">file contents</text>
<rect x="20" y="144" width="170" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="172" text-anchor="middle" fill="#160572" font-weight="600">commit C1</text>
<text x="105" y="192" text-anchor="middle" fill="#2c2c2c" font-size="13">the parent</text>
<line x1="192" y1="62" x2="233" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#git-a)"/>
<line x1="407" y1="62" x2="448" y2="62" stroke="#2544a0" stroke-width="2" marker-end="url(#git-a)"/>
<line x1="105" y1="96" x2="105" y2="142" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#git-r)"/>
<text x="212" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="427" y="52" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="134" y="124" text-anchor="start" fill="#2c2c2c" font-size="13">3 parent</text>
<text x="420" y="176" text-anchor="middle" fill="#2c2c2c" font-size="13">Each box is named by the SHA-1</text>
<text x="420" y="196" text-anchor="middle" fill="#2c2c2c" font-size="13">of its own contents.</text>
</svg>
<figcaption>Arrows 1 and 2 follow the snapshot down to the file contents; the dashed arrow 3 links the commit to the one before it.</figcaption>
</figure>

## Step by step

1. Git adds a short header (type and size) to the file contents and computes the SHA-1 of the whole. That hash is the object's name.
2. It compresses the object with zlib and writes it under `.git/objects`: the first two characters of the hash are the folder, the other 38 are the file name.
3. A tree object lists names, modes and hashes of the blobs and subtrees in a folder.
4. A commit stores the hash of the top-level tree, the hash of its parent commit, the author and the message. The first commit has no parent.
5. Change one line and the blob gets a new hash, so the tree that lists it does too, and so does the next commit. Old objects stay.

## Why it matters

Identical content gets an identical name, so Git has no reason to keep a second copy of a file you did not touch. That is my inference from the definition, not a sentence in the docs. It also explains why history is stable: older commits are never edited, only followed by new ones.

## Sources

- [Git Internals - Git Objects — Pro Git book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) — content-addressable filesystem, blob, tree and commit objects, parent commits, object path from the SHA-1, header, hash and zlib steps
- [gitglossary — Git documentation](https://git-scm.com/docs/gitglossary) — definitions of object (named by the SHA-1 of its contents, cannot be changed), blob, tree and commit
