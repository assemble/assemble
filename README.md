# assemble [![NPM version](https://badge.fury.io/js/assemble.png)](http://badge.fury.io/js/assemble)  [![Build Status](https://travis-ci.org/assemble/assemble.png)](https://travis-ci.org/assemble/assemble)

> Visit http://assemble.io. Assemble is a full-featured documentation generator, static site generator and component builder. Created from the ground up as a plugin for Grunt.js.

### [See the live docs →](http://assemble.io)

## Getting Started
Assemble requires Grunt `~0.4.1`

_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install Assemble with the following command:

```bash
npm install assemble --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('assemble');
```

### The "assemble" task
_Run the "assemble" task with the `grunt assemble` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

In your project's Gruntfile, add a section named `assemble` to the data object passed into `grunt.initConfig()`.

```js
assemble: {
  options: {
    assets: 'assets',
    partials: ['docs/includes/**/*.hbs'],
    data: ['docs/data/**/*.{json,yml}']
  },
  pages: {
    src: ['docs/*.hbs'],
    dest: './'
  }
},
```

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## Options
See the documentation for [Options](http://assemble.io/docs/Options.html) for more information.

##### [assets](http://assemble.io/docs/options-assets.html)
Type: `String`
Default: `undefined`

Used with the `{{assets}}` variable to resolve the relative path from the _dest file_ to the _assets_ folder.

##### [data](http://assemble.io/docs/options-data.html)
Type: `String|Array`
Default: `src/data`

Specify the data to supply to your templates. Data may be formatted in `JSON`, `YAML` or [YAML front matter](http://assemble.io/docs/YAML-front-matter.html).

##### [layoutdir](http://assemble.io/docs/options-layoutdir.html)
Type: `String`
Default: `undefined`

The directory to use as the "cwd" for [layouts](http://assemble.io/docs/options-layout.html). When this option is defined, layouts may be defined using only the name of the layout.

##### [layout](http://assemble.io/docs/options-layout.html)
Type: `String`
Default: `undefined`

If set, this defines the layout file to use for the [task or target][tasks-and-targets]. However, when specifying a layout, unlike Jekyll, _Assemble requires a file extension_ since you are not limited to using a single file type.

[tasks-and-targets]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets

##### [partials](http://assemble.io/docs/options-partials.html)
Type:  `String|Array`
Default: `undefined`

Specifies the Handlebars partials files, or paths to the directories of files to be used.

##### [helpers](http://assemble.io/docs/options-helpers.html)
Type: `String|Array`
Default: [handlebars-helpers](http://github.com/assemble/handlebars-helpers)

Path to the custom helper or helpers to use with the current template engine.

Assemble includes [handlebars-helpers](http://assemble.io/docs/helpers/index.html) as a dependency, so any helpers from that library may be used in your templates.

##### postprocess
Type: `Function`
Default: `undefined`

Function to use for post-processing generated HTML. Example:

```js
options: {
  postprocess: function(src) {
    return require('frep').replaceStr(src, [
      {
        // replace "then" with "now"
        pattern: "then",
        replacement: "now"
      },
      {
        // replace "Ruby" with "JavaScript"
        pattern: "Ruby",
        replacement: "JavaScript"
      },
      {
        // replace "Jekyll" with "Assemble"
        pattern: "Jekyll",
        replacement: "Assemble"
      }
    ]);
  }
}
```

##### [ext](http://assemble.io/docs/options-ext.html)
Type: `String`
Default: `.html`

Specify the file extension for destination files. Example:

##### [marked](http://assemble.io/docs/options-marked.html)
Type: `Object`
Default: Marked.js defaults

Specify the [Marked.js options](https://github.com/chjj/marked#options-1) to use when converting from markdown to HTML.

##### [engine](http://assemble.io/docs/options-engine.html)
Type: `String`
Default: `Handlebars` only use this option if you are **not** using Handlebars

Specify the engine to use for compiling templates **if you are not using Handlebars**. Currently, Handlebars is already set by default, but [assemble-swig](https://github.com/assemble/assemble-swig) is available for compiling [Swig Templates](https://github.com/paularmstrong).

##### flatten
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first `.` in the destination path, then append this value. In other words, when files are generated from different source folders this "flattens" them into the same destination directory. See [building the files object dynamically][files-object] for more information on `files` formats.


Visit [Assemble's documentation](http://assemble.io) for more information about options.

## Usage Examples
Simple example of using data files in both `.json` and `.yml` format to build Handlebars templates.

```javascript
assemble: {
  options: {
    data: 'src/data/**/*.{json,yml}'
  },
  docs: {
    files: {
      'dist/': ['src/templates/**/*.hbs']
    }
  }
}
```

#### Using multiple targets

```js
assemble: {
  options: {
    assets: 'assets',
    layoutdir: 'docs/layouts'
    partials: ['docs/includes/**/*.hbs'],
    data: ['docs/data/**/*.{json,yml}']
  },
  site: {
    options: {
      layout: 'default.hbs'
    },
    src: ['templates/site/*.hbs'],
    dest: './'
  },
  blog: {
    options: {
      layout: 'blog-layout.hbs'
    },
    src: ['templates/blog/*.hbs'],
    dest: 'articles/'
  },
  docs: {
    options: {
      layout: 'docs-layout.hbs'
    },
    src: ['templates/docs/*.hbs'],
    dest: 'docs/'
  }
},
```

Visit [Assemble's documentation](http://assemble.io) for many more examples and pointers on getting started.

## Contributing
Please see the [Contributing to Assemble](http://assemble.io/contributing) guide for information on contributing to this project.

## Authors

**Jon Schlinkert**

+ [twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)
+ [github.com/jonschlinkert](http://github.com/jonschlinkert)

**Brian Woodward**

+ [twitter.com/doowb](http://twitter.com/doowb)
+ [github.com/doowb](http://github.com/doowb)


## Release History

 * 2013-09-30   v0.4.8   Assemble now builds 30-50% faster due to some refactoring to async and how context is calculated.
 * 2013-09-20   v0.4.7   Adds grunt-readme to make it easier to keep the readme updated using templates. Keep options.partials intact so they can be used in helpers.
 * 2013-09-15   v0.4.6   Updating how the assets path is calculated. Adding resolve-dep and ability to load helpers from node modules using minimatch patterns
 * 2013-09-03   v0.4.5   Bug fix: allow page content containing $. Add alias metadata for data on pages configuration object.
 * 2013-08-01   v0.4.4   Adds "nested layouts" Adds option for pages in JSON/YAML collections to be defined as either objects or keys in an array.
 * 2013-08-01   v0.4.3   Adds "options.pages" for passing in an array of pages in JSON or YAML format.
 * 2013-06-20   v0.4.0   Adds "layoutdir" option for defining the directory to be used for layouts. If layoutdir is defined, then layouts may be defined using only the name of the layout.
 * 2013-06-10   v0.3.81   Adds additional ways to load custom helpers. Now it's possible to use a glob pattern that points to a list of scripts with helpers to load. Adds examples and tests on how to use the new custom helper loading methods.
 * 2013-06-01   v0.3.80   Fixing bug with null value in engine
 * 2013-05-07   v0.3.77   Updated README with info about assemble methods
 * 2013-04-28   v0.3.74   Updating the assemble library to use the assemble-utils repo and unnecessary code.
 * 2013-04-21   v0.3.73   Fixing how the relative path helper worked and showing an example in the footer of the layout. This example is hidden, but can be seen by doing view source.
 * 2013-04-20   v0.3.72   Fixing the layout override issue happening in the page yaml headers. Something was missed during refactoring.
 * 2013-04-19   v0.3.9   Adds tags and categories to the root context and ensure that the current page context values don't override the root context values.
 * 2013-04-18   v0.3.8   Updating to use actual assets property from current page.
 * 2013-04-17   v0.3.7   Cleaning up some unused folders and tests
 * 2013-04-16   v0.3.6   Fixed missing assets property.
 * 2013-04-16   v0.3.5   Adds a sections array to the template engine so it can be used in helpers.
 * 2013-04-11   v0.3.4   More tests for helpers and global variables, organized tests. A number of bug fixes.
 * 2013-04-06   v0.3.3   helper-lib properly externalized and wired up. Global variables for filename, ext and pages
 * 2013-03-22   v0.3.22   Merged global and target level options so data and partial files can be joined
 * 2013-03-22   v0.3.21   Valid YAML now allowed in options.data object (along with JSON)
 * 2013-03-18   v0.3.14   new relative helper for resolving relative paths

## License
Copyright (c) 2013 Sellside Inc.
Released under the [MIT License](./LICENSE-MIT).

***

_This file was generated on Tuesday, October 1, 2013._
