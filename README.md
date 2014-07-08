# assemble [![NPM version](https://badge.fury.io/js/assemble.png)](http://badge.fury.io/js/assemble)  [![Build Status](https://travis-ci.org/assemble/assemble.png)](https://travis-ci.org/assemble/assemble)

> Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.

### [Visit the website →](http://assemble.io)

## Install
Install with [npm](npmjs.org):

```bash
npm i assemble --save-dev
```

## API
## Assemble

The Assemble constructor is Assemble's parent storage class.
Optionally initialize a new `Assemble` with the given `context`.

**Example:**

```js
var config = new Assemble({foo: 'bar'});
```

* `context` {Object}


Expose middleware.



### .task

Define a assemble task.

**Example**

```js
assemble.task('docs', function() {
  // do stuff
});
```

* `name` {String}
* `fn` {Function}


### .src

Glob patterns or filepaths to source files.

**Example**

```js
assemble.task('docs', function() {
  assemble.src('src/*.tmpl.md')
    // do stuff
});
```

* `filepath` {String}


### .dest

Define the destination filepath for a task.

**Example**

```js
assemble.task('docs', function() {
  assemble.src('src/*.tmpl.md')
    .pipe(dest('docs'));
});
```

* `filepath` {String}


### .use

If the option is true, use the given middleware, otherwise use noop.

**Example**
```js
 return fs.src(pattern, options)
   .pipe(this.use(options.parse, this.parse)(options))
   .pipe(this.use(options.render, this.parse)(options));
```

* `option` {Mixed}: a value that can be truthy if the middleware should be used.
* `middleware` {Function}: The middleware to return when `option` is truthy


### .partial

When only a `key` is provided, returns a parsed partial `str`.
When a `key` and `str` are provided, parses the `str` into
a partial object and stores it with the `key`.

**Example**

```js
// store a partial file called 'footer'
var str = fs.readFileSync('footer.hbs', 'utf8');
assemble.partial('footer', str);

// get the 'footer' partial later
var footer = assemble.partial('footer');
```

* `key` {String}
* `str` {String}
* `return` {Object} parsed partial


### .partials

Returns an object with all the parsed partials by their name.
Internally uses the resolved partial filepaths from `options.partials`
to read in and store any partials not already stored.

**Example**

```js
// get all the partials and pass them to Handlebars for use
var Handlebars = require('handlebars');
var _ = require('lodash');

var partials = assemble.partials();
_(partials).forEach(function (partial, name) {
  Handlebars.registerPartial(name, partial.content);
});

```

* `return` {Object} all the parsed partials


### .layout

When only a `key` is provided, returns a parsed layout `str`.
When a `key` and `str` are provided, parses the `str` into
a layout object and stores it with the `key`.

**Example**

```js
// store a layout file called 'default'
var str = fs.readFileSync('default.hbs').toString();
assemble.layout('default', str);

// get the 'default' layout later
var default = assemble.layout('default');
```

* `key` {String}
* `str` {String}
* `return` {Object} parsed layout


### .layouts

Returns an object with all the parsed layouts by their name.
Internally uses the resolved layout filepaths from `options.layouts`
to read in and store any layouts not already stored.

**Example**

```js
// get all the layouts and pass them to assemble-layouts for use
var assembleLayouts = new require('assemble-layouts').Layouts();
var _ = require('lodash');

var layouts = assemble.layouts();
_(layouts).forEach(function (layout, name) {
  assembleLayouts.set(name, layout);
});

```

* `return` {Object} all the parsed layouts


### .set

Assign `value` to `key`.

**Example**

```js
assemble.set('a', {b: 'c'});

// expand template strings with expander
assemble.set('a', {b: 'c'}, true);
```

