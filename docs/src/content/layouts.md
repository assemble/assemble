---
title: Layouts
description: > 
  This document describes Layouts, one of the three view collections that Assemble ships with by default. Layouts are views (templates) that can wrap other views with common content or code.
---

{{description}}

<!-- toc -->

## What is a layout?

- Layouts are a special kind of view that belong to the `layouts` view collection
- Layouts are stored on the `assemble.views.layouts` object.

In Assemble, any view (template) can be wrapped with a layout. Pages, partials, posts, or even other layouts.

Since a view may have a layout, and that view's layout may have another layout defined, and so on - ad infinitum - we refer to a view's layout


## Custom layout collections

