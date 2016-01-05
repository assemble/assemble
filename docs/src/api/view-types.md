---
title: View types
description: >
  This document describes a concept unique to Assemble called "view types". View types give Assemble, and the user, a way of controlling the behavior and features expected for a given view.
related: 
  - {title: collections, url: collections.md}
  - {title: view, url: view.md}
---

**Jump ahead**

Available view types:

- [renderable](#renderable)
- [partial](#partial)
- [layout](#layout)

**The basics**

View types determine what will happen to templates in a collection at certain points during the build process. Additionally:

- every view collection must define at least one view type; if no type is defined `renderable` will be set by default.
- more than one view type may be defined, but this should be done sparingly to avoid unnecessarily creating methods and logic that aren't needed (continue reading to learn more about this below).

## Defining view types

View types are defined when a view collection is created by the `.create()` or `.collection()` methods. 

A string or array of view types may be passed on the `viewType` option. If no `viewType` is defined, `renderable` will be used by default. 

**Example**

```js
app.create('includes', {viewType: 'partial'});
console.log(app.includes.options.viewType)
//=> ['partial']

app.create('pages');
console.log(app.includes.options.viewType)
//=> ['renderable']
```

## Checking view types

A collection's view type(s) are stored as an array on `options.viewType`.

```js
app.create('pages');
console.log(app.pages.options.viewType)
//=> ['renderable']
```

## Deciding on view types

Assemble currently supports three view types: `renderable`, `layout` and `partial`. Each view type has unique attributes and features that make that view type more suitable from some things, and less suitable for others. This section describes each, and why you might need one type versus another.

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