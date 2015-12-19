# Template API

> get and set globally available options and config values

- `.create`
- `.engine`
- `.helper`

***

## .create

Create custom template types

```js
assemble.create('include', { isPartial: true });

// usage
assemble.include('sidebar', 'this is a sidebar');
```

***


## .engine

Register any template engine to process templates:

```js
assemble.engine('hbs', require('engine-handlebars'));
```

***

## .helper

Register helper functions:

```js
var fs = require('fs');

assemble.helper('read', function(fp) {
  return fs.readFileSync(fp, 'utf8');
});
```
