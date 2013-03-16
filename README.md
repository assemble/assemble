# [Assemble v0.3.13](http://github.com/assemble/assemble) [![Build Status](https://travis-ci.org/assemble/assemble.png?branch=readme)](https://travis-ci.org/assemble/assemble)

> Get the rocks out of your socks. Assemble helps you **quickly launch static web projects** by emphasizing a strong separation of concerns between structure, style, content and configuration.

_This project just launched **so expect frequent changes** for the near future, and if you find this project interesting please consider starring it to receive updates. If you have any questions or have any trouble getting Assemble to work, please create an Issue, we'd love to help._

#### [Please visit the wiki](http://github.com/assemble/assemble/wiki) 
**Table of Contents**

- [The "assemble" task](#the-assemble-task)
- [Options](#options)
  - [Task defaults](#task-defaults)
    - [engine](#engine)
    - [helpers](#helpers)
    - [flatten](#flatten)
    - [assets](#assets)
    - [data](#data)
    - [layout](#layout)
    - [partials](#partials)
    - [ext](#ext)
  - [YAML options](#yaml-options)
    - [filename](#filename)
    - [strict](#strict)
    - [schema](#schema)
- [Features](#features)
    - [Markdown](#markdown)
    - ["Include" or import externalized content](#include-or-import-externalized-content)
    - [Write "inline" markdown](#write-inline-markdown)
- [Example Projects](#example-projects)
  - [Build Bootstrap's Grid with JSON or YAML](#build-bootstraps-grid-with-json-or-yaml)
- [About](#about)
- [Bug tracker](#bug-tracker)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#copyright-and-license)






## Quick start
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

#### with `npm`

```shell
npm install assemble --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble');
```

#### without `npm`

The following quick start alternatives are available:

* [Download the latest release](https://github.com/assemble/assemble/zipball/master).
* Clone the repo: `git clone git://github.com/assemble/assemble.git`.
* Install with Twitter's [Bower](http://twitter.github.com/bower): `bower install assemble`.


### Compile Templates and Run Tests
`assemble` provides convenient methods for building and running tests. Before you get started you must first install [the required local dependencies](package.json):

```
$ npm install
```

When completed, you'll be able to run the various `grunt` commands provided:

#### build - `grunt`
Runs the Less.js compiler to rebuild the specified `/test/fixtures/**` files. .

#### test - `grunt test`
Runs jshint on JavaScripts and nodeunit tests on your templates. 

#### watch - `grunt watch`
This is a convenience method for watching your templates and automatically re-building them whenever you save. Requires the [grunt-contrib-watch](http://github.com/gruntjs/grunt-contrib-watch) Grunt plugin.

Should you encounter problems with installing dependencies or running the `grunt` commands, be sure to first uninstall any previous versions (global and local) you may have installed, and then rerun `npm install`.

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


### Task defaults
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


#### engine
Type: `String`
Default: `handlebars`

The engine to use for processing client-side templates. Assemble ships Handlebars as the default template engine, if you are interested in using a different engine visit the documentation to see an up-to-date list of template engines.

Pull requests are welcome for additional template engines. Since we're still working to update the docs, you many also contact [@doowb](http://github.com/doowb) for more information or create an [Issue][assemble-issues].

#### helpers
Type: `String`
Default: `undefined`

Path defined to a directory of helpers to use with the specified template engine.

``` js
assemble: {
  options: {
    helpers: 'assemble-helpers-handlebars'
  },
  ...
}
```

Handlebars, Assemble's default template engine, includes the following built-in helpers: `{{#each}}`, `{{#if}}`, and `{{#unless}}`.

[helper-lib][helper-lib] adds approximately **75 additional helpers**. To include them, follow these instructions:
  * Run: `npm install assemble-helpers-handlebars`
  * Add `assemble-helpers-handlebars` to the `options.helpers` property
  * To learn more visit the [assemble-helpers-handlebars][assemble-helpers-handlebars] repo.
  * See the list of [handlebars helpers][helpers-docs] here.


#### flatten
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first "." in the destination path, then append this value.


#### assets
Type: `String`
Default: `false`

TODO...

Used by the `{{assets}}` template to resolve the relative path to the dest assets folder from the dest file.

Example:

``` js
assemble: {
  options: {
    assets: 'dist/assets'
  },
  ...
}
```
Example usage:

``` html
<link href="{{assets}}/css/styles.css" rel="stylesheet">
```
Resulting in:

``` html
<link href="dist/assets/css/styles.css" rel="stylesheet">
```


#### data
Type: `String`
Default: `src/data`

Load data for templates and [configuration][config] from specified `JSON` and/or `YAML` files.

Example:

``` js
assemble: {
  options: {
    data: ['src/data/*.json', 'config/global.json']
  },
  ...
}
```
Example `widget.json` data file:
``` json
{
  "name": "Square Widget",
  "modifier": "widget-square"
}

```
Example `widget.hbs` template:
``` html
<div class="widget {{ widget.modifier }}">{{ widget.name }}</div>
```

Compiled result after running `grunt assemble`:
``` html
<div class="widget widget-square">Square Widget</div>
```
Also see: [YAML front matter] todo...


#### layout
Type: `String`
Default: `undefined`

Path to the layout to be used.

``` js
assemble: {
  options: {
    layout: 'src/layouts/default.hbs'
  },
  files: {
    'docs': ['src/files/*.hbs']
  }
}
```


#### partials
Type: `String`
Default: `undefined`

Accepts [minimatch](https://github.com/isaacs/minimatch) patterns to define the Handlebars partials files, or paths to the directories of files to be used.

``` js
assemble: {
  options: {
    partials: ['src/partials/*.hbs', 'src/snippets/*.hbs']
  },
  files: {
    'docs': ['src/files/*.hbs']
  }
}
```

#### ext
Type: `String`
Default: `.html`

Specify the file extension for destination files. Example:

``` js
assemble: {

  // Build sitemap from JSON and templates
  sitemap: {
    options: {
      ext: '.xml'
    },
    files: {
      '.': ['path/to/sitemap.tmpl']
    }
  },

  // Build README from YAML and templates
  readme: {
    options: {
      ext: '.md'
    },
    files: {
      '.': ['path/to/readme.tmpl']
    }
  }
}
```


### YAML options
Assemble makes the following options available from `js-yaml`. See [js-yaml](https://github.com/nodeca/js-yaml) for more information.


#### filename
Type: `String`
Default: `null`

String to be used as a file path in error/warning messages.


#### strict
Type: `Boolean`
Default: `false`

Makes the loader to throw errors instead of warnings.


#### schema
Type: `String`
Default: `DEFAULT_SCHEMA`

Specifies a schema to use.



### Custom Options
#### Contexts
A common use case for custom options is to add contexts for `development` and `production` environments:

``` javascript
assemble {
  myProject: {
    options: {
      development: true,
      production: false
    },
    files: {
      'dest': ['src/templates*.hbs']
    }
  }
}
```
In your templates just wrap sections with these contexts to include or exclude content based on current working environment.
``` hbs


```

## Usage Examples

#### Build templates

```javascript
assemble: {
  templates: {
    files: {
      'index.html': ['index.hbs']
    }
  }
}
```

#### Build multiple specified files individually

You can specify multiple `destination: [source]` items in `files`.

```javascript
assemble: {
  gh_pages: {
    files: {
      'docs': ['getting-started.hbs'],
      '.':    ['index.hbs']
    }
  }
}
```

#### Build directory of files

Grunt supports filename expansion (also know as globbing) via the built-in [node-glob][node-glob] and [minimatch][minimatch] libraries. So Templates may be used in filepaths or glob patterns.

```javascript
assemble: {
  project: {
    files: {
      '.': ['templates/*.hbs']
    }
  }
}
```


## Features
Many, many more features are already implemented, and we are documenting them as you read this, so **check back frequently for updates**!!!


### Markdown

> Wouldn't it be awesome if you could just _use markdown however you wanted, wherever you needed it_?

Assemble gives you the flexibility to:

  * **Write entire documents in markdown**, and later compile them to HTML
  * **Keep sections of documents in externalized markdown files**, so they can be imported into other documents
  * **Embed or write "inline" markdown** on-the-fly inside HTML documents


_Read more about markdown features and `options` in the [markdown documentation][markdown]._


#### Include/import external content

Use the markdown expression, `{{md}}`, to enable importing of external markdown content.

**Example #1: using full path**
``` handlebars
{{md ../path/to/content.md}}
```

**Example #2: using variables**
Or use a variable instead of setting the path directly inside the template. For example you can add the content variable to a YAML header:

``` yaml
---
page:
  title: Home
content: ../path/to/content.md
---
```
then use it like this:

``` handlebars
{{md content}}
```

#### Write "inline" markdown
The `{{#markdown}}{{/markdown}}` block expression allows markdown to be written "inline" with any HTML and handlebars content.

Example:

``` handlebars
{{#markdown}}
# Inline Markdown is awesome

> this is markdown content

  * useful for simple content
  * great for blog posts
  * easier on the eyes than angle brackets
  * even links look prettier

### Pretty links
[Visit Assemble](http://github.com/assemble/assemble)

### Even Prettier links
Embed handlebars templates to make them even prettier.
{{#page.links}}
[{{text}}]({{href}})
{{/page.links}}

{{/markdown}}
```


---


## Example Projects
Browse the [examples][assemble-examples] folder to get a better idea of what Assemble can do. To build the examples run `grunt examples`.


### Build Bootstrap's Grid with JSON or YAML
This example shows how to use JSON and handlebars templates to manipulate Bootstrap's grid system. We only have to define the grid one time using templates, then we can updated the grid columns, rows, and even content from a JSON or YAML file.


**Screenshot**
The finished result of the example project looks like this:

[![grid](https://github.com/assemble/assemble/blob/master/examples/advanced/dest/assets/grid.png?raw=true)][exampleGrid]

---

This is what our handlebars grid looks like. **_No really, this is the code for the entire grid!_**:

``` html
{{#grid.container}}
  <div class="container">
  {{#rows}}
    <div class="row">
      {{#columns}}
        <div class="span{{width}}"> {{md content}} </div>
      {{/columns}}
    </div>
  {{/rows}}
  </div>
{{/grid.container}}
```

And then we use an external data file, either `grid.yml` or `grid.json`, to configure the grid and provide the content.

**YAML version**
This is the data for our grid, written in YAML (`grid.yml`):

``` yaml
---
container:
  rows:
  - columns:
    - width: 4
      heading: Overview
      content: <%= content %>/overview.md
    - width: 4
      heading: Getting Started
      content: <%= content %>/getting-started.md
    - width: 4
      heading: Basics
      content: <%= content %>/basics.md
  - columns:
    - width: 6
      heading: Templates
      content: <%= content %>/templates.md
    - width: 6
      heading: Advanced
      content: <%= content %>/advanced.md
...
```

**JSON version**

And the same configuration writtin in JSON (`grid.json`) instead:

``` json
{
  "container": {
    "rows": [
      {
        "columns": [
          {
            "width": 4,
            "heading": "Overview",
            "content": "<%= content %>/overview.md"
          },
          {
            "width": 4,
            "heading": "Getting Started",
            "content": "<%= content %>/getting-started.md"
          },
          {
            "width": 4,
            "heading": "Basics",
            "content": "<%= content %>/basics.md"
          }
        ]
      },
      {
        "columns": [
          {
            "width": 6,
            "heading": "Templates",
            "content": "<%= content %>/templates.md"
          },
          {
            "width": 6,
            "heading": "Advanced",
            "content": "<%= content %>/advanced.md"
          }
        ]
      }
    ]
  }
}
```

If you're satisfied with the default `src` and `dest` paths in the `assemble`, simply run `grunt assemble` to compile the grid to static HTML. Or run `grunt watch` to continuously watch files and automatically re-build when changes occur.



## Contributing
**Contributions are welcome!**. Want to help make Assemble even awesomer? Please consider contributing! All constructive feedback and contributions are welcome.

* Please comment your code and submit all pull requests against a development branch.
* If your pull request contains javascript patches or features, please include relevant unit tests.
* If you like what we're doing but you prefer using different templating libraries than we currently offer, we encourage you to make a feature request or submit a pull request.


### What we need 
We can always use help dwindling down the [Issues](https://github.com/assemble/assemble/issues), but here are other ways you can help:

  * **Documentation**: we can always use help with docs. Creating new docs, filling in missing information, examples, corrections, grammar. You name it, we need it.
  * **Tell us your experience with Assemble**: Use assemble, give us feedback and tell us how to improve, or add feature requests.
  * **Have an idea? Tell us about it.** You can contact us via GitHub issues or via email (found on author's profiles)


## Bug tracker
Have a bug? Please create an issue here on GitHub that conforms with [necolas's guidelines](https://github.com/necolas/issue-guidelines).

[https://github.com/assemble/assemble/issues][assemble-issues]


## Coming Soon!
+ [Upstage](http://github.com/upstage): COMING SOON! We are preparing to launch a library of seriously high quality UI components, each constructed following the same conventions we encourage with Assemble.

 In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using Grunt.


## Authors

**Jon Schlinkert**

+ [http://twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)
+ [http://github.com/jonschlinkert](http://github.com/jonschlinkert)

**Brian Woodward**

+ [http://twitter.com/doowb](http://twitter.com/doowb)
+ [http://github.com/doowb](http://github.com/doowb)

## About

> The goal of Assemble is to offer:

* Conventions for building and maintaining static sites and UI pattern libraries, using HTML, CSS/LESS/SASS, client-side templates and structured data
* Patterns for highly reusable layouts, pages, includes/partials, "snippets" and so on
* Strategies for externalizing metadata, data and content into maintainable formats, such as markdown, JSON, YAML, text, HTML and others
* Ability to use simple JSON or YAML to configure and define the structure of entire projects, static sites or component libraries
* Configurable and extensible enough for programmers, but easy for non-programmers to learn and use.


## Coming Soon!
+ [Upstage](http://github.com/upstage): COMING SOON! We are preparing to launch a library of seriously high quality UI components, each constructed following the same conventions we encourage with Assemble.



## Copyright and license
Copyright 2013 Assemble

[MIT License](LICENSE-MIT)

## Release History

* Stardate "705301.2"    v0.1.0    First commit. 


### Roadmap
* nothing yet.

---

_This file was generated with Grunt and [assemble](http://github.com/assemble/assemble) on Sat Mar 16 2013 16:47:56._






[download]: https://github.com/assemble/assemble/zipball/master


[config]: https://github.com/assemble/assemble/wiki/Configuration
[gruntfile]: https://github.com/assemble/assemble/wiki/Gruntfile
[tasks]: https://github.com/assemble/assemble/wiki/Task-and-Targets
[options]: https://github.com/assemble/assemble/wiki/Options


[templates]: https://github.com/assemble/assemble/wiki/Templates
[layouts]: https://github.com/assemble/assemble/wiki/Layouts
[pages]: https://github.com/assemble/assemble/wiki/Pages
[partials]: https://github.com/assemble/assemble/wiki/Partials
[helpers]: https://github.com/assemble/assemble/wiki/Helpers
[collections]: https://github.com/assemble/assemble/wiki/Collections
[assets]: https://github.com/assemble/assemble/wiki/Assets


[content]: https://github.com/assemble/assemble/wiki/Content
[data]: https://github.com/assemble/assemble/wiki/Data
[markdown]: https://github.com/assemble/assemble/wiki/Markdown


[examples]: https://github.com/assemble/assemble-examples
[exampleSite]: https://github.com/assemble/assemble-examples
[exampleBasic]: https://github.com/assemble/assemble-examples
[exampleAdvanced]: https://github.com/assemble/assemble-examples
[exampleGrid]: https://github.com/assemble/assemble-examples
[exampleTable]: https://github.com/assemble/assemble-examples
[exampleForm]: https://github.com/assemble/assemble-examples


[contribute]: https://github.com/assemble/assemble/wiki/Contributing-to-Assemble
[extend]: https://github.com/assemble/assemble/wiki/Extending-Assemble
[helpers-lib]: https://github.com/assemble/helpers-lib


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
[assemble-styles]: https://github.com/assemble/assemble-styles
[assemble-examples-readme]: https://github.com/assemble/assemble-examples-readme
[grunt-toc]: https://github.com/assemble/grunt-toc
[helper-lib]: https://github.com/assemble/helper-lib
[grunt-dry]: https://github.com/assemble/grunt-dry
[assemble-examples]: https://github.com/assemble/assemble-examples

