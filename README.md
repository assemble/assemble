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



## Install
#### Install with [npm](npmjs.org):

```bash
npm i assemble --save-dev
```

## API
[## Files](lib/assemble.js#L39)


Just about all the deps below this line
will be externalized into modules.


 [## Assemble](lib/assemble.js#L82)

Create an `assemble` task.

* `context` **{Object}**  

```js
var assemble = require('assemble');

assemble.task('site', function() {
  assemble.src('templates/*.hbs')
    .pipe(assemble.dest('_gh_pages'));
});
```

Optionally initialize a new `Assemble` with the given `context`.

```js
var config = new Assemble({foo: 'bar'});
```


 [## cwd](lib/assemble.js#L427)

Set the current working directory for all paths. Default is `process.cwd()`, this does not need to be changed unless you require something different.

* `args` **{String|Array}**: File path or paths.  
* returns: {String}  

```js
assemble.cwd('bench');
```


 [## middleware](lib/assemble.js#L453)

Run the given middleware `fns` during the specified stage or stages.

* `stage` **{String}**  
* `fns` **{Array}**  
* returns **{Object}** `Assemble`: to enable chaining.  

```js
assemble.middleware('src:*', function() {
  // do stuff
});
``


 [## task](lib/assemble.js#L482)

Define an assemble task.

* `name` **{String}**  
* `fn` **{Function}**  

**Example**

```js
assemble.task('site', function() {
  // do stuff
});
```


 [## normalize](lib/assemble.js#L528)

Normalizes a file object to be an assemble vinyl file with the necessary properties to provide plugins in the pipeline with a consistent experience.

* `file` **{Object}**: The file object to normalize. The following properties are expect on the source file.    
  - `data` **{Object}**: : Typically metadata from locals or parsed front matter.  
  - `content` **{String}**: : The actual content of the file.    
* `options` **{Object}**: Options to pass to `normalize`    
  - `data` **{Object}**: : Typically metadata from locals or parsed front matter.  
  - `content` **{String}**: : The actual content of the file.    
* returns **{Object}** `file`: A normalize file object.  

This method will be externalized to [assemble-utils].


 [## src](lib/assemble.js#L557)

Glob patterns or filepaths to source files.

* `filepath` **{String}**  

```js
assemble.src([patterns], [options])
```

**Example**

```js
assemble.task('site', function() {
  assemble.src('src/*.hbs', {layout: 'default'})
    assemble.dest('dist')
});
```


 [## dest](lib/assemble.js#L592)

Specify a destination for processed files.

* `patterns` **{String|Array|Function}**: Glob patterns, file paths, or renaming function.  
* `opts` **{Object}**: Options to be passed to `dest` plugins.  

```js
assemble.dest([patterns], [opts])
```

**Example**

```js
assemble.task('sitemap', function() {
  assemble.src('src/*.txt')
    assemble.dest('dist', {ext: '.xml'})
});
```


 [## collection](lib/assemble.js#L628)

Register a collection to be used in assemble.

* `options` **{Object}**: Options used to build the collection.  
* returns **{Object}** `Assemble`: to enable chaining.  

**Example:**

```js
assemble.collection({
  name: 'tag',
  plural: 'tags',
  // Index of all tags
  index: {
    template: __dirname + 'layouts/tags.hbs',
    pagination: {
      prop: ':num',
      limit: 10,
      sortby: 'some.prop',
      sortOrder: 'ASC'
    },
    permalinks: {
      structure: ':foo/tags/:num/index.html'
    }
  },
  // Index of pages related to each tag
  related_pages: {
    template: __dirname + 'layouts/tag.hbs',
    pagination: {
      limit: 10,
      sortby: 'some.prop',
      sortOrder: 'ASC'
    },
    permalinks: {
      structure: ':foo/tags/:tag/index.html'
    }
  }
});
```


Report any related issues to [assemble-collections].
[assemble-collections]: https://github.com/assemble/assemble-collections/issues


 [## collections](lib/assemble.js#L647)

Register an array of collections to be used in assemble.

* `cols` **{Array|Object}**: Array of collections used to build the collection.  
* returns **{Object}** `Assemble`: to enable chaining.  

**Example:**

```js
assemble.collections([
  {
    name: 'tag',
    plural: 'tags',
    // Index of all tags
    index: { ... },
    // Index of pages related to each tag
    related_pages: { ... }
  },
  {
    name: 'archive',
    plural: 'archives',
    // Index of all archives
    index: { ... },
    // Index of pages related to each archive
    related_pages: { ... }
  }
]);
```


Report any related issues to [assemble-collections].
[assemble-collections]: https://github.com/assemble/assemble-collections/issues


 [## template](lib/assemble.js#L672)

Add a new template `type` to Assemble by passing the singular and plural names to be used for `type`.

* `type` **{String}**: Name of the new type to add  
* `options` **{Object}**  
* returns **{Object}** `Assemble`: to enable chaining.  

```js
assemble.template(singular, plural);
```

**Example:**

```js
assemble.template('include', 'includes');
```

Each new template `type` add two new methods to Assemble:

 - a method for loading one `type` template at a time
 - a method for loading multiple `type` templates at a time.


Continuing our example above:

```js
// load one include at a time
assemble.include();
// load multiple includes
assemble.includes();
```

### Create new template "types"

Templates loaded using these methods are stored on `assemble.cache[type]`, or continuing with the example, `assemble.cache.includes`.

**Loading template**

When loading templates via `assemble.includes()` or `assemble.include()`, templates can be specified either as objects, or as strings or arrays of glob patterns or file paths to the files to be parsed into template objects.

Template objects are expected to have the following properties:

  - `name` {String} The name of the include
  - `data` {Object} Context for the include
  - `content` {String} The actual content of the include.
  - `layout` {String} **Optionally** define a layout to be used for the given template.

**Example:**

```js
assemble.include({
 name: 'foo',
 data: {title: 'Include Foo'},
 content: 'Some content. '
});
```

### Pages

Add a page to `cache.pages`. pages can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

page objects are expected to have the following properties:

  - `name` {String} The name of the page
  - `data` {Object} Context for the page
  - `content` {String} The actual content of the page.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

* `patterns` **{String}**: File paths or glob patterns to pages.
* `options` **{String}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.page({
  name: 'a',
  layout: 'b',
  data: {title: 'page A'},
  content: 'Some content. '
});
```

Load pages onto the cache as normalized pages-objects.
Specify file paths or glob patterns for pages to use with
the current view engine.

If a string or array of file paths or glob patterns is passed,
pages will be read from the file system, parsed into an
object, and stored on the `cache` using the full filepath
of each page as its unique identifier.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.pages('templates/pages/*.hbs');
```

### Partials

Add a partial to `cache.partials`. Partials can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Partial objects are expected to have the following properties:

  - `name` {String} The name of the partial
  - `data` {Object} Context for the partial
  - `content` {String} The actual content of the partial.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.partial({
  name: 'a',
  layout: 'b',
  data: {title: 'Partial A'},
  content: 'Some content. '
});
```

Load partials onto the cache as normalized partials-objects.
Specify file paths or glob patterns for partials to use with
the current view engine.

If a string or array of file paths or glob patterns is passed,
partials will be read from the file system, parsed into an
object, and stored on the `cache` using the full filepath
of each partial as its unique identifier.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.partials('templates/partials/*.hbs');
```

### Layouts

Add a layout to `cache.layouts`. Layouts can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Layout objects are expected to have the following properties:

  - `name` {String} The name of the layout
  - `data` {Object} Context for the layout
  - `content` {String} The actual content of the layout.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.layout({
  name: 'foo',
  data: {title: 'Layout Foo'},
  content: 'Some content. '
});
```

Returns an object with all the parsed layouts by name. Internally uses
the resolved layout filepaths from `options.layouts` to read in and cache
any layouts not already cached.

Use layout options to combine the patterns to make glob patterns for looking
up layouts.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.



 [## helper](lib/assemble.js#L753)

Returns an object with all loaded helpers;

* returns **{Object}**: all the resolved and loaded helpers  


```js
var assemble = require('assemble');
var helpers = require('your-custom-helpers');

assemble
  .registerHelper('foo', require('helper-foo'))
  .registerHelper('a', helpers.a)
  .registerHelper('b', helpers.b)
  .registerHelper('c', helpers.c)

  // or define one inline
  .registerHelper('log', function (value) {
    return console.log(value);
  });
```



 [## helpers](lib/assemble.js#L768)

Returns an object with all loaded helpers;

* returns **{Object}**: all the resolved and loaded helpers  


```js
var assemble = require('assemble');
var helpers = require('your-custom-helpers');

assemble
  .registerHelper('foo', require('helper-foo'))
  .registerHelper('a', helpers.a)
  .registerHelper('b', helpers.b)
  .registerHelper('c', helpers.c)

  // or define one inline
  .registerHelper('log', function (value) {
    return console.log(value);
  });
```



 [## registerHelper](lib/assemble.js#L802)

Register a helper for the current template engine.

* `key` **{String}**  
* `value` **{Object}**  
* returns **{Object}** `Assemble`: to enable chaining.  

**Example:**

```js
assemble.registerHelper('include', function(filepath) {
  return fs.readFileSync(filepath, 'utf8');
});
```

**Usage:**

```js
assemble.render('<%= include("foo.md") %>');
```


 [## registerHelpers](lib/assemble.js#L828)

Register an array or glob of template helpers.

* `key` **{String}**  
* `value` **{Object}**  
* returns **{Object}** `Assemble`: to enable chaining.  

**Example:**

```js
assemble.registerHelpers('a.js');
// or
assemble.registerHelpers(['a.js', 'b.js']);
// or
assemble.registerHelpers('*.js');
```


 [## parser](lib/assemble.js#L864)

Register a parser `fn` or array of `fns` to be used on each `.src` file. This is used to parse front matter, but can be used for any kind of parsing.

* `file` **{String}**: The file object  
* `options` **{Object}**: Options to pass to parser.  
* `fn` **{Function|Array}**: The parsing function or array of functions.  
* returns **{Object}** `Assemble`: to enable chaining.  

By default, Assemble will parse front matter using
[gray-matter][gray-matter]. For front-matter in particular
it is probably not necessary to register additional parsing
functions, since gray-matter can support almost any format,
but this is cusomizable if necessary or if a non-supported
format is required.

**Example:**

```js
assemble.parser('textile', function (file, enc, options) {
  var str = textile(String(file.contents));
  file.contents = new Buffer(str);
});
```

[gray-matter]: https://github.com/assemble/gray-matter


 [## parsers](lib/assemble.js#L905)

Register an array or glob of parsers for the given `ext`.

* `ext` **{String}**: The extension to associate with the parsers.  
* `patterns` **{String|Array}**: File paths or glob patterns.  
* returns **{Object}** `Assemble`: to enable chaining.  

**Example:**

```js
assemble.parsers('hbs', 'a.js');
// or
assemble.parsers('md' ['a.js', 'b.js']);
// or
assemble.parsers('md', '*.js');
```


 [## runParsers](lib/assemble.js#L946)



* `file` **{Object}**  
* `opts` **{Object}**  
* returns: {Object}  Run a file through a parser stack.


 [## engine](lib/assemble.js#L983)

Register the given view engine callback `fn` as `ext`.

* `ext` **{String}**  
* `fn` **{Function|Object}**: or `options`  
* `options` **{Object}**  
* returns **{Object}** `Assemble`: to enable chaining.  

Template engines in Assemble are used to render templates.   following types of `views`:

which are generally pages - but can be any custom template type, 

  - `views`: Such as pages and partials. Views are used when generating web pages. The path of the layout file will be passed to the engine's `.render()` function.
  - `layouts`: Templates used for wrapping pages. The path of the layout file will be passed to the engine's `.render()` function.
  - `content`: Text written in lightweight markup, which optionally has front matter.  Front matter will be removed from the content prior to rendering. `data` from front matter is merged into the context and passed to the options on the engine's `.render()` function.

By default Assemble will `require()` the engine based on the file extension. For example if you try to render a "foo.hbs" file Assemble will invoke the following internally:

```js
var engine = require('engines');
assemble.engine('hbs', engine.handlebars);
```

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
```

Engines are expected to export a `.render()` function or, for compatibility with [Express](http://expressjs.com/), an `__express` function.

For engines that do not provide `.render()` out of the box, you can alternatively map a different file extension to the template engine that you wish to use. For instance, you could map the EJS template engine to `.html` files.

**Example:**

```js
assemble.engine('html', require('ejs').render);
```

Beyond templates, engines can be used to render lightweight markup found in content files, like [markdown](https://help.github.com/articles/markdown-basics) or [textile](http://redcloth.org/textile):

**Example:**

```js
assemble.engine('textile', require('textile-engine'));
```

In this case, it is expected that the module export a `.render()` function which will be passed content data (after removing any front matter).



 [## layoutEngine](lib/assemble.js#L1028)



* `ext` **{String}**  
* `fn` **{Function|Object}**: or `options`  
* `options` **{Object}**  
* returns **{Object}** `Assemble`: to enable chaining.  Register the given layout engine callback `fn` as `ext`.


 [## render](lib/assemble.js#L1094)



* `data` **{Object}**: Data to pass to registered view engines.  
* `options` **{Object}**: Options to pass to registered view engines.  
* returns: {String}  This is Assemble's internal render method, but it's exposed as a public method
so it can be replaced with a custom `render` method.


 [## router](lib/assemble.js#L1167)

**Example:**

* `options` **{Object}**  
* returns: {Function}  

```js
var routes = assemble.router();
routes.route(':basename.hbs', function (file, params, next) {
  // do something with the file
  next();
});

assemble.src('')
  .pipe(routes())
  .pipe(assemble.dest())
```


 [## buffer](lib/assemble.js#L1202)



* `options` **{Object}**: Options to pass to the buffer plugin.  
* returns: {String}  This is Assemble's internal buffer method, but it's exposed as a public method
so it can be replaced with a custom `buffer` method.


 [## highlight](lib/assemble.js#L1230)

Register a function for syntax highlighting.

* `fn` **{Function}**  
* returns **{Object}** `Assemble`: to enable chaining.  

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


 [## watch](lib/assemble.js#L1260)

Rerun the specified task when a file changes.

* `glob` **{String|Array}**: Filepaths or glob patterns.  
* `options` **{String}**  
* `fn` **{Function}**: Task(s) to watch.  
* returns: {String}  

```js
assemble.task('watch', function() {
  assemble.watch('docs/*.md', ['docs']);
});
```

**Params:**

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

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 19, 2014._


[gulp]: https://github.com/wearefractal/gulp
[fractal]: https://github.com/wearefractal
[vinyl]: https://github.com/wearefractal/vinyl
[vinyl-fs]: https://github.com/wearefractal/vinyl-fs
