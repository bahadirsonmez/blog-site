---
title: "How a database index works"
description: "An index is a sorted structure next to a table. The database searches it instead of reading every row, but it must keep it in sync on every write."
date: 2026-11-03
tags: [how-it-works, data]
status: ready
---

A database index is a sorted structure that sits next to a table. The idea to keep: it lets the database skip most rows when it looks for one.

## The short version

Without an index, a query like `WHERE id = 42` makes the database read the table row by row, which is called a full scan. With an index on `id`, the database searches a separate structure that is sorted by `id`, and it gets back the id of the matching row. Then it goes straight to that row. Because the search is a binary search, it stays fast when the table grows.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-labelledby="t-idx d-idx" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-idx">How an index finds a row</title>
<desc id="d-idx">Top row, left to right: a query, the index sorted by id, the row id, and the table row. A dashed path from the query goes down to a box for a full scan when there is no index, and from there up to the table row.</desc>
<defs><marker id="idx-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="idx-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="10" y="30" width="125" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="72" y="60" text-anchor="middle" fill="#160572" font-weight="600">Query</text>
<text x="72" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">id = 42</text>
<rect x="175" y="30" width="125" height="68" rx="10" fill="#160572"/>
<text x="237" y="60" text-anchor="middle" fill="#ffffff" font-weight="600">Index</text>
<text x="237" y="82" text-anchor="middle" fill="#ffffff" font-size="13">sorted by id</text>
<rect x="340" y="30" width="125" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="402" y="60" text-anchor="middle" fill="#160572" font-weight="600">Row id</text>
<text x="402" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">from the index</text>
<rect x="505" y="30" width="125" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="567" y="60" text-anchor="middle" fill="#160572" font-weight="600">Table row</text>
<text x="567" y="82" text-anchor="middle" fill="#2c2c2c" font-size="13">the data</text>
<line x1="137" y1="64" x2="173" y2="64" stroke="#2544a0" stroke-width="2" marker-end="url(#idx-a)"/>
<line x1="302" y1="64" x2="338" y2="64" stroke="#2544a0" stroke-width="2" marker-end="url(#idx-a)"/>
<line x1="467" y1="64" x2="503" y2="64" stroke="#2544a0" stroke-width="2" marker-end="url(#idx-a)"/>
<text x="155" y="54" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="320" y="54" text-anchor="middle" fill="#2c2c2c" font-size="13">2</text>
<text x="485" y="54" text-anchor="middle" fill="#2c2c2c" font-size="13">3</text>
<rect x="215" y="170" width="210" height="56" rx="10" fill="#f2ebe6" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5"/>
<text x="320" y="204" text-anchor="middle" fill="#160572" font-weight="600">No index: full scan</text>
<path d="M72 100V198H213" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#idx-r)"/>
<path d="M427 198H567V100" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#idx-r)"/>
</svg>
<figcaption>Simplified: solid arrows are the indexed path, dashed arrows the path without an index.</figcaption>
</figure>

## Step by step

1. A query arrives with a condition such as `WHERE id = 42`.
2. With no index on `id`, the database reads every row.
3. With one, it does a binary search in the index.
4. The matching index entry holds the row id.
5. The database then finds that row id in the table, which is also a binary search in SQLite.

| | No index | With an index |
|---|---|---|
| Method | reads every row | searches a sorted structure |
| Time grows with | N | log N |
| Writes | no index to update | index kept in sync |

## Why it matters

Reads get faster, but every write must also update the index, so PostgreSQL's docs advise dropping indexes you do not use. The planner decides whether an index is worth using, and a B-tree index cannot help a pattern like `LIKE '%bar'`.

## Sources

- [SQLite: Query Planning](https://www.sqlite.org/queryplanner.html) — full scan without an index, the sorted index, the two binary searches, time growing with N or log N
- [PostgreSQL: Indexes, Introduction](https://www.postgresql.org/docs/current/indexes-intro.html) — full scan versus index, the index kept in sync, the write overhead, dropping unused indexes, the planner's choice
- [PostgreSQL: Index Types](https://www.postgresql.org/docs/current/indexes-types.html) — B-tree for equality and range queries, `LIKE 'foo%'` works but `LIKE '%bar'` does not
