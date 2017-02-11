---
title: Getting Started
---

## Installing assemble

To use assemble's CLI, you will first need to install it globally using [npm](https://www.npmjs.com):

```sh
$ npm --global install assemble
```

This adds the `assemble` command to your system path, allowing it to be run from any directory.


### Rendering templates

Render a template _(the default engine is [handlebars][engine-handlebars], but you can use any engine you want)_:

```js
var assemble = require('{%= name %}');
var app = assemble();

// add a "page"  nd render it!
app.page('home.hbs', {content: 'This is \{{title}}'})
  .render({title: 'Home!'}, function(err, view) {
    if (err) throw err;
    console.log(view.content);
    //=> 'This is Home!'
  });
```

### Running tasks

Create an `assemblefile.js` and add tasks to run:

```js
var assemble = require('assemble');
var htmlmin = require('gulp-htmlmin');
var app = assemble();

app.page('a.hbs', {content: '...'});
app.page('b.hbs', {content: '...'});
app.page('c.hbs', {content: '...'});

app.task('default', function() {
  return app.toStream('pages') //<= push "pages" collection into stream
    .pipe(app.renderFile()) //<= render pages with default engine (hbs)
    .pipe(htmlmin()) //<= gulp plugin for minifying html
    .pipe(app.dest('site')); //<= write files to the "./site" directory
});

// expose your instance of assemble to assemble's CLI
module.exports = app;
```

## Built-in Collections

Assemble has a few built-in collections, [pages](), [partials]() and [layouts]().



## Custom collections

Use the `.create()` method to create a custom template collection:

```js
app.create('posts'[, options]);
```

When a new collection is created, the singular and plural forms of the collection name (in this example `posts`) are used to create methods for adding templates (and are automatically exposed on the assemble API).

Continuing with the `posts` collection example, the following methods would be added to assemble for adding templates to that collection:

- `app.post()`
- `app.posts()`




### Collection types

There are three types of built-in collection "types" in assemble:

1. `pages`:
1. `partials`:
1. `layouts`:




## CLI

Run assemble from the command line.

```sh
$ assemble <tasks> [options]
```

### Running tasks

Specify one or more space-separated tasks to run.

**Examples**

Run task `foo`

```sh
$ assemble foo
```

Run tasks `foo` and `bar`

```sh
$ assemble foo bar
```

### Specifying options

Non-task options are prefixed with `--`.

**Examples**

Set the `--cwd` to run an assemblefile.js in a different directory:

```sh
$ assemble --cwd=docs
```

Emit views as they're loaded and log them to `stderr`:

```sh
$ assemble --emit=view
```

See more [command line options]()

### Object expansion

Object-paths may be specified using dot-notation for **either the key or value** in a command line argument.

Additionally, assemble uses [expand-object][] (and some custom parsing) to make it easier to pass non-trivial options and commands via command line. So all of the following formats are possible.

**Examples**

Boolean values:

```sh
$ assemble --foo
# { foo: true }
```

Key-value pairs:

```sh
$ assemble --foo=bar
# { foo: 'bar' }
```

Nested booleans:

```sh
$ assemble --option=foo
# {options: { foo: true }}
```

Nested key-value pairs:

```sh
$ assemble --option=foo:bar
# {options: { foo: 'bar' }}
```

Deeply nested key-value pairs:

```sh
$ assemble --option=foo.bar.baz:qux
# {options: foo: { bar: { baz: 'qux' }}}}
```

Or on the left-side of the `=`:

```sh
$ assemble --option.foo.bar.baz=qux
# {options: foo: { bar: { baz: 'qux' }}}}
```

## Command line options

### cwd

Change the `cwd` for the `assemblefile.js` to run, optionally specifying any tasks to run:

```sh
$ assemble <tasks> --cwd [directory]
```

**Example**

To run the `scaffolds` example in the `examples/` directory, you would enter:

```sh
$ assemble --cwd examples/scaffolds
```

If successful, in the command line, you should see something like this:

<img width="527" alt="screen shot 2016-01-09 at 1 35 52 pm" src="https://cloud.githubusercontent.com/assets/383994/12217685/0a14294e-b6d6-11e5-9e06-dc4738f0e53a.png">

### file

Specify the name of the config file for assemble's CLI to run, the default is `assemblefile.js`.

**Example**

```sh
$ assemble --file assemblefile.dev.js
```
