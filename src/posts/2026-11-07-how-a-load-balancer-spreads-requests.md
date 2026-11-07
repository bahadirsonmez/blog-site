---
title: "How a load balancer spreads requests"
description: "A load balancer takes requests sent to one address and hands each one to one of several servers, skipping a server that is failing."
date: 2026-11-07
tags: [how-it-works, networking]
status: ready
---

A load balancer receives requests at one address and passes each one to one of several servers that do the same job. The idea to keep: no single server has to carry everything, and a server that fails is skipped.

## The short version

Clients talk to the load balancer as if it were the server. Behind it sit a few servers. For every request the load balancer picks one by a rule, and when a server keeps failing it stops sending requests there for a while. A CDN keeps copies of files near the visitor, while a load balancer shares the work behind one address; the first idea is in [How a CDN serves files from a server near you](https://blog.bahadirsonmez.com/posts/how-a-cdn-serves-files/).

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" width="640" height="260" role="img" aria-labelledby="t-lb d-lb" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-lb">How a load balancer spreads requests</title>
<desc id="d-lb">A client sends a request to a load balancer. The load balancer picks one of three servers for each request. Server A and Server B receive requests. Server C has failed, so a dashed arrow shows that it is skipped.</desc>
<defs><marker id="lb-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="104" width="100" height="52" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="70" y="135" text-anchor="middle" fill="#160572" font-weight="600">Client</text>
<rect x="200" y="104" width="150" height="52" rx="10" fill="#160572"/>
<text x="275" y="135" text-anchor="middle" fill="#ffffff" font-weight="600">Load balancer</text>
<rect x="470" y="20" width="150" height="52" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="51" text-anchor="middle" fill="#160572" font-weight="600">Server A</text>
<rect x="470" y="104" width="150" height="52" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="545" y="135" text-anchor="middle" fill="#160572" font-weight="600">Server B</text>
<rect x="470" y="188" width="150" height="52" rx="10" fill="#f2ebe6" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5"/>
<text x="545" y="211" text-anchor="middle" fill="#160572" font-weight="600">Server C</text>
<text x="545" y="229" text-anchor="middle" fill="#2c2c2c" font-size="13">failed, skipped</text>
<line x1="122" y1="130" x2="198" y2="130" stroke="#2544a0" stroke-width="2" marker-end="url(#lb-a)"/>
<text x="160" y="120" text-anchor="middle" fill="#2c2c2c" font-size="13">1 request</text>
<line x1="352" y1="118" x2="468" y2="46" stroke="#2544a0" stroke-width="2" marker-end="url(#lb-a)"/>
<line x1="352" y1="130" x2="468" y2="130" stroke="#2544a0" stroke-width="2" marker-end="url(#lb-a)"/>
<line x1="352" y1="142" x2="468" y2="214" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#lb-a)"/>
<text x="410" y="122" text-anchor="middle" fill="#2c2c2c" font-size="13">2 pick one</text>
</svg>
<figcaption>Simplified: the load balancer picks a healthy server for each request and skips the one that failed.</figcaption>
</figure>

## Step by step

1. A client sends a request to the load balancer's address.
2. The load balancer picks a server with its method, shown in the table.
3. The server answers, and the reply goes back to the client.
4. A server that keeps failing is left out; in nginx's defaults, one failed attempt sidelines it for 10 seconds.
5. Once it responds again, it takes part again.

| Method | How it picks the server |
|---|---|
| Round robin | The next one in turn, weighted if you set weights; the nginx default |
| Least connections | The one with the fewest active connections; useful when some requests run long |
| IP hash | Derived from the client's IP address, so the same client usually reaches the same server |

## Why it matters

Spreading requests lets several servers share the work, and one failing server need not stop the service. With IP hash the same client keeps landing on one server, and if that server is unavailable the client moves to another.

## Sources

- [Module ngx_http_upstream_module — nginx](https://nginx.org/en/docs/http/ngx_http_upstream_module.html) — round robin as the default, `least_conn`, `ip_hash`, and the `max_fails` and `fail_timeout` defaults
- [Using nginx as HTTP load balancer — nginx](https://nginx.org/en/docs/http/load_balancing.html) — the methods, least connections for long requests, IP hash for session persistence, and how a failed server is probed again
- [How Elastic Load Balancing works — AWS](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html) — the load balancer monitors target health and routes only to healthy targets
