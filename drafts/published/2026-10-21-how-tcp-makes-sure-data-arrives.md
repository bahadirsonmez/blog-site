---
title: "How TCP makes sure data arrives"
description: "TCP numbers every byte, waits for the receiver to confirm, and resends the oldest unconfirmed segment when a timer runs out."
date: 2026-10-21
tags: [how-it-works, networking]
status: draft
---

## Why this topic

Answers "how does TCP know my data arrived". Claims rest on RFC 9293 (TCP, August 2022, which replaces RFC 793) for sequence numbers, acknowledgments and out-of-order segments, and on RFC 6298 for the retransmission timer: it restarts on new acknowledgments, stops when everything is acknowledged, resends the oldest segment on expiry and doubles the timeout. Simplified on purpose: one sender, one receiver, no flow or congestion control, and no numeric timer values. The sentence that the timer running out is enough to try again is my reading of the two documents, and the post says so.

<!-- end why -->

TCP numbers the bytes it sends and waits for the receiver to confirm them. The idea to keep: no confirmation in time, so send again.

## The short version

Every byte in a TCP connection has a sequence number. The receiver answers with an acknowledgment number, the next byte it expects. The sender keeps data that is not confirmed yet and runs a retransmission timer. If the timer runs out first, it sends the oldest unconfirmed segment again.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 260" width="640" height="260" role="img" aria-labelledby="t-tcp d-tcp" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-tcp">How TCP resends data that is not acknowledged</title>
<desc id="d-tcp">A sender sends a segment and checks whether an acknowledgment arrived. If yes, it sends the next data. If no, the retransmission timer runs out, the oldest unacknowledged segment is resent with a doubled timeout, and the loop starts again.</desc>
<defs><marker id="tcp-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker><marker id="tcp-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d98199"/></marker></defs>
<rect x="20" y="20" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="52" text-anchor="middle" fill="#160572" font-weight="600">Send segment</text>
<text x="105" y="73" text-anchor="middle" fill="#2c2c2c" font-size="13">keeps it until ACKed</text>
<rect x="235" y="20" width="170" height="68" rx="10" fill="#160572"/>
<text x="320" y="52" text-anchor="middle" fill="#ffffff" font-weight="600">ACK arrived?</text>
<text x="320" y="73" text-anchor="middle" fill="#ffffff" font-size="13">next byte expected</text>
<rect x="450" y="20" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="535" y="52" text-anchor="middle" fill="#160572" font-weight="600">Send next data</text>
<text x="535" y="73" text-anchor="middle" fill="#2c2c2c" font-size="13">timer restarts or stops</text>
<rect x="235" y="156" width="170" height="68" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="320" y="188" text-anchor="middle" fill="#160572" font-weight="600">Timer runs out</text>
<text x="320" y="209" text-anchor="middle" fill="#2c2c2c" font-size="13">no ACK in time</text>
<rect x="20" y="148" width="170" height="84" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="105" y="177" text-anchor="middle" fill="#160572" font-weight="600">Resend</text>
<text x="105" y="198" text-anchor="middle" fill="#2c2c2c" font-size="13">oldest unACKed segment</text>
<text x="105" y="216" text-anchor="middle" fill="#2c2c2c" font-size="13">RTO doubled, restart</text>
<line x1="192" y1="54" x2="233" y2="54" stroke="#2544a0" stroke-width="2" marker-end="url(#tcp-a)"/>
<line x1="407" y1="54" x2="448" y2="54" stroke="#2544a0" stroke-width="2" marker-end="url(#tcp-a)"/>
<line x1="320" y1="90" x2="320" y2="154" stroke="#2544a0" stroke-width="2" marker-end="url(#tcp-a)"/>
<line x1="233" y1="190" x2="192" y2="190" stroke="#2544a0" stroke-width="2" marker-end="url(#tcp-a)"/>
<line x1="105" y1="146" x2="105" y2="90" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#tcp-r)"/>
<text x="212" y="44" text-anchor="middle" fill="#2c2c2c" font-size="13">1</text>
<text x="427" y="44" text-anchor="middle" fill="#2c2c2c" font-size="13">2 yes</text>
<text x="332" y="126" text-anchor="start" fill="#2c2c2c" font-size="13">3 no</text>
<text x="212" y="180" text-anchor="middle" fill="#2c2c2c" font-size="13">4</text>
<text x="118" y="124" text-anchor="start" fill="#2c2c2c" font-size="13">5 wait again</text>
</svg>
<figcaption>RTO is the retransmission timeout: the time the sender waits for an acknowledgment before sending again.</figcaption>
</figure>

## Step by step

1. The sender numbers its bytes, not its segments. The SYN and FIN flags use up one number each.
2. The receiver acknowledges the next byte it expects. Acknowledgments are cumulative.
3. A segment that arrives ahead of the expected number is held and processed later.
4. The sender keeps unconfirmed data and a timer. An acknowledgment of new data restarts the timer; when everything is acknowledged, it stops.
5. If the timer expires, the sender resends the oldest unconfirmed segment and restarts the timer with the timeout doubled.

## Why it matters

TCP does not need to know why a segment went unconfirmed: a timer running out is enough to try again. That is my reading of the specs, not a quoted line. Simplified: flow control, congestion control and timer values are left out.

## Sources

- [RFC 9293: Transmission Control Protocol (TCP)](https://www.rfc-editor.org/rfc/rfc9293.html) — sequence numbers count bytes (SYN and FIN use one each), the acknowledgment number is the next byte expected, retransmission, segments ahead of sequence held for later
- [RFC 6298: Computing TCP's Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298.html) — timer restart and stop rules, resending the oldest unacknowledged segment, doubling the timeout
