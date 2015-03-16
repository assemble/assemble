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
var less = require('gulp-less');

assemble.task('html', function() {
  assemble.src('templates/*.hbs')
    .pipe(assemble.dest('dist/'));
});

assemble.task('css', function () {
  assemble.src('styles/*.less')
    .pipe(less());
    .pipe(assemble.dest('dist/assets/css'));
});

assemble('default', ['html', 'css']);
```

### Example: Templates

Generate HTML from templates. _(Assemble automatically renders handlebars templates. Custom engines and plugins can also be used.)_

```js
var assemble = require('assemble');

assemble.task('default', function () {
  assemble.src('templates/*.hbs')
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
    .pipe(less());
    .pipe(assemble.dest('dist/assets/css'));
});

assemble('default', ['css']);
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

assemble('default', ['css']);
```


***

### API

<br>

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

# Constructor




## Run tests

Install dev dependencies:

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

_This file was generated by [verb](https://github.com/assemble/verb) on February 19, 2015._
[amdefine]: http://github.com/jrburke/amdefine
[ansi]: https://github.com/TooTallNate/ansi.js
[ansi-regex]: https://github.com/sindresorhus/ansi-regex
[ansi-styles]: https://github.com/sindresorhus/ansi-styles
[any]: https://github.com/jonschlinkert/any
[archy]: https://github.com/substack/node-archy
[argparse]: null
[arr-diff]: https://github.com/jonschlinkert/arr-diff
[arr-filter]: https://github.com/jonschlinkert/arr-filter
[arr-flatten]: https://github.com/jonschlinkert/arr-flatten
[arr-map]: https://github.com/jonschlinkert/arr-map
[array-differ]: null
[array-flatten]: https://github.com/blakeembrey/array-flatten
[array-rest]: https://github.com/jonschlinkert/array-rest
[array-slice]: https://github.com/jonschlinkert/array-slice
[array-union]: null
[array-uniq]: null
[arrayify-compact]: https://github.com/jonschlinkert/arrayify-compact
[assemble-utils]: https://github.com/assemble/assemble-utils
[async]: https://github.com/caolan/async
[async-listener]: https://github.com/othiym23/async-listener
[autolinker]: https://github.com/gregjacobs/Autolinker.js
[balanced-match]: https://github.com/juliangruber/balanced-match
[base-file-loader]: https://github.com/jonschlinkert/base-file-loader
[beeper]: https://github.com/sindresorhus/beeper
[benchmark]: http://benchmarkjs.com/
[benchmarked]: https://github.com/jonschlinkert/benchmarked
[bluebird]: https://github.com/petkaantonov/bluebird
[brace-expansion]: https://github.com/juliangruber/brace-expansion
[braces]: https://github.com/jonschlinkert/braces
[camelcase]: https://github.com/sindresorhus/camelcase
[camelcase-keys]: https://github.com/sindresorhus/camelcase-keys
[chalk]: https://github.com/sindresorhus/chalk
[class-extend]: https://github.com/SBoudrias/class-extend
[clone]: https://github.com/pvorb/node-clone
[clone-deep]: https://github.com/jonschlinkert/clone-deep
[computed-property]: https://github.com/doowb/computed-property
[concat-map]: https://github.com/substack/node-concat-map
[config-cache]: https://github.com/jonschlinkert/config-cache
[continuation-local-storage]: https://github.com/othiym23/node-continuation-local-storage
[core-util-is]: https://github.com/isaacs/core-util-is
[dashify]: https://github.com/jonschlinkert/dashify
[dateformat]: https://github.com/felixge/node-dateformat
[debug]: https://github.com/visionmedia/debug
[defaults]: https://github.com/tmpvar/defaults
[delete]: https://github.com/jonschlinkert/delete
[delimiter-regex]: https://github.com/jonschlinkert/delimiter-regex
[delimiters]: https://github.com/jonschlinkert/delimiters
[delims]: https://github.com/jonschlinkert/delims
[duplexer]: https://github.com/Raynos/duplexer
[duplexer2]: https://github.com/deoxxa/duplexer2
[emitter-listener]: https://github.com/othiym23/emitter-listener
[en-route]: https://github.com/jonschlinkert/en-route
[end-of-stream]: https://github.com/mafintosh/end-of-stream
[ends-with]: https://github.com/jonschlinkert/ends-with
[engine-assemble]: https://github.com/doowb/engine-assemble
[engine-cache]: https://github.com/jonschlinkert/engine-cache
[engine-handlebars]: https://github.com/jonschlinkert/engine-handlebars
[engine-lodash]: https://github.com/jonschlinkert/engine-lodash
[engine-utils]: https://github.com/jonschlinkert/engine-utils
[escape-delims]: https://github.com/jonschlinkert/escape-delims
[escape-string-regexp]: https://github.com/sindresorhus/escape-string-regexp
[esprima]: http://esprima.org
[event-stream]: http://github.com/dominictarr/event-stream
[eventemitter2]: https://github.com/hij1nx/EventEmitter2
[expand-brackets]: https://github.com/jonschlinkert/expand-brackets
[expand-range]: https://github.com/jonschlinkert/expand-range
[expander]: https://github.com/tkellen/expander
[export-files]: https://github.com/jonschlinkert/export-files
[ext-map]: https://github.com/jonschlinkert/ext-map
[extend]: https://github.com/justmoon/node-extend
[extend-shallow]: null
[extglob]: https://github.com/jonschlinkert/extglob
[extract-gfm]: https://github.com/jonschlinkert/extract-gfm
[falsey]: https://github.com/jonschlinkert/falsey
[file-reader]: https://github.com/jonschlinkert/file-reader
[filename-regex]: https://github.com/regexps/filename-regex
[fill-range]: https://github.com/jonschlinkert/fill-range
[filter-type]: https://github.com/jonschlinkert/filter-type
[find-index]: https://github.com/jsdf/find-index
[findup-sync]: https://github.com/cowboy/node-findup-sync
[first-chunk-stream]: https://github.com/sindresorhus/first-chunk-stream
[flagged-respawn]: https://github.com/tkellen/node-flagged-respawn
[for-in]: null
[for-own]: null
[from]: https://github.com/dominictarr/from
[fs-utils]: https://github.com/assemble/fs-utils
[gaze]: https://github.com/shama/gaze
[get-first]: https://github.com/jonschlinkert/get-first
[get-stdin]: null
[get-value]: https://github.com/jonschlinkert/get-value
[getobject]: https://github.com/cowboy/node-getobject
[gfm-code-block-regex]: https://github.com/jonschlinkert/gfm-code-block-regex
[gfm-code-blocks]: https://github.com/jonschlinkert/gfm-code-blocks
[glob]: null
[glob-path-regex]: null
[glob-stream]: http://github.com/wearefractal/glob-stream
[glob-watcher]: http://github.com/wearefractal/glob-watcher
[glob2base]: http://github.com/wearefractal/glob2base
[globby]: null
[globule]: https://github.com/cowboy/node-globule
[graceful-fs]: null
[gray-matter]: null
[gulp-drafts]: https://github.com/jonschlinkert/gulp-drafts
[gulp-util]: https://github.com/wearefractal/gulp-util
[handlebars]: http://www.handlebarsjs.com/
[handlebars-helpers]: https://github.com/assemble/handlebars-helpers
[has-ansi]: https://github.com/sindresorhus/has-ansi
[has-any]: https://github.com/jonschlinkert/has-any
[has-any-deep]: https://github.com/jonschlinkert/has-any-deep
[has-value]: null
[helper-cache]: https://github.com/jonschlinkert/helper-cache
[helper-concat]: https://github.com/jonschlinkert/helper-concat
[helper-date]: https://github.com/helpers/helper-date
[helper-glob]: https://github.com/helpers/helper-glob
[helper-markdown]: https://github.com/helpers/helper-markdown
[helper-md]: https://github.com/helpers/helper-md
[highlight\.js]: https://highlightjs.org/
[indent-string]: https://github.com/sindresorhus/indent-string
[inflight]: https://github.com/isaacs/inflight
[inherits]: null
[interpret]: https://github.com/tkellen/node-interpret
[is-absolute]: null
[is-finite]: https://github.com/sindresorhus/is-finite
[is-glob]: null
[is-number]: null
[is-path-cwd]: https://github.com/sindresorhus/is-path-cwd
[is-path-in-cwd]: https://github.com/sindresorhus/is-path-in-cwd
[is-path-inside]: https://github.com/sindresorhus/is-path-inside
[is-plain-object]: https://github.com/jonschlinkert/is-plain-object
[is-primitive]: https://github.com/jonschlinkert/is-primitive
[is-utf8]: https://github.com/wayfind/is-utf8
[isarray]: https://github.com/juliangruber/isarray
[isobject]: null
[js-yaml]: null
[kind-of]: null
[lang-map]: https://github.com/jonschlinkert/lang-map
[language-map]: https://github.com/blakeembrey/language-map
[layout-stack]: https://github.com/doowb/layout-stack
[layouts]: https://github.com/doowb/layouts
[liftoff]: https://github.com/tkellen/node-liftoff
[load-templates]: https://github.com/jonschlinkert/load-templates
[loader-cache]: https://github.com/jonschlinkert/loader-cache
[lodash]: http://lodash.com/
[lodash\._basecopy]: https://lodash.com/
[lodash\._baseslice]: https://lodash.com/
[lodash\._basetostring]: https://lodash.com/
[lodash\._basevalues]: https://lodash.com/
[lodash\._isiterateecall]: https://lodash.com/
[lodash\._reescape]: https://lodash.com/
[lodash\._reevaluate]: https://lodash.com/
[lodash\._reinterpolate]: https://lodash.com/
[lodash\.escape]: https://lodash.com/
[lodash\.isarguments]: https://lodash.com/
[lodash\.isarray]: https://lodash.com/
[lodash\.isnative]: https://lodash.com/
[lodash\.keys]: https://lodash.com/
[lodash\.reescape]: https://lodash.com/
[lodash\.reevaluate]: https://lodash.com/
[lodash\.reinterpolate]: https://lodash.com/
[lodash\.template]: https://lodash.com/
[lodash\.templatesettings]: https://lodash.com/
[logging-helpers]: https://github.com/helpers/logging-helpers
[lru-cache]: https://github.com/isaacs/node-lru-cache
[make-iterator]: null
[map-files]: null
[map-obj]: https://github.com/sindresorhus/map-obj
[map-stream]: http://github.com/dominictarr/map-stream
[meow]: null
[merge-deep]: https://github.com/jonschlinkert/merge-deep
[micromatch]: https://github.com/jonschlinkert/micromatch
[minimatch]: null
[minimist]: null
[mixin-deep]: https://github.com/jonschlinkert/mixin-deep
[mixin-object]: null
[mkdirp]: null
[ms]: https://github.com/guille/ms.js
[multimatch]: https://github.com/sindresorhus/multimatch
[multipipe]: https://github.com/juliangruber/multipipe
[normalize-path]: null
[object-assign]: null
[object-pick]: https://github.com/jonschlinkert/object-pick
[object\.filter]: https://github.com/jonschlinkert/object.filter
[object\.omit]: https://github.com/jonschlinkert/object.omit
[object\.pick]: https://github.com/jonschlinkert/object.pick
[object\.reduce]: https://github.com/jonschlinkert/object.reduce
[omit-empty]: https://github.com/jonschlinkert/omit-empty
[once]: null
[optimist]: https://github.com/substack/node-optimist
[option-cache]: https://github.com/jonschlinkert/option-cache
[orchestrator]: https://github.com/robrich/orchestrator
[ordered-read-streams]: https://github.com/armed/ordered-read-streams
[parse-csv]: https://github.com/jonschlinkert/parse-csv
[parse-filepath]: https://github.com/jonschlinkert/parse-filepath
[parse-glob]: https://github.com/jonschlinkert/parse-glob
[parser-front-matter]: https://github.com/jonschlinkert/parser-front-matter
[path-ends-with]: https://github.com/jonschlinkert/path-ends-with
[path-is-inside]: https://github.com/domenic/path-is-inside
[path-to-regexp]: https://github.com/component/path-to-regexp
[pause-stream]: https://github.com/dominictarr/pause-stream
[pick-from]: https://github.com/jonschlinkert/pick-from
[plasma]: https://github.com/jonschlinkert/plasma
[preserve]: null
[pretty-hrtime]: https://github.com/robrich/pretty-hrtime
[randomatic]: null
[readable-stream]: https://github.com/isaacs/readable-stream
[reduce-object]: https://github.com/jonschlinkert/reduce-object
[regex-cache]: https://github.com/jonschlinkert/regex-cache
[regexp-special-chars]: https://github.com/jonschlinkert/regexp-special-chars
[relative]: null
[relative-dest]: https://github.com/jonschlinkert/relative-dest
[remarkable]: https://github.com/jonschlinkert/remarkable
[repeat-element]: null
[repeat-string]: https://github.com/jonschlinkert/repeat-string
[repeating]: https://github.com/sindresorhus/repeating
[replace-ext]: http://github.com/wearefractal/replace-ext
[resolve]: https://github.com/substack/node-resolve
[rewrite-ext]: https://github.com/jonschlinkert/rewrite-ext
[rimraf]: null
[semver]: https://github.com/isaacs/node-semver
[sequencify]: https://github.com/robrich/sequencify
[session-cache]: https://github.com/doowb/session-cache
[sessionify]: https://github.com/doowb/sessionify
[set-object]: https://github.com/jonschlinkert/set-object
[shimmer]: https://github.com/othiym23/shimmer
[should]: https://github.com/shouldjs/should.js
[should-equal]: https://github.com/shouldjs/equal
[should-format]: https://github.com/shouldjs/format
[should-type]: https://github.com/shouldjs/type
[sigmund]: https://github.com/isaacs/sigmund
[source-map]: https://github.com/mozilla/source-map
[split]: http://github.com/dominictarr/split
[stream-combiner]: https://github.com/dominictarr/stream-combiner
[stream-consume]: https://github.com/aroneous/stream-consume
[string_decoder]: https://github.com/rvagg/string_decoder
[strip-ansi]: https://github.com/sindresorhus/strip-ansi
[strip-bom]: https://github.com/sindresorhus/strip-bom
[supports-color]: https://github.com/sindresorhus/supports-color
[template]: https://github.com/jonschlinkert/template
[template-init]: https://github.com/assemble/template-init
[template-render]: https://github.com/assemble/template-render
[template-utils]: https://github.com/jonschlinkert/template-utils
[through]: http://github.com/dominictarr/through
[through2]: https://github.com/rvagg/through2
[tildify]: https://github.com/sindresorhus/tildify
[to-arg]: https://github.com/jonschlinkert/to-arg
[uglify-js]: http://lisperator.net/uglifyjs
[underscore]: http://underscorejs.org
[underscore\.string]: http://epeli.github.com/underscore.string/
[unique-stream]: https://github.com/eugeneware/unique-stream
[user-home]: https://github.com/sindresorhus/user-home
[utils-merge]: https://github.com/jaredhanson/utils-merge
[vinyl]: null
[vinyl-fs]: http://github.com/wearefractal/vinyl-fs
[wordwrap]: https://github.com/substack/node-wordwrap
[wrappy]: null
[xtend]: https://github.com/Raynos/xtend


