# [Assemble](http://assemble.github.com/assemble)

> Get the rocks out of your socks.

Assemble helps you _quickly launch static web projects_ by emphasizing a strong separation of concerns between structure, style, content and configuration.

_This project just launched **so expect frequent changes** for the near future, and if you find this project interesting please consider starring it to receive updates. If you have any questions or have any trouble getting Assemble to work, please create an Issue, we'd love to help._



**Table of Contents**

- [The "assemble" task](#the-assemble-task)
  - [Run Assemble](#run-assemble)
- [About](#about)
- [Options](#options)
    - [Task defaults](#task-defaults)
    - [engine](#engine)
    - [helpers](#helpers)
    - [flatten](#flatten)
    - [assets](#assets)
    - [data](#data)
    - [ext](#ext)
    - [layout](#layout)
    - [partials](#partials)
  - [YAML options](#yaml-options)
    - [filename](#filename)
    - [strict](#strict)
    - [schema](#schema)
- [Features](#features)
    - [Markdown](#markdown) - NEW documentation
- [Example Projects](#example-projects)
  - [Build Bootstrap's Grid with JSON or YAML](#build-bootstraps-grid-with-json-or-yaml)
- [Bug tracker](#bug-tracker)
- [Contributing](#contributing)
- [Authors](#authors)
- [Related Projects](#related-projects)
- [Copyright and license](#copyright-and-license)



## Getting Started

_You must use Grunt.js version 0.4.0 with Assemble. Please upgrade if you're still using grunt v0.3.x. If you haven't used [grunt][grunt] before, be sure to check out the [Getting Started][Getting Started] guide._

 From the same directory as your project's [Gruntfile][Getting Started] and [package.json][packageJSON], install this plugin with the following command:

``` bash
npm install assemble --save-dev
```

Once that's done, add this line to your project's Gruntfile:

``` js
grunt.loadNpmTasks('assemble');
```

If Assemble has been installed correctly, running `grunt --help` at the command line should list Assemble's task or tasks. In addition, Assemble should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.


## The "assemble" task

In your project's Gruntfile, add a section named `assemble` to the data object passed into `grunt.initConfig()`.

``` js
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
```

#### Run Assemble

_Run assemble with the`grunt assemble` command._


## Options

See [options][assemble-options] for more information.


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

Handlebars, Assemble's default template engine, includes the following built-in helpers: {{#each}}, {{#if}}, and {{#unless}}.

[assemble-helpers-handlebars][assemble-helpers-handlebars] adds approximately **70 additional helpers**. To include them, follow these instructions:
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

Load data for templates and [configuration](https://github.com/assemble/assemble/blob/master/docs/config.md) from specified `JSON` and/or `YAML` files.

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


#### ext
Type: `String`
Default: `.html`

Specify the file extension for destination files. Example:

``` js
assemble: {
  sitemap: {
    options: {
      ext: '.xml'
    },
    files: {
      '.': ['path/to/sitemap.tmpl']
    }
  },
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


---


## Features

> Many, many more features are already implemented, and we are documenting them as you read this, so check back frequently for updates!!!


### Markdown

Wouldn't it be awesome if you could just _use markdown however you wanted, wherever you needed it_? Assemble gives you the flexibility to:

  * **Write entire documents in markdown**, and later compile them to HTML
  * **Keep sections of documents in externalized markdown files**, so they can be imported into other documents
  * **Embed or write "inline" markdown** on-the-fly inside HTML documents


#### "Include" or import externalized content

Use the markdown expression, `{{md}}`, to enable importing of external markdown content.

Example:

``` handlebars
{{md ../path/to/content.md}}
```

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

[![grid](https://github.com/assemble/assemble/blob/master/examples/advanced/dest/assets/grid.png?raw=true)](https://github.com/assemble/assemble/blob/master/examples/advanced/dest/assets/grid.png)

---

This is what our handlebars grid looks like:

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
And then we use an external data file, such as `grid.yml` or `grid.json`, to configure the grid and provide the content, like this:

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

Or the same configuration using `grid.json` instead:

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


## About

This project aims to offer:

* Conventions for building and maintaining static sites and UI pattern libraries, using HTML, CSS/LESS/SASS, client-side templates and structured data
* Patterns for highly reusable layouts, pages, includes/partials, "snippets" and so on
* Strategies for externalizing metadata, data and content into maintainable formats, such as markdown, JSON, YAML, text, HTML and others
* Ability to use simple JSON or YAML to configure and define the structure of entire projects, static sites or component libraries
* Configurable and extensible enough for programmers, but easy for non-programmers to learn and use.



## Bug tracker
Have a bug? Please create an issue here on GitHub that conforms with [necolas's guidelines](https://github.com/necolas/issue-guidelines).

[https://github.com/assemble/assemble/issues][assemble-issues]



## Contributing

Please consider contributing! All constructive feedback and contributions are welcome.

  * Please comment your code and submit all pull requests against a development branch.
  * If your pull request contains javascript patches or features, please include relevant unit tests.
  * If you like what we're doing but you prefer using different technologies than we currently offer, we encourage you to make a feature request or submit a pull request for your plugin.


**How you can help**

  * We would like to add more template engines to those listed here https://github.com/assemble/assemble/issues/43
  * Docs, we can always use help creating more documentation
  * Feedback: Use assemble, tell us how to improve, add feature requests.
  * Have an idea? Tell us about it. You can contact us via GitHub issues or preferably via email (found on author's profiles)


## Authors

**Brian Woodward**

+ http://twitter.com/doowb
+ http://github.com/doowb

**Jon Schlinkert**

+ http://twitter.com/jonschlinkert
+ http://github.com/jonschlinkert



## Related Projects

+ [Toolkit](http://toolkit.io): Library of UI components using client-side templates, mock-data, markdown and LESS. Components are also available as compiled HTML/CSS.



## Copyright and license

Copyright 2012 Assemble, Inc.

[MIT License](LICENSE-MIT)


[grunt]: http://gruntjs.com/
[Upgrading]: http://gruntjs.com/upgrading-from-0.3-to-0.4
[Getting Started]: http://gruntjs.com/getting-started
[package.json]: https://npmjs.org/doc/json.html

[assemble-examples]:  https://github.com/assemble/assemble/tree/master/examples
[assemble-issues]:    https://github.com/assemble/assemble/issues?page=1&state=open
[assemble-options]:   https://github.com/assemble/assemble/blob/master/docs/options.md
[helpers-docs]:       https://github.com/assemble/assemble/blob/master/docs/helpers.md
[assemble-helpers-handlebars]: https://github.com/assemble/assemble-helpers-handlebars
