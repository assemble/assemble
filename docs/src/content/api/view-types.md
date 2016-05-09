---
title: View types
collection: docs
category: api
description: >
  This document describes a concept unique to Assemble called "view types". View types give Assemble, and the user, a way of controlling how views are handled during the render cycle.
related: ['collections', 'class.View']
---

## Overview

Whereas "view collections" are used for organizing and caching views, "view types" determine how the individual views in a collection will be handled during the render cycle.

For example, views with the `partial` view type will be merged onto the context before being passed to the template engine for rendering, but views with the `layout` and `renderable` types will not.

**Supported view types**

Assemble currently supports three view types: `partial`, `renderable` and `layout`. View types are defined on the `viewType` option when a collection is created, and collections may have one _or more_ view types, defaulting to `renderable` if no other types are defined.

- `partial`: allows "partial views" to be injected into other views. useful for components, document fragments, or other snippets of reusable code or content.
- `layout`: allows views to "wrap" other views (of any type, including other layouts or partials) with common code or content.
- `renderable`: views that have a one-to-one relationship with rendered files that will eventually be visible to a user or visitor to a website. For example: pages or blog posts.

**Avoid view type overload!**

Although multiple view types may be assigned to a collection, this should be done sparingly to avoid creating unnecessary methods, logic and processing that can have a cumulative, negative impact on build times.

Usually one view type will be sufficient.

## Defining view types

View types are defined when a view collection is created by the `.create()` or `.collection()` methods. Or, passed on the constructor options when creating a view collection from the [Views class](Views.md).

A string or array of view types may be passed on the `viewType` option. If no `viewType` is defined, `renderable` will be used by default.

**Example**

View types are stored as an array on a collection's `viewType` property:

```js
app.create('includes', {viewType: 'partial'});
console.log(app.includes.viewType)
//=> ['partial']

app.create('pages');
console.log(app.includes.viewType)
//=> ['renderable']
```

## Deciding on view types

Each of the three supported view types, `renderable`, `layout` and `partial`, has special attributes that make that view type more suitable from some things, and less suitable for others.

This section describes each, and why you might need one type versus another.

**How do view types differ from collections?**

Before we dive into the specifics, it might help to understand the difference between view types and view collections. Particularly, you may have noticed that assemble has _view collections_ with the names "layout" and "partial". While these two collections happen to share the same names as two view types, the concepts are very different.

Here is how they differ:

- view types determine how views will be handled
- view collections are just objects

Thus, the `layouts` collection was given the name "layouts" because the views in that collection should have _layout behavior_, so it makes sense semantically. Same goes for partials.

**Examples**

To help illustrate further, here are some arbitrary examples of custom collections that a user could create, and the view types that might be assigned to them:

| Collection name | View types |
| --- | --- |
| `includes` | partial |
| `components` | partial |
| `pages` | renderable |
| `posts` | partial or renderable, or both |
| `sections` | partial or layout |
| `picards` | if we had a type for this, it would be "earl grey, hot" |


**Behavior**

_(TODO: add docs)_

**Methods**

_(TODO: add docs)_

**Lookups**

_(TODO: add docs)_

**Available view types**

- [renderable](#renderable)
- [partial](#partial)
- [layout](#layout)

### Renderable

When the `renderable` view type is defined on a collection, views in the collection are  decorated with methods that are unique to this view type, including:

- `.compile`
- `.render`

### Partial

Views that belong to the `partial` view type may be injected into other templates of any view type (including other "partials").

### Layout

Views in a collection with the `layout` view type may be used to wrap other templates of any view type with common code or content (including other "layouts").

_(TBC)_
