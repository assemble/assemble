# Dynamically updating file paths

> With Assemble v0.6.0, you have a couple of options for dynamically updating file paths. Both share some similarities, but there are also key differences, so pick the one that works for your project.

**Covered in this recipe**

- [overview](#overview)
- [dest plugin](#dest-plugin)
- [dest middleware](#dest-middleware)
- [large projects](#large-projects)

## Synopsis

- we have templates with the file extension `.hbs`
- some templates will be rendered to `.html` files
- some templates will be rendered to `.xml` files
- we need to automatically determine the file extension to use during the build
- to accomplish this, we'll define the file extension in the front-matter of each template

The examples below focus on renaming file extensions, but the solutions work the same way for any kind of path renaming.  If you have a large project and don't think front-matter is a good solution based on the project's size, jump to the notes on [large projects](#large-projects).

**Example template**

Define a destination extension in front matter of a template:

```handlebars
---
ext: '.html'
---
This page should render with .html extension.
```

and another template:

```handlebars
---
ext: '.xml'
---
This page should render with a .xml extension.
```

**file.data**

Note that front-matter defined in templates is merged onto the `file.data` object by Assemble before rendering the templates. In both of the solutions below you can use `console.log(file.data)` to see the data that was define on each file as it streams through.


## dest plugin

The key point of this solution is that the plugin must be added to the pipeline of each task. This gives you the flexibility to decide where you want to use it. 

**create the plugin**

```js
var through = require('through2');
var rewrite = require('rewrite-ext');

// extension plugin
module.exports = function extension(ext) {
  return through.obj(function(file, enc, cb) {
    // re-write file extension
    file.path = rewrite(file.path, file.data.ext || ext);
    // push the file back into the stream
    this.push(file);
    return cb();
  });
};
```

**Add the plugin to task**

In your project's assemblefile.js

```js
var assemble = require('assemble');
var extension = require('./extension');

assemble.task('default', function() {
  assemble.src('templates/*.hbs')
    .pipe(extension('.html'))
    .pipe(assemble.dest('./dist'));
});
```

As a side note, if `extension` doesn't exist on the `file.data` object, rewrite-ext will use the default that's defined in the task, and if not defined in the task it will fall back to the [mapped extension for the file type](https://github.com/jonschlinkert/rewrite-ext#more-examples).


## Dest middleware

The key point of this solution is that it only needs to be defined once, allowing you to use it across all tasks/plugins. You can use any logic you need to filter which files will be transformed, but if the filtering logic gets too complicated it might be better to use a plugin.

**Create the middleware**

```js
var rewrite = require('rewrite-ext');

module.exports = function(file, next) {
  file.path = rewrite(file.path, file.data.ext);
  next();
};
```

**Add the middleware to assemblefile.js**

```js
var assemble = require('assemble');

// the middleware automatically matches files based on the regex
assemble.postRender(/\.html/, require('./extension-middleware'));

assemble.task('foo', function() {
  assemble.src('templates/foo/*.hbs')
    .pipe(assemble.dest('./dist'));
});

assemble.task('bar', function() {
  assemble.src('templates/bar/*.hbs')
    .pipe(assemble.dest('./dist'));
});

assemble.task('default', ['foo', 'bar']);
```

If `extension` doesn't exist on the `file.data` object, rewrite-ext will fall back to the [mapped extension for the file type](https://github.com/jonschlinkert/rewrite-ext#more-examples).

## Large projects

For larger projects, instead of using front matter you can accomplish the same result by adding whatever logic you need to the plugin to filter and dynamically rename files as they come through.

The following example shows middleware, but the same applies to either solution:

```js
var path = require('path');

module.exports = function(file, next) {
  var dir = path.dirname(file.path);
  var ext = path.extname(file.path);

  if (dir.indexOf('foo') !== -1 && ext === 'foo') {
    // do something awesome
  }

  if (dir.indexOf('bar') !== -1 && ext === 'bar') {
    // do something different, but just as awesome
  }
  next();
};
```
