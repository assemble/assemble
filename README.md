# assemble [![NPM version](https://badge.fury.io/js/assemble.png)](http://badge.fury.io/js/assemble)  [![Build Status](https://travis-ci.org/assemble/assemble.png)](https://travis-ci.org/assemble/assemble) 

> Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.


### HEADS UP! This document is incomplete!

### Also, please do not create issues against the v0.6.0 branch unless you have a pull request or would like to discuss an issue that might lead to you doing a pull request. Thanks!


### [Visit the website →](http://assemble.io)

## v0.6.0 Release notes

For v0.6.0, Assemble was completely re-written from the ground up to be a 100% standalone library. Before we dive into the awesome new features that Assemble is introducing in this version, there are a couple of things you need to know:

**Grunt users**

* Rest assured that you will be able to continue using Assemble as a Grunt plugin. However, **going forward you will need to do `npm install grunt-assemble`** instead.
* If you decide to continue using older (pre-v0.6.0) versions of Assemble you will still need to do `npm install assemble`. Visit [grunt-assemble](https://github.com/assemble/grunt-assemble) for more info.

**Gulp users**

* [gulp-assemble](https://github.com/assemble/gulp-assemble) is finally ready to go!


### Influences

_(WIP!)_

We'd like to say "thanks!" to the great libraries that influenced this version of Assemble! We'd also point out some of the special things these libraries bring to Assemble in v0.6.0.

  - **[Vinyl]** - We all know the [Gulp] team over at [Fractal] does amazing work with streams. We decided to follow their lead and use [vinyl] and [vinyl-fs] in Assemble v0.6.0.
  - **[Gulp]** - We also looted some test fixtures, the CLI, and the new Assemble configuration signature from Gulp itself. Also thanks to @tkellen for his great work on [Liftoff]
  - **[Express]** - Engines, routes, and views, general code style.
  - **[Kerouac]** - Parsers, routes
  - **Assemble** - Last but not least, Assemble itself! At heart, Assemble is still very much Assemble in this version. We've introduced a powerful API, new features, and a dramatically different configuration signature, but _no features from previous versions were harmed during the making of this version_, and the goals and vision of the project remain the same.

New Features

  - **API**
  - **CLI** Assemble uses the same config-style and CLI patterns as gulp. To run Assemble the command line, do `assemble`
  - **Streams** (gulp-style)
  - **Plugins** (gulp-style): Not only does Assemble have support for gulp-style streaming plugins, but any gulp plugin can be used with Assemble.
  - **Parsers** (kerouac-style):
  - **Engines** express-style engine support! Engines support has changed so dramatically in this version that we're considering this a new feature. Assemble v0.6.0 allows any engine from **[Consolidate]** or **[Transformers]** to be registered with `assemble.engine()`, just like [express](http://expressjs.com/4x/api.html#app.engine). To add a custom engine, follow the instructions on the [consolidate](https://github.com/visionmedia/consolidate.js) docs or the [transformers](https://github.com/ForbesLindesay/transformers) docs, depending on the type of engine.
  - **Routes** (express/kerouac-style)
  - **Middleware** (express/kerouac-style)
  - **.assemblerc.yml**

Improved Features

  - **Middleware**
  - **Front matter**: support for [gray-matter] was added.


New `options` settings:

* `layouts`: Define a glob of layouts. Allows more flexibility than `layoutdir`.
* `

Improved Features


[gulp]: https://github.com/wearefractal/gulp
[fractal]: https://github.com/wearefractal
[vinyl]: https://github.com/wearefractal/vinyl
[vinyl-fs]: https://github.com/wearefractal/vinyl-fs


## Install
Install with [npm](npmjs.org):

```bash
npm i assemble --save-dev
```

## API
Module dependencies.
  


## Assemble

The Assemble constructor is Assemble's parent storage class.
Optionally initialize a new `Assemble` with the given `context`.

**Example:**

```js
var config = new Assemble({foo: 'bar'});
```

* `context` {Object}   


Extend `Assemble`
  


### .cwd

Set the current working directory for all paths.

* `paths` {String}  
* `return` {String} 


### .plugin

Run assemble middleware

* stage {String} 
* plugins {Array}  
* `return` {String} 


### .task

Define an assemble task.

**Example**

```js
assemble.task('site', function() {
  // do stuff
});
```

* `name` {String} 
* `fn` {Function}   


### .src

Glob patterns or filepaths to source files.

**Example**

```js
assemble.task('site', function() {
  assemble.src('src/*.tmpl.md')
    // do stuff
});
```

* `filepath` {String}   


### .dest

Define the destination filepath for a task.

**Example**

```js
assemble.task('site', function() {
  assemble.src('src/*.tmpl.md')
    .pipe(dest('_gh_pages'));
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


### .page

Cache a page with the given options.

* `options` {Object}  
* `return` {Object} 


### .pages

Expose the `pages` plugin on Assemble.

* `config` {Object} 
* `options` {Object}  
* `return` {Object} 


### .partial

Add a partial to `cache.partials`. Partials can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Partial objects are expected to have the following properties:

  - `name` {String} The name of the partial
  - `data` {Object} Context for the partial
  - `content` {String} The actual content of the partial.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

**Example:**

```js
assemble.partial({
  name: 'a',
  layout: 'b',
  data: {title: 'Partial A'},
  content: 'Some content. '
});
```

* `patterns` {String}: File paths or glob patterns to partials. 
* `options` {String}  
* `return` {Object} 


### .partials

Load partials onto the cache as normalized partials-objects.
Specify file paths or glob patterns for partials to use with
the current view engine.

If a string or array of file paths or glob patterns is passed,
partials will be read from the file system, parsed into an
object, and stored on the `cache` using the full filepath
of each partial as its unique identifier.

**Example:**

```js
assemble.partials('templates/partials/*.hbs');
```

* `patterns` {String|Array|Object}: Object, array of objects, file paths or glob patterns. 
* `options` {String}: Options to pass to the `partialsCache.add()` method.  
* `return` {Object} 


### .layout

Add a layout to `cache.layouts`. Partials can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Partial objects are expected to have the following properties:

  - `name` {String} The name of the layout
  - `data` {Object} Context for the layout
  - `content` {String} The actual content of the layout.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

**Example:**

```js
assemble.layout({
  name: 'foo',
  data: {title: 'Partial Foo'},
  content: 'Some content. '
});
```

* `patterns` {String}: File paths or glob patterns to layouts. 
* `options` {String}  
* `return` {Object} 


### .layouts

Returns an object with all the parsed layouts by name. Internally uses
the resolved layout filepaths from `options.layouts` to read in and cache
any layouts not already cached.


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

* `patterns` {Array}: Glob patterns for looking up layouts 
* `options` {Object}: Options containing layout options  
* `return` {Object} all the parsed layouts,{Array}  Combined patterns with given layout options 


### .helpers

Returns an object with all loaded helpers;

TODO
 
* `return` {Object} all the resolved and loaded helpers 


### .helpers

Returns an object with all loaded helpers;

TODO
 
* `return` {Object} all the resolved and loaded helpers 


### .engine

Register the given view engine callback `fn` as `ext`.

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
* `fn` {Function|Object}: or `options` 
* `options` {Object}  
* `return` {Assemble} for chaining 


### .render

This is Assemble's internal render method, but it's exposed as a public method
so it can be replaced with a custom `render` method.

* `data` {Object}: Data to pass to registered view engines. 
* `options` {Object}: Options to pass to registered view engines.  
* `return` {String} 


### .parser

Register a parser `fn` to be used on each `.src` file. This is used to parse
front matter, but can be used for any kind of parsing.

By default, Assemble will parse front matter using [gray-matter][gray-matter].
For front-matter in particular it is probably not necessary to register additional
parsing functions, since gray-matter can support almost any format, but this is
cusomizable if necessary or if a non-supported format is required.

**Example:**

```js
assemble.parser('txt', function (assemble) {
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


### .router

**Example:**

```js
var myRoutes = assemble.router();
myRoutes.route(':basename.hbs', function (file, params, next) {
  // do something with the file
  next();
});

assemble.src('')
  .pipe(myRoutes())
  .pipe(assemble.dset())
```

* `options` {Object}  
* `return` {Function} 


### .buffer

This is Assemble's internal buffer method, but it's exposed as a public method
so it can be replaced with a custom `buffer` method.

* `options` {Object}: Options to pass to the buffer plugin.  
* `return` {String} 


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


Expose middleware.
  


Expose `Assemble`

## Authors
 
**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 
 
**Brian Woodward**
 
+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb) 


## License
Copyright (c) 2014 Assemble, contributors.  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 01, 2014._