# assemble [![NPM version](https://badge.fury.io/js/assemble.svg)](http://badge.fury.io/js/assemble)

> Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.

### Install globally

**Install globally with [npm](npmjs.org)**

```bash
npm i -g assemble@beta
```

### CLI

**Install locally with [npm](npmjs.org)**

```bash
npm i assemble@beta --save
```

## Usage

**Example assemblefile.js**

```js
var assemble = require('assemble');
var extname = require('gulp-extname');
var less = require('gulp-less');

assemble.task('html', function() {
  assemble.src('templates/*.hbs')
    .pipe(extname())
    .pipe(assemble.dest('dist/'));
});

assemble.task('css', function () {
  assemble.src('styles/*.less')
    .pipe(less())
    .pipe(assemble.dest('dist/assets/css'));
});

assemble.task('default', ['html', 'css']);
```

### Example: Templates

Generate HTML from templates. _(Assemble automatically renders handlebars templates, but custom engines and plugins may also be used.)_

```js
var assemble = require('assemble');
var extname = require('gulp-extname');

assemble.task('default', function () {
  assemble.src('templates/*.hbs')
    .pipe(extname())
    .pipe(assemble.dest('dist'));
});
```

Run `assemble` from the command line to run the `default` task in your `assemblefile.js`.


### Example: Pre-process CSS

**Using a plugin**

Use plugins to pre-process CSS (Assemble can run any gulp plugin):

```js
var assemble = require('assemble');
var less = require('gulp-less');

assemble.task('css', function () {
  assemble.src('styles/*.less')
    .pipe(less())
    .pipe(assemble.dest('dist/assets/css'));
});

assemble.task('default', ['css']);
```

**Or, using an engine**

Instead of a plugin you can register an engine, such as [engine-less](https://github.com/jonschlinkert/engine-less).

_(Engines are run automatically on any files that have a file extension matching the name that you used when registering the engine.)_

```js
var assemble = require('assemble');
assemble.engine('less', require('engine-less'));

assemble.task('css', function () {
  assemble.src('styles/*.less')
    .pipe(assemble.dest('dist/assets/css'));
});

assemble.task('default', ['css']);
```


***

# API

<br>

## Templates

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
{{partial "banner"}}
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
{{page "toc"}}
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

### .engine

> Add engines for rendering templates.

```js
// render any files with a `.tmpl` extension using engine-lodash
assemble.engine('tmpl', require('engine-lodash'));

// render any files with a `.less` extension using engine-less
assemble.engine('less', require('engine-less'));
```


### .helper

> Add helpers to be used in templates.

Helpers are passed to the template engine being used at render time. 

**Custom helper**

```js
assemble.helper('read', function(filepath) {
  return fs.readFileSync(filepath, 'utf8');
});
//=> {{read "foo.txt"}}
```

**Register a glob of helpers**

```js
assemble.helpers('helpers/*.js');
```

**Pro tip**

If you want to publish your helpers and share them with the community, make them as generic as possible so they work with any template engine.


# Data

### .data

> Load data to pass to templates.

Any of these work:

```js
assemble.data({foo: 'bar'});
assemble.data('package.json');
assemble.data(['foo/*.{json,yml}']);
```

# Constructor


## Run tests
Install dev dependencies.

```bash
npm i -d && npm test
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
Copyright (c) 2014-2015 Assemble  
Copyright (c) 2014 Fractal <contact@wearefractal.com> (for completions and CLI)
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on March 29, 2015._
