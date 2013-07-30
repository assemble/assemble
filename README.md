# assemble [![NPM version](https://badge.fury.io/js/assemble.png)](http://badge.fury.io/js/assemble)  [![Build Status](https://travis-ci.org/assemble/assemble.png?branch=master)](https://travis-ci.org/assemble/assemble)

> Visit http://assemble.io. Assemble is a full-featured documentation, site and component generator built on Grunt.js.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install assemble --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble');
```



## Assemble task
_Run this task with the `grunt assemble` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

In your project's Gruntfile, add a section named `assemble` to the data object passed into `grunt.initConfig()`.

```js
assemble: {
  options: {
    assets: 'assets',
    partials: 'docs/includes',
    data: 'docs/data'
  },
  pages: {
    src: ['docs/*.hbs'],
    dest: './'
  }
},
```

See the [Options](http://assemble.io/docs/Options.html) section on the Wiki for more information.

#### [assets](http://assemble.io/docs/options-assets.html)
Type: `String`
Default: `undefined`

Used with the `{{assets}}` variable to resolve the relative path from the _dest file_ to the _assets_ folder.

#### [data](http://assemble.io/docs/options-data.html)
Type: `Object|Array`
Default: `src/data`

Specify the data to supply to your templates. Data may be formatted in `JSON`, `YAML` or [YAML front matter](http://assemble.io/docs/YAML-front-matter.html).

#### [layoutdir](http://assemble.io/docs/options-layoutdir.html)
Type: `String`
Default: `undefined`

The directory to use as the "cwd" for [layouts](http://assemble.io/docs/options-layout.html). When this option is defined, layouts may be defined using only the name of the layout.

#### [layout](http://assemble.io/docs/options-layout.html)
Type: `String`
Default: `undefined`

If set, this defines the layout file to use for the [task or target][tasks-and-targets]. However, when specifying a layout, unlike Jekyll, _Assemble requires a file extension_ since you are not limited to using a single file type.

[tasks-and-targets]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets

#### [partials](http://assemble.io/docs/options-partials.html)
Type:  `Object|Array`
Default: `undefined`

Specifies the Handlebars partials files, or paths to the directories of files to be used.

#### [helpers](http://assemble.io/docs/options-helpers.html)
Type: `Object|Array`
Default: [handlebars-helpers](http://github.com/assemble/handlebars-helpers)

Path to the custom helper or helpers to use with the current template engine.

Assemble includes [handlebars-helpers](http://assemble.io/docs/helpers/index.html) as a dependency, so any helpers from that library may be used in your templates.

#### [engine](http://assemble.io/docs/options-engine.html)
Type: `String`
Default: Handlebars

Specify the engine to use for compiling templates. Handlebars is the default.

#### [ext](http://assemble.io/docs/options-ext.html)
Type: `String`
Default: `.html`

Specify the file extension for destination files. Example:

#### [marked](http://assemble.io/docs/options-marked.html)
Type: `Object`
Default: Marked.js defaults

Specify the options to use when converting from markdown to HTML.


#### flatten
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first "." in the destination path, then append this value. In other words, when files are generated from different source folders this "flattens" them into the same destination directory. See [building the files object dynamically][files-object] for more information on `files` formats.


### Usage examples

Simple example of using data files in both `.json` and `.yml` format to build Handlebars templates.

```javascript
assemble: {
  docs: {
    options: {
      data: 'src/data/**/*.{json,yml}'
    },
    files: {
      'dist/': ['src/templates/**/*.hbs']
    }
  }
}
```



## Release History

 * 2013-06-20   v0.4.0   New option "layoutdir" for defining the directory to be used for layouts. If layoutdir is defined, then layouts may be defined using only the name of the layout.
 * 2013-06-10   v0.3.81   Adding additional ways to load custom helpers. Now it's possible to use a glob pattern that points to a list of scripts with helpers to load. Adding examples and tests on how to use the new custom helper loading methods.
 * 2013-06-01   v0.3.80   Fixing bug with null value in engine
 * 2013-05-07   v0.3.77   Updated README with info about assemble methods
 * 2013-04-28   v0.3.74   Updating the assemble library to use the assemble-utils repo and unnecessary code.
 * 2013-04-21   v0.3.73   Fixing how the relative path helper worked and showing an example in the footer of the layout. This example is hidden, but can be seen by doing view source.
 * 2013-04-20   v0.3.72   Fixing the layout override issue happening in the page yaml headers. Something was missed during refactoring.
 * 2013-04-19   v0.3.9   Adding tags and categories to the root context and ensure that the current page context values don't override the root context values.
 * 2013-04-18   v0.3.8   Updating to use actual assets property from current page.
 * 2013-04-17   v0.3.7   Cleaning up some unused folders and tests
 * 2013-04-16   v0.3.6   Fixed missing assets property.
 * 2013-04-16   v0.3.5   Adding a sections array to the template engine so it can be used in helpers.
 * 2013-04-11   v0.3.4   More tests for helpers and global variables, organized tests. A number of bug fixes.
 * 2013-04-06   v0.3.3   helper-lib properly externalized and wired up. Global variables for filename, ext and pages
 * 2013-03-22   v0.3.22   Merged global and target level options so data and partial files can be joined
 * 2013-03-22   v0.3.21   Valid YAML now allowed in options.data object (along with JSON)
 * 2013-03-18   v0.3.14   new relative helper for resolving relative paths

***

Project authored by [Jon Schlinkert](https://github.com/jonschlinkert/).

_This file was generated on Tue Jul 30 2013 07:15:24._
