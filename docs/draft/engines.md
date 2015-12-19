## Engines

### .engine

Register a template engine:

```js
var consolidate = require('consolidate');
assemble.engine('hbs', consolidate.handlebars);
```

Pass engine-specific options:

```js
assemble.engine('hbs', consolidate.handlebars, {
  destExt: '.html'
});
```


### .engines

Returns the specified engine `ext`. 

**Example:**

```js
var engine = assemble.engines('hbs');
engine.addHelper('lower', function(str) {
  return str.toLowerCase();
});
```

To get all of the currently registered engines:

```js
var engines = assemble.engines();
//=> {'.hbs': [function], '.*': [function]}
```



**Examples:**

```js
assemble.engine('hbs', handlebars, {
  layouts: {
    delims: ['{{', '}}']
    defaultLayout: 'default'
  },
  helpers: {},
  partials: {},
  destExt: '.html'
});


assemble.engine('tmpl', lodash, {
  delims: ['{%', '%}']
  layouts: {
    delims: ['{{', '}}']
    defaultLayout: 'default'
  },
  imports: {},
  interpolate: /\{\%=([\s\S]+?)\%\}/g,
  evaluate: /\{\%([\s\S]+?)\%\}/g,
  escape: /\{\%-([\s\S]+?)\%\}/g
});
```
