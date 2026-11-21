---
title: "How a message queue decouples two services"
description: "A message queue holds work between two services. The sender drops a message in and moves on, and a consumer takes it when ready."
date: 2026-11-21
tags: [how-it-works, web]
status: draft
---

## Why this topic

Answers how one service can hand work to another without waiting for it. Claims rest on the Amazon SQS developer guide (the message lifecycle, and at-least-once delivery of standard queues) and on RabbitMQ's work queues tutorial (acks, requeueing, adding workers). Simplified on purpose: one queue and one group of consumers; publish/subscribe, ordering (FIFO), dead-letter queues and broker clustering are left out, and no timing numbers are given because the table compares behaviour only.

<!-- end why -->

A message queue is a waiting line for work between two services. The sender drops a message in and moves on, so neither side has to wait for the other.

## The short version

The producer puts a message on the queue and goes back to its own work. A consumer takes messages off the queue when it is ready, and the two need not run at the same time or on the same machine. Messages wait in the queue until someone is free, and adding more consumers shares the load between them. Think of a post box: the sender drops the letter and leaves, and the recipient collects it later.

<figure class="diagram">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" width="640" height="240" role="img" aria-labelledby="t-mq d-mq" font-family="Inter, system-ui, sans-serif" font-size="15">
<title id="t-mq">A message queue between a producer and a consumer</title>
<desc id="d-mq">A producer sends a message to a queue, and a consumer receives it from the queue. When the consumer finishes, it sends an ack and the message is deleted. A dashed arrow shows that without an ack the message returns to the queue.</desc>
<defs><marker id="mq-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2544a0"/></marker></defs>
<rect x="20" y="80" width="130" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="85" y="117" text-anchor="middle" fill="#160572" font-weight="600">Producer</text>
<rect x="250" y="80" width="140" height="64" rx="10" fill="#160572"/>
<text x="320" y="108" text-anchor="middle" fill="#ffffff" font-weight="600">Queue</text>
<text x="320" y="128" text-anchor="middle" fill="#ffffff" font-size="13">messages wait</text>
<rect x="490" y="80" width="130" height="64" rx="10" fill="#f2ebe6" stroke="#160572" stroke-width="2"/>
<text x="555" y="117" text-anchor="middle" fill="#160572" font-weight="600">Consumer</text>
<line x1="152" y1="112" x2="248" y2="112" stroke="#2544a0" stroke-width="2" marker-end="url(#mq-a)"/>
<line x1="392" y1="112" x2="488" y2="112" stroke="#2544a0" stroke-width="2" marker-end="url(#mq-a)"/>
<path d="M555 146V196H320V148" fill="none" stroke="#2544a0" stroke-width="2" marker-end="url(#mq-a)"/>
<path d="M555 78V40H320V76" fill="none" stroke="#d98199" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#mq-a)"/>
<text x="200" y="102" text-anchor="middle" fill="#2c2c2c" font-size="13">1 send</text>
<text x="440" y="102" text-anchor="middle" fill="#2c2c2c" font-size="13">2 receive</text>
<text x="437" y="218" text-anchor="middle" fill="#2c2c2c" font-size="13">3 ack: message deleted</text>
<text x="437" y="30" text-anchor="middle" fill="#2c2c2c" font-size="13">no ack: message returns</text>
</svg>
<figcaption>Simplified: one queue and one consumer; the dashed arrow is what happens when the consumer fails.</figcaption>
</figure>

## Step by step

1. The producer sends a message to the queue and carries on.
2. The queue holds the message until a consumer is ready.
3. A consumer receives it and does the work. In Amazon SQS the message stays on the queue meanwhile, hidden from other consumers.
4. When the work is done, the consumer confirms (RabbitMQ calls it an ack, SQS deletes the message) and the message is gone.
5. If the consumer dies before confirming, RabbitMQ puts the message back for another consumer to take.

| | Without a queue | With a queue |
|---|---|---|
| Consumer is slow or down | The producer waits or fails | Messages wait in the queue |
| A burst of work arrives | The consumer takes all of it at once | Consumers work through the backlog at their own pace |
| Consumer crashes mid-job | The producer has to notice and send it again | The message returns and another consumer takes it |

## Why it matters

A queue soaks up bursts of work, and a crashed consumer loses nothing. The price is that standard SQS queues deliver at least once, so the same message can arrive twice and the consumer has to cope with that. My take: the result also arrives later instead of immediately, and there is one more part to run.

## Sources

- [What is Amazon Simple Queue Service? (AWS)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html): queues that decouple distributed systems, the producer and consumer roles, and the message lifecycle from send to delete
- [Amazon SQS at-least-once delivery (AWS)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html): standard queues deliver at least once, a message can be received more than once, and applications should handle that
- [RabbitMQ tutorial: work queues](https://www.rabbitmq.com/tutorials/tutorial-two-python): the producer is not blocked, adding workers shares the load, a worker sends an ack when done, and an unacknowledged message is requeued for another consumer
