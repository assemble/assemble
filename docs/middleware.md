# Middleware



## Verbs

- `use`
- `all`
- `preRender`
- `postRender`


**Example**

Add a banner to every `.js` that comes through any task.

```js
verb.postRender(/\.js/, function (file, next) {
  file.content = banner + file.content;
  next();
});
```
