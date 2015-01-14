# assemble [![NPM version](https://badge.fury.io/js/assemble.svg)](http://badge.fury.io/js/assemble)

> Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.


## Getting started with Assemble v0.6.0

### Install

**Install globally with [npm](npmjs.org)**

```bash
npm i -g assemble
```


### CLI

**Install locally with [npm](npmjs.org)**

```bash
npm i assemble --save
```


**Example assemblefile.js**

```js
var assemble = require('assemble');

assemble.task('default', function() {
  assemble.src('templates/*.hbs')
    .pipe(assemble.dest('dist/'));
});
```
Run `assemble` from the command line to run the `default` task in your `assemblefile.js`.


### API


# Templates

### .partial

> Add partials to be used in other templates.

```js
assemble.partial('notice', { content: '<strong>...</strong>' });
assemble.partial('banner', { content: '/*! Copyright (c) 2014 Jon Schlinkert, Brian Woodward... */' });
// or load a glob of partials
assemble.partials('partials/*.hbs');

// optionally pass locals, all template types support this
assemble.partials('partials/*.hbs', {site: {title: 'Code Project'}});
```

**Usage**

Use the `partial` helper to inject into other templates:

```js
{%= partial("banner") %}
```

Get a cached partial:

```js
var banner = assemble.views.partials['banner'];
```

### .page

> Add pages that might be rendered (really, any template is renderable, pages fit the part though)

```js
assemble.page('toc.hbs', { content: 'Table of Contents...'});
// or load a glob of pages
assemble.pages('pages/*.hbs', {site: {title: 'Code Project'}});
```

Use the `page` helper to inject pages into other templates:

```js
{%= page("toc") %}
```

Get a cached page:

```js
var toc = assemble.views.pages['toc'];
```

Pages are `renderable` templates, so they also have a `.render()` method:

```js
var toc = assemble.views.pages['toc'];
// async
toc.render({}, function(err, content) {
  console.log(content);
});

// or sync
var res = toc.render();
```

**Params**

 - `locals` **{Object}**: Optionally pass locals as the first arg
 - `callback` **{Function}**: If a callback is passed, the template will be rendered async, otherwise sync.


### .layout

> Add layouts, which are used to "wrap" other templates:

```js
assemble.layout('default', {content: [
  '<!DOCTYPE html>',
  '  <html lang="en">',
  '  <head>',
  '    <meta charset="UTF-8">',
  '    <title>{%= title %}</title>',
  '  </head>',
  '  <body>',
  '    {% body %}', // `body` is the insertion point for another template
  '  </body>',
  '</html>'
].join('\n')});

// or load a glob of layouts
assemble.layouts('layouts/*.hbs', {site: {title: 'Code Project'}});
```

Layouts may be use with any other template, including other layouts. Any level of nesting is also possible.

**Body tags**

Layouts use a `body` as the insertion point for other templates. The syntax assemble uses for the `body` tag is:

```js
{% body %}
```

Admittedly, it's a strange syntax, but that's why we're using it. assemble shouldn't collide with templates that you might be using in your documentation.


**Usage**

Layouts can be defined in template locals:

```js
// either of these work (one object or two)
assemble.page('toc.hbs', { content: 'Table of Contents...'}, { layout: 'default' });
assemble.partial('foo.hbs', { content: 'partial stuff', layout: 'block' });
```

Or in the front matter of a template. For example, here is how another layout would use our layout example from earlier:

```js
// using this 'inline' template format to make it easy to see what's happening
// this could be loaded from a file too
assemble.layout('sidebar', {content: [
  '---',
  'layout: default',
  '---',
  '<div>',
  ' {% body %}',
  '</div>'
].join('\n')});
```


### .helper

> Add helpers to be used in templates.

```js
assemble.helper('read', function(filepath) {
  return fs.readFileSync(filepath, 'utf8');
});

//=> {%= read("foo.txt") %}
```

### .engine

> Add engines for rendering templates templates.

```js
assemble.engine('tmpl', require('engine-lodash'));
```


# Data

### .data

> Load data to pass to templates.

Any of these work:

```js
assemble.data({foo: 'bar'});
assemble.data('package.json');
assemble.data(['foo/*.{json,yml}']);
```

# API

### [Assemble](lib/assemble.js#L56)

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

### [.task](lib/assemble.js#L251)

Define an assemble task.

* `name` **{String}**    
* `fn` **{Function}**    

**Example**

```js
assemble.task('default', function() {
  // do stuff
});
```

```js
console.log(assemble.files);
//=>
{ home:
  {
    base: '/site/template/pages/',
    content: '{{ msg }}',
    cwd: '/site',
    data: { msg: 'hello world', src: [Object], dest: [Object] },
    options: {},
    orig: '{{ msg }}',
    path: '/site/template/pages/home.hbs',
    relative: 'home.hbs'
  }
}
```

When using inside a plugin, the stream must be bound to the session via `session.bindEmitter`:

```js
var stream = through.obj( ... );
assemble.session.bindEmitter(stream);
return stream;
```

### [.src](lib/assemble.js#L359)

Glob patterns or filepaths to source files.

* `patterns` **{String|Array|Function}**: Glob patterns, file paths, or renaming function.    
* `options` **{Object}**: Options to pass to source plugins.    

**Example**

```js
assemble.task('site', function() {
  assemble.src('src/*.hbs', {layout: 'default'})
    assemble.dest('dist')
});
```

### [.dest](lib/assemble.js#L388)

Specify a destination for processed files.

* `dest` **{String}**: Destination directory    
* `options` **{Object}**: Options to be passed to `dest` plugins.    

**Example**

```js
assemble.task('sitemap', function() {
  assemble.src('src/*.txt')
    assemble.dest('dist', {ext: '.xml'})
});
```


## Run tests

```bash
npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](git://github.com/assemble/assemble/issues)

## Authors
 
**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 
 
**Brian Woodward**
 
+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb) 


## License
Copyright (c) 2015 Assemble  
Copyright (c) 2014 Fractal <contact@wearefractal.com> (for completions and CLI)
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on January 14, 2015._
