---
title: 
category: recipes
---

The [loading-views](loading-views.md) recipe shows you how to add views to a collection. This recipe shows you how to write views to the file system after they're loaded onto a collection.


Push views onto a vinyl stream


```js
app.task('default', function() {
  app.pages('foo/*.hbs');

  return app.toStream('pages')
    .pipe(foo())
    .pipe(bar())
    .pipe(app.dest('.'));
});
```
