---
title: Listening for errors
category: recipes
---

Error events are emitted on [app][], [collection][] and [view][].

**Example**

```js
app.on('error', function(err) {
  console.error(err);
});
```
