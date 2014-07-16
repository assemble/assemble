# assemble [![NPM version](https://badge.fury.io/js/assemble.png)](http://badge.fury.io/js/assemble)  [![Build Status](https://travis-ci.org/assemble/assemble.png)](https://travis-ci.org/assemble/assemble) 

> Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.

### [Visit the website →](http://assemble.io)

## Install
Install with [npm](npmjs.org):

```bash
npm i assemble --save-dev
```

## API
Module dependencies.
  


Local modules.
  


## Assemble

The Assemble constructor is Assemble's parent storage class.
Optionally initialize a new `Assemble` with the given `context`.

**Example:**

```js
var config = new Assemble({foo: 'bar'});
```

* `context` {Object}   


### .option

Get, set and extend assemble options, `assemble.option` has all
of the same methods as `assemble`, but dedicated to options handling.

**Example**

```js
assemble
  .option('layouts', 'src/layouts')
  .option('partials', 'src/partials/*.hbs');
```

* `options` {*}   


Extend `Assemble`
  


Expose middleware.
  


### .options

Pass options to assemble.

**Examples:**

```js
assemble.options({layoutdir: 'templates/layouts'});
```

* `name` {String} 
* `fn` {Function}   


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


### .use

TODO

* stage {[type]} 
* plugins {[type]}  
* `return` {[type]} 


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


### .collection

The collection method returns a plugin used to create `index` pages and
related-pages for any collections that have been defined.

**Example:**

```js
assemble.collection(TODO: @doowb);
```

This is `assemble`'s internal collection method, also exposed as
a public method allowing this method to be replaced with a
custom `collection` method if necessary.

* `options` {Object}: Options used to setup collection definitions.  
* `return` {Stream}  Plugin used in the pipeline. 


### .partials

Specify file paths or glob patterns for partials to use with the current
template engine.

Partials are read from the file system, parsed into an object, and stored
on the `cache` using the full filepath of each partial as its unique
identifier.

**Example:**

```js
assemble.partials('templates/partials/*.hbs');
```

This method may be used as an alternative to, or in conjunction with,
 `options.partials`, (e.g. `assemble.options({partials: '*.hbs'})`). If both
are defined, the results are combined.

* `patterns` {String}: File paths or glob patterns to partials. 
* `options` {String}  
* `return` {Object} 


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


### .render

This is Assemble's internal render method, but it's exposed as a public method
so it can be replaced with a custom `render` method.

* `data` {Object}: Data to pass to registered template engines. 
* `options` {Object}: Options to pass to registered template engines.  
* `return` {String} 


### .renderFile

This is Assemble's internal render method, but it's exposed as a public method
so it can be replaced with a custom `render` method.

* `data` {Object}: Data to pass to registered template engines. 
* `options` {Object}: Options to pass to registered template engines.  
* `return` {String} 


### .parse

Register a parser `fn` to be used on each `.src` file. This is used to parse
front matter, but can be used for any kind of parsing.

By default, Assemble will parse front matter using [gray-matter][gray-matter].
For front-matter in particular it is probably not necessary to register additional
parsing functions, since gray-matter can support almost any format, but this is
cusomizable if necessary or if a non-supported format is required.

**Example:**

```js
assemble.parser('uppercase', function (assemble) {
  return function (file, options, encoding) {
    file.contents = new Buffer(file.contents.toString().toUpperCase());
    return file;
  };
});
```

[gray-matter]: https://github.com/assemble/gray-matter

* `name` {String}: Optional name of the parser, for debugging. 
* `options` {Object}: Options to pass to parser. 
* `fn` {Function}: The parsing function.  
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

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on July 16, 2014._