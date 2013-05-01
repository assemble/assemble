# [Assemble v0.3.74](http://github.com/assemble/assemble) [![Build Status](https://travis-ci.org/assemble/assemble.png)](https://travis-ci.org/assemble/assemble)

> Assemble makes it dead simple to build modular sites and components from reusable templates and data.

_This project just launched **so expect frequent changes**._ And if you find this project interesting please consider starring it to receive updates

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
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install assemble --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble');
```

When completed, you'll be able to run the various `grunt` commands provided:

#### build - `grunt assemble`
Runs the `assemble` task to rebuild the project. 

#### test - `grunt test`
Runs jshint on JavaScripts and mocha unit tests on your templates.

#### watch - `grunt watch`
Requires [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch), `npm i grunt-contrib-watch`. This is a convenience task for watching files and automatically re-building them whenever you save. Requires the [grunt-contrib-watch](http://github.com/gruntjs/grunt-contrib-watch) Grunt plugin.

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

#### assets
Type: `String` (optional)
Default: `undefined`

Used with the `{{assets}}` variable to resolve the relative path from the _dest file_ to the _assets_ folder.

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
Type: `Object|Array` (optional)
Default: `src/data`

Retrieves data from any specified `JSON` and/or `YAML` files to populate the templates when rendered. Data gets passed through the `data` object to the options on the assemble task, then to the context in your templates. 

Also useful for specifying [configuration][config] data, such as when to render certain templates. For example:

`page.json`
``` json
{
  "production": false
}
```

``` handlebars

<link href="assets/bootstrap.css" rel="stylesheet">

```

_Note that Handlebars.js is the only supported template engine at this time_. If you would like to see another engine added to Assemble, please make a [feature request][issues] (or pull request).

Example:
``` js
assemble: {
  options: {
    data: ['src/data/*.{json,yml,yaml}', 'config/global.json', 'styles/bootstrap.json']
  },
  ...
}
```

Data: `widget.json` (or `widget.yml`)
``` json
{
  "name": "Square Widget",
  "modifier": "widget-square"
}
```

Template: `widget.hbs`
``` html
<div class="widget {{ widget.modifier }}">{{ widget.name }}</div>
```

Compiled result after running `grunt assemble`:
``` html
<div class="widget widget-square">Square Widget</div>
```
Also see: [YAML front matter][yaml] todo...


#### layout
Type: `String` (optional)
Default: `undefined`

If set, this defines the layout file to use for that [target][tasks-and-targets]. Unlike Jekyll, Assemble requires a file extension since you are not limited to using a single file type.

[tasks-and-targets]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets

#### partials
Type:  `Object|Array` (optional)
Default: `undefined`

Specifies the Handlebars partials files, or paths to the directories of files to be used. 

#### engine
Type: `String` (optional)
Default: `handlebars`

The engine to use for processing client-side templates. Assemble ships Handlebars as the default template engine, if you are interested in using a different engine visit the documentation to see an up-to-date list of template engines.

Pull requests are welcome for additional template engines. Since we're still working to update the docs, you many also contact [@doowb](http://github.com/doowb) for more information or create an [Issue][assemble-issues].


#### helpers
Type: `Object|Array` (optional)
Default: [helper-lib](http://github.com/assemble/helper-lib)

Path defined to a directory of custom helpers to use with the specified template engine. Assemble currently includes more than **[100+ built-in Handlebars helpers](https://github.com/assemble/helper-lib)**, since Handlebars is the default engine for Assemble.

``` js
assemble: {
  options: {
    helpers: 'your/custom/helpers'
  },
  ...
}
```

#### ext
Type: `String` (optional)
Default: `.html`

Specify the file extension for destination files. Example:

Learn more about [ext][options]

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

#### flatten
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first "." in the destination path, then append this value. In other words, when they are are generated from different source folders this "flattens" them into the same destination directory. See [building the files object dynamically][files-object] for more information on files formats.

## YAML options

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



## Custom Options
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
{{#development}}
<script src="script.js"></script>
{{/development}}
{{#production}}
<script src="script.min.js"></script>
{{/production}}
```


## Usage Examples

### Markdown

> Wouldn't it be awesome if you could just _use markdown however you wanted, wherever you needed it_?

Assemble gives you the flexibility to:

  * **Write entire documents in markdown**, and later compile them to HTML
  * **Keep sections of documents in externalized markdown files**, so they can be imported into other documents
  * **Embed or write "inline" markdown** on-the-fly inside HTML documents


_Read more about markdown features and `options` in the [markdown documentation][markdown]._


### "Include" extenal content
Use the markdown expression, `{{md}}`, to enable importing of external markdown content.

**Example #1: using full path**
``` handlebars
{{md ../path/to/content.md}}
```

**Example #2: using variables**
Or use a variable instead of setting the path directly inside the template. For example you can add the content variable to the [YAML Front-Matter](https://github.com/assemble/assemble/wiki/YAML-Front-Matter):

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
[Visit Assemble](https://github.com/assemble/assemble)

### Even Prettier links
Embed handlebars templates to make them even prettier.
{{#page.links}}
[{{text}}]({{href}})
{{/page.links}}

{{/markdown}}
```


---

### Task defaults
Task targets, files and options may be specified according to the grunt [Configuring tasks](https://github.com/assemble/assemble/wiki/Task-and-Targets) guide.

#### Build templates

``` javascript
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
Want to help make **assemble** even better? All constructive feedback and contributions are welcome, so please consider contributing!  We can always use help creating, tests, documentation or resolving [Issues](https://github.com/assemble/assemble/issues), but if you have other ideas for how you can help, Brian and I would love to hear them!

[https://github.com/assemble/assemble/issues](http://github.com/assemble/assemble/issues)
 

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
* 2013-04-28    v0.3.74    Updating the assemble library to use the assemble-utils repo and unnecessary code.
* 2013-04-21    v0.3.73    Fixing how the relative path helper worked and showing an example in the footer of the layout. This example is hidden, but can be seen by doing view source.
* 2013-04-20    v0.3.72    Fixing the layout override issue happening in the page yaml headers. Something was missed during refactoring.
* 2013-04-19    v0.3.9    Adding tags and categories to the root context and ensure that the current page context values don't override the root context values.
* 2013-04-18    v0.3.8    Updating to use actual assets property from current page.
* 2013-04-17    v0.3.7    Cleaning up some unused folders and tests
* 2013-04-16    v0.3.6    Fixed missing assets property.
* 2013-04-16    v0.3.5    Adding a sections array to the template engine so it can be used in helpers.
* 2013-04-11    v0.3.4    More tests for helpers and global variables, organized tests. A number of bug fixes.
* 2013-04-06    v0.3.3    helper-lib properly externalized and wired up. Global variables for filename, ext and pages
* 2013-03-22    v0.3.22    Merged global and target level options so data and partial files can be joined
* 2013-03-22    v0.3.21    Valid YAML now allowed in options.data object (along with JSON)
* 2013-03-18    v0.3.14    new relative helper for resolving relative paths
* 2013-03-16    v0.3.13    new dashify and formatPhone helpers
* Stardate 45047.2    v0.1.0    Visited the uninhabited El-Adrel system.Returned home.Started assemble.



---
Authored by [assemble](https://github.com/assemble/assemble)

_This file was generated using Grunt and [assemble](http://github.com/assemble/assemble) on Tue Apr 30 2013 20:02:26._




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

