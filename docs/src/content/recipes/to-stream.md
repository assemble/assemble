---
title: Push views onto a vinyl stream
category: recipes
---
The [collection-loaders](./collection-loaders.md) recipe shows how to create a collection and load views using glob patterns.

This recipe picks up where that recipe ends, and shows how to push views from any collection into a vinyl `src` stream.

**Example**

```js
app.task('default', function() {
  app.pages('foo/*.hbs');

  return app.toStream('pages')
    .pipe(foo())
    .pipe(bar())
    .pipe(app.dest('.'));
});
```
