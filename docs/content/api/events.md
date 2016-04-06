---
title: Events
description: >
  This document describes Layouts, one of the three view collections that Assemble ships with by default. Layouts are views (templates) that can wrap other views with common content or code.
collection: docs
category: api
related:  ['view-collections', 'class.View']
---

- [ ] listening for events
- [ ] events emitted


## Event emitters

Events are emitted on all instances that inherit [base][], including:

* [app][]
* [collection][]
* [group][]
* [item][]
* [list][]
* [view][]
* [views][]


## Example

Listen for errors;

```js
app.on('error', function(err) {
  console.error(err);
});
```


[app]: /api/app.md
[collection]: /api/collection.md
[view]: /api/view.md

[base]: https://github.com/node-base/base
