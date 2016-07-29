---
title: Why Assemble?
---

> Why should I use Assemble, instead of X?

## Context

Assemble gives you more granular control over context and all of the stages in the [render cycle](#render-cycle) than **any** other solution.

Getting context right isn't a nice-to-have, it's a necessity. Despite being a necessity, since context handling can be complex to manage, must static site generators avoid it altogether and tell you to do it.

**Related resources**

- [assemble/context-workshow](https://github.com/assemble/context-workshop): explains how context is created, as well as where, when and why the context works the way it does at each point in the render cycle.

## Base

Assemble is built on [base][], which comes with a number of advantages:

1. If you know how to use assemble, you will know how to use other applications built on `base`, such as [verb][], [generate][] and [update][].
1. [Plugin system](#plugin-ecosystem)

## Plugin ecosystem

Since assemble is built with [base][], plugin conventions make it easy to create, publish and share plugins with other applications. For example:

* All [base plugins](https://www.npmjs.com/browse/keyword/baseplugin) can be used with assemble
* Most [verb plugins](https://www.npmjs.com/browse/keyword/verbplugin) can be used with assemble
* Most [update plugins](https://www.npmjs.com/browse/keyword/updateplugin) can be used with assemble
* Most [generate plugins](https://www.npmjs.com/browse/keyword/generateplugin) can be used with assemble

**Related resources**

- [plugins docs](docs/plugins.md).

## Expressive API

Assemble has a functional, imperative API that is powerful and easy to use.


## Enforce consistent design

Facilitates the use of _modular, encapsulated components_ in your markup, like pages, partials and layouts, resulting in consistent design across your projects.
