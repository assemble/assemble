# [Assemble v0.4.0](http://assemble.io) [![Build Status](https://travis-ci.org/assemble/assemble.png)](https://travis-ci.org/assemble/assemble)

> Assemble makes it dead simple to build modular sites and components from reusable templates and data.

We love contributors, pull requests are welcome and followers are appreciated.

## Examples

Visit the [assemble-examples](http://github.com/assemble/assemble-examples) repo to see a list of example projects, such as:

* [Assemble's own documentation](http://assemble.io)
* [Many ways to work with markdown](https://github.com/assemble/assemble-examples-markdown)
* [assembling a basic site](https://github.com/assemble/assemble-examples-basic)
* [building a readme from templates](https://github.com/assemble/assemble-examples-readme): more useful for large or multi-projects, wikis etc.
* [generating a sitemap](https://github.com/assemble/assemble-examples-sitemap)
* [cheatsheet component](https://github.com/upstage/cheatsheet): created for the new lesscss.org website (coming soon!)



**Table of Contents**

- [Getting started](#getting-started)
- [The "assemble" task](#the-assemble-task)
- [Options](#options)
- [Task Examples](#task-examples)
- [Usage Examples](#usage-examples)
- [Methods](#methods)



## Getting started
> It amazes me how flexible this whole system is, as we can dance around all the issues quite easily. <br>
> — [@Arkkimaagi](https://github.com/Arkkimaagi)

<br>
> Thanks guys, this just goes to show how powerful assemble [is], I was expecting a short "no sorry, not possible",  <br>
> but instead I've got multiple solutions.  <br>
> — [@matt-bailey](https://github.com/matt-bailey)


If you're having trouble getting started, please [create an Issue](https://github.com/assemble/assemble/issues), we're happy to help.


This plugin requires Grunt `~0.4.1`. If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install assemble --save-dev
```

Once the plugin has been installed, it may be enabled inside your [Gruntfile][Getting Started] with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble');
```



## The "assemble" task
In your project's Gruntfile, add a section named `assemble` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  assemble: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
});
grunt.loadNpmTasks('assemble');

grunt.registerTask('default', [
  'jshint',
  'assemble'
]);
```
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


## Options
See the [Options](https://github.com/assemble/assemble/wiki/Options) section on the Wiki for more information.

#### assets
Type: `String`
Default: `undefined`

Used with the `{{assets}}` variable to resolve the relative path from the _dest file_ to the _assets_ folder.

#### data
Type: `Object|Array`
Default: `src/data`

Retrieves data from any specified `JSON` and/or `YAML` files to populate the templates when rendered. Data gets passed through the `data` object to the options on the assemble task, then to the context in your templates. 

Also useful for specifying [configuration][config] data, such as when to render certain templates. For example:

Also see: [YAML front matter][yaml]

#### layout
Type: `String`
Default: `undefined`

If set, this defines the layout file to use for the [task or target][tasks-and-targets]. However, when specifying a layout, unlike Jekyll, _Assemble requires a file extension_ since you are not limited to using a single file type. 

[tasks-and-targets]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets

#### partials
Type:  `Object|Array`
Default: `undefined`

Specifies the Handlebars partials files, or paths to the directories of files to be used. 

#### helpers
Type: `Object|Array`
Default: [helper-lib](http://github.com/assemble/helper-lib)

Path defined to a directory of custom helpers to use with the specified template engine. Assemble currently includes more than **[100+ built-in Handlebars helpers](https://github.com/assemble/helper-lib)**, since Handlebars is the default engine for Assemble.

#### engine
Type: `Object|Array`
Default: [helper-lib](http://github.com/assemble/helper-lib)

Path defined to a directory of custom helpers to use with the specified template engine. Assemble currently includes more than **[100+ built-in Handlebars helpers](https://github.com/assemble/helper-lib)**, since Handlebars is the default engine for Assemble.

#### ext
Type: `String`
Default: `.html`

Specify the file extension for destination files. Example:

More [info about ext][options].

#### flatten
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first "." in the destination path, then append this value. In other words, when files are generated from different source folders this "flattens" them into the same destination directory. See [building the files object dynamically][files-object] for more information on `files` formats.


## Custom "Options Variables"

You can add any custom variables directly to the options block:

```javascript
assemble {
  myProject: {
    options: {
      custom_option1: 'value',
      custom_option2: 'value'
    },
    files: {
      'dest': ['src/templates*.hbs']
    }
  }
}
```
This offers a great deal of flexibility, but it's also something that should be done sparingly because your tasks and targets can get out of hand pretty quickly. 

### Usage Examples

Here are a couple of common use cases for custom options variables:

### development stages

Add custom variables for development stages, such as `dev` and `prod`:

```javascript
assemble {
  myProject: {
    options: {
      dev: true,
      prod: false
    },
    files: {
      'dest': ['src/templates*.hbs']
    }
  }
}
```

Then we can wrap sections in our templates with these contexts to include or exclude content based on truthy or falsy evalution of the `dev` and `prod` variables.

``` hbs
{{#dev}}
  <script src="script.js"></script>
{{/dev}}
{{#prod}}
  <script src="script.min.js"></script>
{{/prod}}
```

#### version consistency

Get or set metadata to/from `package.json`:

``` javascript
pkg: grunt.file.readJSON('package.json'),

assemble {
  myProject: {
    options: {
      version: '<%= pkg.version %>'
    },
    files: {
      'dest': ['src/templates*.hbs']
    }
  }
}
```
Used in our templates like this: `{{version}}`

**NOTE**: It's worth noting that you can accomplish the same end goal by using the `options.data` object instead of creating a custom "options variable". See the [options.data](https://github.com/assemble/assemble/wiki/Options) page in the wiki for more detail.



## [Task Examples](http://github.com/assemble/assemble-examples)
Visit the [assemble-examples](http://github.com/assemble/assemble-examples) repo to see a list of example projects.

#### Compile Handlebars templates

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

#### Generate a markdown README

The example shows how you can use Assemble to generate a markdown formatted readme from Handlebars templates. 

```javascript
assemble: {
  readme: {
    options: {
      flatten: true,
      partials: 'src/content/*.hbs',
      data: 'package.json',
      ext: ''
    },
    src:  'src/templates/README.md.hbs',
    dest: './'
  }
}
```
Visit the [assemble-examples-readme](http://github.com/assemble/assemble-examples-readme) repo to see a working example.


#### Generate `.xml` sitemap

You can generate a sitemap from a static data source, such as `sitemap.json`, or use Assemble's built-in `pages` and `page` variables to automatically generate a sitemap from all pages in a target.

```javascript
assemble: {
  options: {
    flatten: true,
    data: 'src/sitemap.json',
    ext: '.xml'
  },
  component: {
    files: {
      'Sitemap.xml': ['src/sitemap.hbs']
    }
  }
}
```



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Please lint and test your code using Grunt.

## Authors

**Jon Schlinkert**

+ [http://twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)
+ [http://github.com/jonschlinkert](http://github.com/jonschlinkert)

**Brian Woodward**

+ [http://twitter.com/doowb](http://twitter.com/doowb)
+ [http://github.com/doowb](http://github.com/doowb)


## Copyright and license
Copyright 2013 Assemble

[MIT License](LICENSE-MIT)

## Release History
* 2013-06-20			v0.4.0			New option "layoutdir" for defining the directory to be used for layouts. If layoutdir is defined, then layouts may be defined using only the name of the layout.  
* 2013-06-10			v0.3.81			Adding additional ways to load custom helpers. Now it's possible to use a glob pattern that points to a list of scripts with helpers to load.  Adding examples and tests on how to use the new custom helper loading methods.  
* 2013-06-01			v0.3.80			Fixing bug with null value in engine  
* 2013-05-07			v0.3.77			Updated README with info about assemble methods  
* 2013-04-28			v0.3.74			Updating the assemble library to use the assemble-utils repo and unnecessary code.  
* 2013-04-21			v0.3.73			Fixing how the relative path helper worked and showing an example in the footer of the layout. This example is hidden, but can be seen by doing view source.  
* 2013-04-20			v0.3.72			Fixing the layout override issue happening in the page yaml headers. Something was missed during refactoring.  
* 2013-04-19			v0.3.9			Adding tags and categories to the root context and ensure that the current page context values don't override the root context values.  
* 2013-04-18			v0.3.8			Updating to use actual assets property from current page.  
* 2013-04-17			v0.3.7			Cleaning up some unused folders and tests  
* 2013-04-16			v0.3.6			Fixed missing assets property.  
* 2013-04-16			v0.3.5			Adding a sections array to the template engine so it can be used in helpers.  
* 2013-04-11			v0.3.4			More tests for helpers and global variables, organized tests. A number of bug fixes.  
* 2013-04-06			v0.3.3			helper-lib properly externalized and wired up. Global variables for filename, ext and pages  
* 2013-03-22			v0.3.22			Merged global and target level options so data and partial files can be joined  
* 2013-03-22			v0.3.21			Valid YAML now allowed in options.data object (along with JSON)  
* 2013-03-18			v0.3.14			new relative helper for resolving relative paths  



---

_This file was generated using Grunt and [assemble](http://github.com/assemble/assemble) on Sun Jun 23 2013 10:04:02._




[download]: https://github.com/assemble/assemble/zipball/master


[org]: https://github.com/assemble
[assemble]: https://github.com/assemble/assemble
[issues]: https://github.com/assemble/assemble/issues
[wiki]: https://github.com/assemble/assemble/wiki



[config]: https://github.com/assemble/assemble/wiki/Configuration
[gruntfile]: https://github.com/assemble/assemble/wiki/Gruntfile
[tasks]: https://github.com/assemble/assemble/wiki/Task-and-Targets
[options]: https://github.com/assemble/assemble/wiki/Options


[templates]: https://github.com/assemble/assemble/wiki/Templates
[layouts]: https://github.com/assemble/assemble/wiki/Layouts
[pages]: https://github.com/assemble/assemble/wiki/Pages
[partials]: https://github.com/assemble/assemble/wiki/Partials


[content]: https://github.com/assemble/assemble/wiki/Content
[data]: https://github.com/assemble/assemble/wiki/Data
[yaml]: https://github.com/assemble/assemble/wiki/YAML-front-matter
[markdown]: https://github.com/assemble/assemble/wiki/Markdown


[helpers]: https://github.com/assemble/assemble/wiki/Helpers
[assets]: https://github.com/assemble/assemble/wiki/Assets
[collections]: https://github.com/assemble/assemble/wiki/Collections


[examples]: https://github.com/assemble/assemble-examples
[exampleReadme]: https://github.com/assemble/assemble-examples-readme
[exampleBasic]: https://github.com/assemble/assemble-examples-basic
[exampleAdvanced]: https://github.com/assemble/assemble-examples-advanced
[exampleGrid]: https://github.com/assemble/assemble-examples-grid
[exampleTable]: https://github.com/assemble/assemble-examples-table
[exampleForm]: https://github.com/assemble/assemble-examples-form
[exampleSite]: https://github.com/assemble/assemble-examples-site
[exampleSitemap]: https://github.com/assemble/assemble-examples-sitemap


[contribute]: https://github.com/assemble/assemble/wiki/Contributing-to-Assemble
[extend]: https://github.com/assemble/assemble/wiki/Extending-Assemble
[helpers-lib]: https://github.com/assemble/assemble/wiki/Helpers


[grunt]: http://gruntjs.com/
[upgrading]: http://gruntjs.com/upgrading-from-0.3-to-0.4
[getting-started]: http://gruntjs.com/getting-started
[package]: https://npmjs.org/doc/json.html


[assemble]: https://github.com/assemble/assemble
[pre]: https://github.com/assemble/pre
[dry]: https://github.com/assemble/dry
[assemble-github-com]: https://github.com/assemble/assemble.github.com
[assemble-examples-bootstrap]: https://github.com/assemble/assemble-examples-bootstrap
[assemble-internal]: https://github.com/assemble/assemble-internal
[assemble-less]: https://github.com/assemble/assemble-less
[assemble-examples-readme]: https://github.com/assemble/assemble-examples-readme
[grunt-toc]: https://github.com/assemble/grunt-toc
[helper-lib]: https://github.com/assemble/helper-lib
[grunt-dry]: https://github.com/assemble/grunt-dry
[assemble-examples]: https://github.com/assemble/assemble-examples

