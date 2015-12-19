# Tasks

> TODO

## Overview

- 


**Examples**


```js
assemble.task('default', function() {
  assemble.src('templates/*.hbs')
    .pipe(assemble.dest('dist/'));
});
```

**With plugins**

```js
assemble.task('default', function() {
  assemble.src('templates/*.hbs')
    .pipe(plugin1())
    .pipe(plugin2())
    .pipe(plugin3())
    .pipe(assemble.dest('dist/'));
});
```
