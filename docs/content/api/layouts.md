---
title: Layouts
description: >
  This document describes Layouts, one of the three view collections that Assemble ships with by default. Layouts are views (templates) that can wrap other views with common content or code.
collection: docs
category: api
related: ['view-collections', 'class.View']
---

## What is a layout?

In Assemble, any template (view) can be wrapped with a layout. Pages, partials, posts, or even other layouts.

- Layouts are a special kind of view that belong to the `layouts` view collection
- Layouts are stored on the `assemble.views.layouts` object.

## Custom layout collections


## Defining layouts

As with all settings in assemble, the most _specific_ layout is the one that will be used on a view.

### view.layout

This is the most specific way to define a layout. The `view.layout` property is a getter/setter that checks the following objects to see if a `layout` is defined, in this order:

1. `view.data`
1. `view.locals`
1. `view.options`

### collection.resolveLayout

View collections have a `resolveLayout` method that takes an instance of `view`, and does the following:

- calls `view.layout`, if found the layout name is returned, and if not,
- falls back to the layout defined on the collection options.

### list.resolveLayout

Same as [collection.resolveLayout](#collectionresolveLayout).

### app.resolveLayout

The `app.resolveLayout` method takes an instance of `view`, and does the following:

- calls `collection.resolveLayout`, if found the layout name is returned, and if not,
- falls back to the layout defined on the collection options.
