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

View types determine what will happen to templates in a collection at certain points during the build process, and:

- every view collection must define at least one view type. If no type is defined, `renderable` is used by default.
- more than one type may be defined, but this should be done sparingly to avoid unnecessarily creating methods and logic that aren't needed (continue reading to learn more about this below).
- view types are defined on the `.create()` or `.collection()` method options.

## Defining view types

Pass a string or array of view types on the `viewType` option:

```js
app.create('includes', {viewType: 'partial'});
console.log(app.includes.options)
//=> {viewType: ['partial']}
```

If no `viewType` is defined, `renderable` will be used:

```js
app.create('pages');
console.log(app.pages.options)
//=> {viewType: ['renderable']}
```

## Choosing a type

This section describes each type, its unique attributes, and why you might need one type versus another.

### Renderable

Views that belong to the `renderable` view type are decorated with methods that are unique to this view type: `compile` and `render`. 

### Partial

Views that belong to the `partial` view type may be injected into other templates of any view type (including `partial` views).

### Layout

Views in a collection with the `layout` view type may be used to wrap other templates of any view type (including `layout`) with common code or content.