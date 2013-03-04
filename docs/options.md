### Options


#### engine
Type: `String`
Default: `handlebars`

The engine to use for processing client-side templates. Assemble ships Handlebars as the default template engine, if you are interested in using a different engine visit the documentation to see an up-to-date list of template engines.

Pull requests are welcome for additional template engines. Since we're still working to update the docs, you many also contact [@doowb](http://github.com/doowb) for more information or create an [Issue][assemble-issues].



#### helpers
Type: `String`
Default: `undefined`

Path defined to a directory of helpers to use with the specified template engine. For convenience you can store paths to helpers in `./config/helpers.json`:

`helpers.json`

``` json
{
  "handlebars": "./some/path/handlebars/helpers",
}
```

Then for each directory of helpers you wish to use, add a corresponding underscore template to the `assemble` task options, like this:
``` js
assemble: {
  options: {
    helpers: '<%= helpers.handlebars %>
  },
  ...
}
```
The Handlebars templating engine includes a few built-in helpers: `{{#each}}`, `{{#if}}`, and `{{#unless}}`. But Assemble's external helper library, [assemble-helpers-handlebars][assemble-helpers-handlebars], includes **70 additional helpers**. To install:
  * Run: `npm install assemble-helpers-handlebars`
  * Then add `assemble-helpers-handlebars` to the `options.helpers` property (as in the example above)
  * To learn more visit the [assemble-helpers-handlebars][assemble-helpers-handlebars] repo.
  * Visit the [handlebars helpers documentation][helpers-docs].



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

Specify the file extension to use for destination files. Example:

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

**Examples**

Some example use cases for `ext`

  * `.md` to build commonly used markdown files, such as `README.md` or `CONTRIBUTING.md` from templates
  * `.txt` to build `humans.txt` or `robots.txt` from templates
  * `.xml` to build sitemaps
  * `.css`, `.less` etc. for building stylesheets from templates. (See the [assemble-styles](https://github.com/assemble/assemble-styles) project for an example)



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



