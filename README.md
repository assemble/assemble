# assemble [![NPM version](https://badge.fury.io/js/assemble.png)](http://badge.fury.io/js/assemble)   [![Build Status](https://travis-ci.org/assemble/assemble.png)](https://travis-ci.org/assemble/assemble) 

> Static site generator for Grunt.js and Yeoman. Assemble makes it dead simple to build modular sites, blogs, gh-pages, components and documentation from reusable templates and data.

### [Visit the website â†’](http://assemble.io)

grunt-assemble provides a declarative wrapper around [Assemble](https://github.com/assemble/assemble).

## Why use Assemble?

1. Most popular site generator for Grunt.js and Yeoman. Assemble is used on hundreds of web projects ranging in size from a single page to 14,000 pages (that we're aware of!). [Let us know if you use Assemble!](https://github.com/assemble/assemble/issues/300).
1. Allows you to carve your HTML up into modular, reusable fragments: partials, includes, sections, snippets... Whatever you prefer to call them, Assemble does that.
1. Optionally use `layouts` to wrap your pages with commonly used elements and content.
1. "Pages" can either be defined as HTML/templates, JSON or YAML, or directly inside the Gruntfile.
1. It's awesome. Lol just kidding. But seriously, Assemble... is... awesome! and it's fun to use.

...and of course, we use Assemble to build the project's own documentation [http://assemble.io](http://assemble.io):

![image](https://f.cloud.github.com/assets/383994/1463257/f031bcfe-4525-11e3-9a03-89a17eee7518.png)

## The "assemble" task

### Getting Started
assemble requires Grunt `~0.4.1`

_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install assemble with the following command:

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
    middleware: ['permalinks'],
    partials: ['includes/**/*.hbs'],
    layout: ['layouts/default.hbs'],
    data: ['data/*.{json,yml}']
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


### Options
See the documentation for [Options](http://assemble.io/docs/Options.html) for more information.

### [assets](http://assemble.io/docs/options-assets.html)
Type: `String`

Default: `undefined`

Used with the `{{assets}}` variable to resolve the relative path from the _dest file_ to the _assets_ folder.

### [data](http://assemble.io/docs/options-data.html)
Type: `String|Array|Object`

Default: `src/data`

Specify the data to supply to your templates. Data may be formatted in `JSON`, `YAML`, [YAML front matter](http://assemble.io/docs/YAML-front-matter.html), or passed directly as an object. Wildcard patterns may also be used.

### [layoutdir](http://assemble.io/docs/options-layoutdir.html)
Type: `String`

Default: `undefined`

The directory to use as the "cwd" for [layouts](http://assemble.io/docs/options-layout.html). When this option is defined, layouts may be defined using only the name of the layout.

### [layout](http://assemble.io/docs/options-layout.html)
Type: `String`

Default: `undefined`

If set, this defines the layout file to use for the [task or target][tasks-and-targets]. However, when specifying a layout, unlike Jekyll, _Assemble requires a file extension_ since you are not limited to using a single file type.

### layoutext
Type: `String`

Default: `undefined`

Specify the extension to use for layouts, enabling layouts in YAML front matter to be defined without an extension:

```yaml
---
layout: default
---
```

[tasks-and-targets]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets

### [partials](http://assemble.io/docs/options-partials.html)
Type:  `String|Array`

Default: `undefined`

Specifies the Handlebars partials files, or paths to the directories of files to be used.

### [middleware](http://assemble.io/middleware/)
Type: `String|Array`

Default: `undefined`

Name of the npm module to use and/or the path(s) to any custom middleware to use. Wildcard patterns may also be used.

See the [docs for middleware](http://assemble.io/middleware/).

### [helpers](http://assemble.io/docs/options-helpers.html)
Type: `String|Array`

Default: [handlebars-helpers](http://github.com/assemble/handlebars-helpers)

Name of the npm module to use and/or the path(s) to any custom helpers to use with the current template engine. Wildcard patterns may also be used.

By default, Assemble includes [handlebars-helpers](http://assemble.io/docs/helpers/index.html) as a dependency, so any helpers from that library are already available to be used in your templates.

See the [docs for helpers](http://assemble.io/helpers/).

### [ext](http://assemble.io/docs/options-ext.html)
Type: `String`

Default: `.html`

Specify the file extension for destination files. Example:

### [marked](http://assemble.io/docs/options-marked.html)
Type: `Object`

Default: [Marked.js defaults](https://github.com/chjj/marked#options-1)

Specify the [Marked.js options](https://github.com/chjj/marked#options-1) for the `{{#markdown}}{{/markdown}}` and `{{md ""}}` helpers to use when converting content.

### [engine](http://assemble.io/docs/options-engine.html)

**PLEASE NOTE: this option is only necessary if you are not using Handlebars!**

Type: `String`

Default: `Handlebars`

Specify the engine to use for compiling templates **if you are not using Handlebars**.

Also see [assemble-swig](https://github.com/assemble/assemble-swig) for compiling [Swig Templates](https://github.com/paularmstrong).

### flatten
Type: `Boolean`

Default: `false`

Remove anything after (and including) the first `.` in the destination path, then append this value. In other words, when files are generated from different source folders this "flattens" them into the same destination directory. See [building the files object dynamically][files-object] for more information on `files` formats.


Visit [Assemble's documentation](http://assemble.io) for more information about options.


### Usage Examples
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
Find a bug? Have a feature request? Please [create an Issue](git://github.com/assemble/assemble/issues).

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality,
and run `docs` in the command line to build the docs with [Verb](https://github.com/assemble/verb).

Pull requests are also encouraged, and if you find this project useful please consider "starring" it to show your support! Thanks!

## Assemble middleware
Here are some related projects you might be interested in from the [Assemble](http://assemble.io) core team.

+ [assemble-middleware-anchors](https://api.github.com/repos/assemble/assemble-middleware-anchors): Assemble middleware for creating anchor tags from generated html. 
+ [assemble-middleware-contextual](https://api.github.com/repos/assemble/assemble-middleware-contextual): Assemble middleware for generating a JSON file containing the context of each page. Basic middleware to help see what's happening in the build. 
+ [assemble-middleware-decompress](https://api.github.com/repos/assemble/assemble-middleware-decompress): Assemble plugin for extracting zip, tar and tar.gz archives.  
+ [assemble-middleware-download](https://api.github.com/repos/assemble/assemble-middleware-download): Assemble middleware for downloading files from GitHub. 
+ [assemble-middleware-drafts](https://api.github.com/repos/assemble/assemble-middleware-drafts): Assemble middleware (v0.5.0) for preventing drafts from being rendered. 
+ [assemble-middleware-i18n](https://api.github.com/repos/assemble/assemble-middleware-i18n): Assemble middleware for adding i18n support to projects. 
+ [assemble-middleware-lunr](https://api.github.com/repos/assemble/assemble-middleware-lunr): Assemble middleware for creating a search engine within your static site using lunr.js. 
+ [assemble-middleware-permalinks](https://api.github.com/repos/assemble/assemble-middleware-permalinks): Permalinks middleware for Assemble, the static site generator for Grunt.js and Yeoman. This plugin enables powerful and configurable URI replacement patterns, presets, uses Moment.js for parsing dates, and much more. 
+ [assemble-middleware-rss](https://api.github.com/repos/assemble/assemble-middleware-rss): Assemble middleware for creating RSS feeds with Assemble. (NOT published yet!) 
+ [assemble-middleware-sitemap](https://api.github.com/repos/assemble/assemble-middleware-sitemap): Assemble middleware for generating sitemaps. 
+ [assemble-middleware-toc](https://api.github.com/repos/assemble/assemble-middleware-toc): Assemble middleware for creating a table of contents in the generated HTML, using Cheerio.js 
+ [assemble-middleware-wordcount](https://api.github.com/repos/assemble/assemble-middleware-wordcount): Assemble middleware for displaying a word-count, and estimated reading time on blog posts or pages.  

Visit [assemble.io/assemble-middleware](http:/assemble.io/assemble-middleware/) for more information about [Assemble](http:/assemble.io/) middleware.


## Authors

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

**Brian Woodward**

+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb)


## License
Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.  
Released under the MIT license

***

_This file was generated by [grunt-verb](https://github.com/assemble/grunt-verb) on May 05, 2014._
