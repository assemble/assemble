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

## .onInit

Custom onInit method:

function that takes `app`, `config`, and `options` and returns function used in a transform stream:

```js
function onInit(app, config, options) {
  return function(file, enc, cb) {
    this.push(file);
    cb();
  };
}
```

## .postInit

Custom postInit method:

function that takes `app`, `config`, and `options` and returns a function to be used as the flush function in a transform stream:

```js
function postInit(app, config, options) {
  return function(cb) {
    cb();
  };
}
```
