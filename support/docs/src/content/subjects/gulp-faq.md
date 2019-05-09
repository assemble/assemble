---
title: Gulp FAQ
category: subjects
---

Common questions we're asked about [gulp][] and gulp plugins.

**Does assemble wrap gulp?**

No, but assemble does leverage some of the same libraries as gulp, including some libraries from the gulp team, such as [vinyl][], [vinyl-fs][] (via the [assemble-fs][] plugin), and [bach][] (via [composer][]).

**Why does assemble use the same libraries?**

Because they're great libraries, with great patterns, and they're well maintained.

More importantly, when we designed assemble's new API we felt strongly that it would be a disservice to the community to try to compete with a different plugin pattern than the one gulp has already established. We also tried very hard to ensure that gulp plugins could be used with assemble.

**Why doesn't assemble use gulp?**

We do use gulp quite extensively in many of our projects, in the way that gulp is used on most projects: with a `gulpfile.js` with plugins used for ensuring code quality, linting, unit tests, coverage, and sometimes more interesting and complex things that gulp is great at handling.

Beyond that, Assemble and gulp actually share very little in common in terms of high-level API and use cases. For example, the vast majority of assemble's methods are related to the following areas:

* managing templates, template collections, lists, etc
* layouts and partials
* registering template engines
* middleware and routes
* registering and using helpers
* instance plugins
* running generators

Here are the areas that assemble and gulp share in common (both bullets are introduced to assemble via plugins):

* file system methods (`src`, `dest`)
* task methods (`task`, `watch`)

Gulp could probably handle all of the first items listed with a combination of plugins and (quite a bit of) custom code. But so could JavaScript.

What matters is that you choose the library that makes sense for what you need on a project-by-project basis. Don't try to fit a square peg in a round hole.

- if you have an `assemblefile.js` doing things that could all easily be handled by gulp, then make your life easier and use a gulpfile with gulp instead.
- if you have a gulpfile filled with almost entirely assemble code, use an `assemblefile.js` and use assemble directly.

However, despite all that has been mentioned, we initially wanted to use gulp as a library but decided to go a different direction and use [composer][] for running tasks instead.

There were a few reasons for this:

1. We wanted Assemble to offer a great deal of control over tasks through the API. Meaning, more control that gulp was designed to offer.
1. We wanted to expose a `.build` method for running tasks
1. We wanted to be able to run generators as well as tasks

In the end it just made more sense to create our own library from the ground up, but [composer][] still leverages [bach][] for flow control.
