# [assemble v0.3.11](http://github.com/upstage/assemble) [![Build Status](https://travis-ci.org/upstage/assemble.png?branch=master)](https://travis-ci.org/upstage/assemble)

> Get the rocks out of your socks. Assemble helps you _quickly launch static web projects_ by emphasizing a strong separation of concerns between structure, style, content and configuration.

**Table of Contents**

- [Getting Started](#getting-started)
- [The "styles" task](#the-styles-task)
- [Options](#options)
- [Examples](#usage-examples)
- [About](#about)
- [Contributing](#contributing)
- [Authors](#authors)
- [Release History](#release-history)

## Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/upstage/assemble/zipball/master).
* Clone the repo: `git clone git://github.com/upstage/assemble.git`.
* Install with Twitter's [Bower](http://twitter.github.com/bower): `bower install assemble`.


### Compile CSS and Run Tests
`less-tests` provides convenient methods for compiling and running tests on LESS and CSS file. Before getting started, be sure to install [the required local dependencies](package.json):

```
$ npm install
```

When completed, you'll be able to run the various `grunt` commands provided:

#### build - `grunt`
Runs the Less.js compiler to rebuild the specified `/test/fixtures/*.less` files. Requires [Less.js](http://github.com/cloudhead/less.js) and [assemble-styles](http://github.com/assemble/assemble-styles).

#### test - `grunt test`
Runs jshint on JavaScripts and nodeunit tests on CSS file. Yeah, I know, but I'm hoping this will pave the way or inspire a better solution.

#### watch - `grunt watch`
This is a convenience method for watching all Less files and automatically re-building them whenever you save. Requires the [grunt-contrib-watch](http://github.com/gruntjs/grunt-contrib-watch) Grunt plugin.

Should you encounter problems with installing dependencies or running the `grunt` commands, be sure to first uninstall any previous versions (global and local) you may have installed, and then rerun `npm install`.

## Overview
In your project's Gruntfile, the `styles` task is already configured with a number of build `targets`. This is for convenience to show you how to create your own tests:

```js
grunt.initConfig({
  // This is a task
  styles: {
    options: {
      // Task-specific options go here.
    },
    // This is a target
    example: {
      options: {
        // Target-specific options go here.
      },
      files: {
        'dest/files': ['source/files/*.*']
      }
    }
  },
  jshint: {
    ...
  }
});
grunt.loadNpmTasks('styles');

grunt.registerTask('default', [
  'jshint', 
  'styles'
]);
```
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

#### Fixtures
`.less` source files.

TBC...

#### Expected
`.css` files.

TBC...

#### Result
Actual compiled `.css` files.

TBC...


## Options

These options will be passed through directly to [Less.js][]. See the [Less.js documentation](http://github.com/cloudhead/less.js) for a list of supported options.

#### paths
Type: `String|Array`
Default: _Directory of input files_

Specifies directories to scan for `@import` directives when parsing. The default value is the directory of the specified source files. In other words, the `paths` option allows you to specify paths for your @import statements in the [styles](http://github.com/assemble/styles) task, as an alternative to specifying a path on every `@import` statement that appears throughout your LESS files. So instead of doing this:

``` css
@import "path/to/my/less/files/mixins/mixins.less";
```
you can do this:

``` css
@import "mixins.less";
```
#### compress
Type: `Boolean`
Default: _false_

Specifies if we should compress the compiled css by removing some whitespaces.

#### yuicompress
Type: `Boolean`
Default: _false_

Compress output using cssmin.js.

#### optimization
Type: `Integer`
Default: null

Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.

#### strictImports
Type: `Boolean`
Default: _false_

Force evaluation of imports.

#### strictMaths
Type: `Boolean`
Default: _true_

Force operations to be enclosed within parenthesis, `(2 / 6)`.

#### strictUnits
Type: `Boolean`
Default: _true_

Force strict evaluation of units. If set to `false` the compiler will not throw an error with operations such as `(3 * 1em)`. 

#### dumpLineNumbers
Type: `String`
Default: _false_

Configures -sass-debug-info support.

Accepts following values: `comments`, `mediaquery`, `all`.



## Custom Options

#### require
Type: `String|Array`
Default: _empty string_

Specified files will be _prepended_ to the beginning of src files, **_not_** to the concatenated output. This feature is useful for "inlining" globaly-required LESS files, such as `variables` or `mixins`, so that _they do not need to be referenced with `@import` statements inside any individual files_.

#### concat
Type: `Boolean`
Default: _true_

Concatenate all source files by default. If you change the value to false, all source files will compile into individual files.

#### lessrc
Type: `String`
Default value: `null`

If this filename is specified, options defined therein will be used. 

``` javascript
styles: {
  options: grunt.file.readJSON('.lessrc')
}
```
The `.lessrc` file must be valid JSON and looks something like this:

``` json
{
  "require": null,
  "concat": false,
  "compress": false,
  "yuicompress": false,
  "optimization": 3,
  "strictImports": true,
  "dumpLineNumbers": false,
  "strictMaths": false,
  "strictUnits": false
}
```





### Under Consideration

#### globals
Type: `Object`
Default: _null_

Data object for defining global variables inside the Gruntfile which will be accessible in LESS files. Templates can be used to 

---


## Usage Examples

#### Compile

```javascript
styles: {
  selectors_test: {
    files: {
      'selectors.css': ['selectors.less']
    }
  }
}
```

#### Concatenate and Compile

As an alternative to using `@import` to "inline" `.less` files, you can specify an array of `src` paths and they will be concatenated. 

```javascript
styles: {
  dist: {
    files: {
      'test.css': ['reset.less', 'test.less']
    }
  }
}
```

#### Compile multiple files individually

You can specify multiple `destination: [source]` items in `files`.

```javascript
styles: {
  dist: {
    files: {
      'test.css': ['test.less'],
      'mixins.css': ['mixins.less']
    }
  }
}
```

#### Custom Options

In this example, the `paths` and `requires` options are used:

```js
styles: {
  development: {
    options: {
      paths: ['test/fixtures'],
      require: [
        'globals/variables.less',
        'globals/mixins.less'
      ]
    },
    files: {
      'styles.css': ['styles.less']
    }
  },
  production: {
    options: {
      paths: ['assets/less'],
      yuicompress: true
    },
    files: {
      'styles.min.css': ['styles.less']
    }
  }
}
```

#### Concatenate and Compile

Grunt supports filename expansion (also know as globbing) via the built-in [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) libraries. So Templates may be used in filepaths or glob patterns.

```
debug: {
  options: {
    paths:   ['<%= less.debug.import %>']
  },
  src:  ['<%= less.test.imports %>', 'test/fixtures/*.less'],
  dest: 'test/result/debug'
}
```
For more on glob pattern syntax, see the [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) documentation.



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using Grunt.


## Authors
**Jon Schlinkert**

+ [http://twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)
+ [http://github.com/jonschlinkert](http://github.com/jonschlinkert)

**Brian Woodward**

+ [http://twitter.com/doowb](http://twitter.com/doowb)
+ [http://github.com/doowb](http://github.com/doowb)

## About
This project uses the extremely flexible [assemble-styles](http://github.com/assemble/assemble-styles) Grunt plugin for compiling LESS to CSS. The `styles` plugin leverages JSON and underscore for defining any number of LESS "bundles", UI components, compressed stylesheets or themes.

Visit [assemble-styles]() for more information.

## Release History
* Stardate &quot;705301.2&quot;    v0.1.0    First commit. 


### Roadmap
* nothing yet.

---

Authored by [assemble](https://github.com/assemble/assemble)

_This file was generated with Grunt and [assemble](http://github.com/assemble/assemble) on Fri Mar 15 2013 22:05:56._