Visit [expander's docs](https://github.com/tkellen/expander) for more info.

* `key` {String}
* `value` {*}
* `expand` {Boolean}
* `return` {Assemble} for chaining


### .get

Return the stored value of `key`.

```js
assemble.set('foo', 'bar')
assemble.get('foo')
// => "bar"
```

* `key` {*}
* `create` {Boolean}
* `return` {*}


### .constant

Set a constant on the config.

**Example**

```js
assemble.constant('site.title', 'Foo');
```

* `key` {String}
* `value` {*}


### .enabled (key)

Check if `key` is enabled (truthy). (express inspired)

```js
assemble.enabled('foo')
// => false

assemble.enable('foo')
assemble.enabled('foo')
// => true
```

* `key` {String}
* `return` {Boolean}


### .disabled (key)

Check if `key` is disabled. (express inspired)

```js
assemble.disabled('foo')
// => true

assemble.enable('foo')
assemble.disabled('foo')
// => false
```

* `key` {String}
* `return` {Boolean}


### .enable (key)

Enable `key`.  (express inspired)

**Example**

```js
assemble.enable('foo');
```

* `key` {String}
* `return` {Assemble} for chaining


### .disable (key)

Disable `key`. (express inspired)

**Example**

```js
assemble.disable('foo');
```

* `key` {String}
* `return` {Assemble} for chaining


### .merge

Extend the config with the given object. This method is chainable.

**Example**

```js
assemble
  .merge({foo: 'bar'}, {baz: 'quux'});
  .merge({fez: 'bang'});
```

* `return` {Assemble} for chaining


### .config

Extend the config with the given object. This method is chainable.

**Example**

```js
assemble
  .extend({foo: 'bar'}, {baz: 'quux'});
  .extend({fez: 'bang'});
```

* `arguments` {Object}
* `return` {Assemble} for chaining


### .options

Extend the options.

**Example**

```js
assemble
  .options({layouts: 'src/layouts'})
  .options({partials: 'src/partials/*.hbs'});
```

* `options` {Object}
* `return` {Assemble} for chaining


### .plasma

Extend the context with the given object using [plasma](https://github.com/jonschlinkert/plasma).

**Example**

```js
assemble
  .plasma({foo: 'bar'}, {baz: 'quux'});
  .plasma({fez: 'bang'});
```

* `return` {Assemble} for chaining


### .data

Proxy for `config.plasma()`.

* `return` {Assemble} for chaining


### .engine

Register the given template engine callback `fn` as `ext`.

Template engines in Assemble are used to render:

  - views:   Such as pages and partials. Views are used when generating
             web pages. The path of the layout file will be passed to the
             engine's `renderFile()` function.

  - layouts: Views used when generating web pages.  The path of the layout
             file will be passed to the engine's `renderFile()` function.

  - content: Text written in lightweight markup, which optionally has front
             matter.  Front matter will be removed from the content prior to
             rendering. `data` from front matter is merged into the context
             and passed to the engine's `render()` function.

By default Assemble will `require()` the engine based on the file extension.
For example if you try to render a "foo.hbs" file Assemble will invoke the
following internally:

```js
var engine = require('engines');
assemble.engine('hbs', engine.handlebars);
```

The module is expected to export a `.renderFile` function or, for compatibility
with Express, an `__express` function.

For engines that do not provide `.renderFile` out of the box, or if you wish
to "map" a different extension to the template engine you may use this
method. For example mapping the EJS template engine to ".html" files:

```js
assemble.engine('html', require('ejs').renderFile);
```

Additionally, template engines are used to render lightweight markup found in
content files.  For example using Textile:

```js
assemble.engine('textile', require('textile-engine'));
```

In this case, it is expected that the module export a `render` function which
will be passed content data (after removing any front matter).

* `ext` {String}
* `fn` {Function}
* `options` {Object}
* `return` {Assemble} for chaining


### .engine

* `data` {Object}
* `options` {Object}


### .parser

* `str` {String}: Un-parsed file content.
* `options` {Object}: Options to pass to the parser.


### .parse

Register `fn` used to parse front matter.

By default, Assemble will parse front matter using [gray-matter][gray-matter].
It is probably not necessary to register additional parsing functions, since
gray-matter can support almost any format, but this is cusomizable if
necessary or if a non-supported format is required.

**Example:**

```js
assemble.parse(function(data) {
  return JSON.parse(data);
});
```

[gray-matter]: https://github.com/assemble/gray-matter

* `name` {String}
* `fn` {Function}
* `return` {Assemble} for chaining


### .highlight

Register a function for syntax highlighting.

By default, Assemble uses highlight.js for syntax highlighting.  It's not
necessary to register another function unless you want to override the default.

**Examples:**

```js
assemble.highlight(function(code, lang) {
  if (lang) {
    return hljs.highlight(lang, code).value;
  }
  return hljs.highlightAuto(code).value;
});
```

* `fn` {Function}


### .process

Recursively expand template strings into their resolved values.

**Example**

```js
assemble.process({a: '<%= b %>', b: 'c'});
//=> {a: 'c', b: 'c'}
```

* `key` {String}
* `value` {Any}


### .remove(key)

Remove an element by `key`.

**Example**

```js
assemble.remove('foo');
```

* `key` {*}


### .omit

Omit properties from the config.

**Example**

```js
assemble
  .omit('foo');
  .omit('foo', 'bar');
  .omit(['foo']);
  .omit(['foo', 'bar']);
```

**Params:**

* `return` {Assemble} for chaining


### .watch

Rerun the specified task when a file changes.

```js
assemble.task('watch', function() {
  assemble.watch('docs/*.md', ['docs']);
});
```

**Params:**

* `glob` {String|Array}: Filepaths or glob patterns.
* `options` {String}
* `fn` {Function}: Task(s) to watch.
* `return` {String}


Expose `Assemble`

## Authors

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

**Brian Woodward**

+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb)


## License
Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on July 07, 2014._