---
title: Listening for errors
---

Error events are emitted on [app][], [collection][] and [view][].

**Example**

```js
app.on('error', function(err) {
  console.error(err);
});
```
