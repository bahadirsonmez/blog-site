---
title: "How a file system finds your file"
description: "A file's name lives in a directory, not in the file. The system follows the path one name at a time until it reaches the inode."
date: 2026-11-13
tags: [how-it-works, os]
status: ready
---

A file system turns a path like `/home/ana/notes.txt` into the disk blocks that hold the file. The idea to keep: a file's name is not stored in the file, it is stored in a directory.

## The short version

A directory is a list of entries, and each entry pairs a name with an inode number. The system starts at the root and looks up one name at a time, so each lookup leads into the next directory. The last name leads to an inode, and the inode says where the data blocks are.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 236" width="640" height="236" role="img" aria-labelledby="t-fs d-fs" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-fs">A path is followed from the root directory to the data blocks</title>
<desc id="d-fs">The path /home/ana/notes.txt is looked up in the root directory, then in the home directory, then in the ana directory. The entry for notes.txt gives an inode, and the inode points to the data blocks.</desc>
<defs><marker id="fs-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="40" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="95" y="77" text-anchor="middle" fill="#160572" font-weight="600">Root directory</text>
<rect x="245" y="40" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="77" text-anchor="middle" fill="#160572" font-weight="600">Directory: home</text>
<rect x="470" y="40" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="77" text-anchor="middle" fill="#160572" font-weight="600">Directory: ana</text>
<rect x="470" y="150" width="150" height="64" rx="10" fill="#160572"/>
<text x="545" y="187" text-anchor="middle" fill="#ffffff" font-weight="600">Inode</text>
<rect x="245" y="150" width="150" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="187" text-anchor="middle" fill="#160572" font-weight="600">Data blocks</text>
<line x1="172" y1="72" x2="243" y2="72" stroke="#2544a0" stroke-width="2" marker-end="url(#fs-a)"/>
<line x1="397" y1="72" x2="468" y2="72" stroke="#2544a0" stroke-width="2" marker-end="url(#fs-a)"/>
<line x1="545" y1="106" x2="545" y2="148" stroke="#2544a0" stroke-width="2" marker-end="url(#fs-a)"/>
<line x1="468" y1="182" x2="397" y2="182" stroke="#2544a0" stroke-width="2" marker-end="url(#fs-a)"/>
<text x="207" y="62" text-anchor="middle" fill="#2c2c2c" font-size="13">1 home</text>
<text x="432" y="62" text-anchor="middle" fill="#2c2c2c" font-size="13">2 ana</text>
<text x="533" y="132" text-anchor="end" fill="#2c2c2c" font-size="13">3 notes.txt</text>
<text x="432" y="172" text-anchor="middle" fill="#2c2c2c" font-size="13">4 blocks</text>
<text x="20" y="175" fill="#2c2c2c" font-size="13">Path:</text>
<text x="20" y="195" fill="#2c2c2c" font-size="13">/home/ana/notes.txt</text>
</svg>
<figcaption>Simplified (ext4 on Linux): each arrow is one lookup, and only the inode knows where the data is.</figcaption>
</figure>

## Step by step

1. A path that starts with `/` begins at the root directory; any other path begins at the current directory.
2. The system looks for `home` in the root directory. It must be a directory, and you need search permission on it (the execute bit).
3. It repeats this for `ana` inside `home`. A name that is missing gives the error ENOENT.
4. In the last directory, the entry for `notes.txt` gives an inode number.
5. The inode holds the file's size, owner and timestamps, and it points to the file's data blocks.
6. The system reads those blocks.

| What | Where it is stored |
|---|---|
| Name | Directory entry |
| Size, owner, timestamps | Inode |
| Content | Data blocks |

## Why it matters

Because the name sits in the directory and not in the inode, two names can point to the same inode; that is a hard link. The downside is that inode numbers are only unique inside one file system, so a hard link cannot span two. My take: a deep path costs one lookup per part.

## Sources

- [path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html): how a path is walked one component at a time, the search permission and ENOENT
- [inode(7)](https://man7.org/linux/man-pages/man7/inode.7.html): what an inode holds (size, owner, timestamps, hard link count) and that inode numbers are unique only within a file system
- [ext4 directory entries](https://docs.kernel.org/filesystems/ext4/directory.html): an entry is a name plus an inode number
