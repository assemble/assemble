---
title: Layouts
description: > 
  This document describes Layouts, one of the three view collections that Assemble ships with by default. Layouts are views (templates) that can wrap other views with common content or code.
collection: docs
category: api
related: 
  - {title: "view collections", url: collections.md}
  - {title: view, url: view.md}
---

## What is a layout?

In Assemble, any template (view) can be wrapped with a layout. Pages, partials, posts, or even other layouts.

- Layouts are a special kind of view that belong to the `layouts` view collection
- Layouts are stored on the `assemble.views.layouts` object.

## Custom layout collections

