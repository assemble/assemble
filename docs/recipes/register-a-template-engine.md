# Register an engine

> Register one or more template engines to process templates

## Engines match file extensions

Engines are associated with file extensions and are automatically selected and used by assemble during the build. For example, to process files with the `.tmpl` extension using [engine-lodash] you would do:

```js
assemble.engine('tmpl', require('engine-lodash'));
```

**Template rendering example:**

This is a full example of how you would register an engine and render the files associated with the engine:

```js
var assemble = require('assemble');

// register the engine
assemble.engine('tmpl', require('engine-lodash'));

// render `.tmpl` files using [engine-lodash]
assemble.task('default', function () {
  assemble.src('template/*.tmpl')
    .pipe(assemble.dest('dist/'));
});
```

**CSS pre-processor example**

This is a full example of how you would register an engine and render the files associated with the engine:

```js
var assemble = require('assemble');

// register the engine
assemble.engine('tmpl', require('engine-lodash'));

// render `.tmpl` files using [engine-lodash]
assemble.task('default', function () {
  assemble.src('template/*.tmpl')
    .pipe(assemble.dest('dist/'));
});
```



## One or more extensions per engine

Pass an array of extensions to use the same engine for each extension in the array:

```js
assemble.engine(['md', 'tmpl'], require('engine-lodash');
```

## .engine

**Signature:**

```js
assemble.engine(ext, callback);
```

**Params:**

- `ext` The file extension associate with the engine.


Add the following to your `assemblefile.js`:

```js
```

Register a template engine to process  as `ext`.

By default, Express will require() the engine based on the file extension. For example if you try to render a "foo.jade" file Express will invoke the following internally, and cache the require() on subsequent calls to increase performance.

```js
// files with the `.tmpl` extension will be rendered by `engine-lodash`
assemble.engine('tmpl', require('engine-lodash');
```


**Good to know**

- By default, Assemble uses [engine-assemble] to process Handlebars templates. 
- Any number of engines can be registered
