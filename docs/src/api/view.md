---
title: View
description: >
  This document explains what a "view" is, and how views are used in Assemble. 
related: 
  - { title: collections, url: collections.md }
  - { title: view-types, url: view-types.md }
---

## What is a view?

A `view` is a "template object" (this is why the terms "view" and "template" are often used interchangeably throughout the documentation).

Views are also instances of [vinyl][] files, so they have all of properties and features you would expect a vinyl file to have, with the addition of the following:

- `view.key` **String**: Used for lookups 
- `view.content` **String**: View contents
- `view.options`
- `view.data`

See the [vinyl][] docs for more details.
