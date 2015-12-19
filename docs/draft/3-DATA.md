# Data API

> Load, transform and process data that will be passed as context to templates (at runtime)

- `.data`
- `.transform`



***

## .data

Load data.

**Example**

```js
// pass an object
assemble.data({
  title: 'My Blog!'
});

// or file paths / glob patterns
assemble.data('*.json');
assemble.data(['*.json', 'data/*.{yml,json}']);
```



***


## .transform

Transforms are executed immediately so `data` and `options` can be updated.

**Example**

```js
module.exports = function travis(app) {
  var data = app.cache.data;
  try {
    if (!data.hasOwnProperty('travis')) {
      app.data({travis: {language: "node_js", node_js: ["0.10", "0.11"]}});
    }
  } catch(err) {
    console.log(err);
  }
};
```

Usage:

```js
assemble.transform('pkg', require('travis-transform'));
```
