---
title: Helper context
description: Properties automatically bound to the context for each helper.
category: subjects
---

```js
app.helper('foo', function() {
  // instance of `assemble`
  console.log(this.app);

  // populated by the `.option` method
  console.log(this.options);

  // render-time context created by the `.mergeContext` function
  console.log(this.context);

  // the current `view` object being rendered
  console.log(this.context.view);

});
```
