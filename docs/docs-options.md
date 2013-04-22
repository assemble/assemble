See the [Options](https://github.com/assemble/assemble/wiki/Options) section on the Wiki for more information.

#### `assets`
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


#### `data`
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


#### `layout`
Type: `String` (optional)
Default: `undefined`

If set, this defines the layout file to use for that [target][tasks-and-targets]. Unlike Jekyll, Assemble requires a file extension since you are not limited to using a single file type.

[tasks-and-targets]: http://gruntjs.com/configuring-tasks#task-configuration-and-targets

#### `partials`
Type:  `Object|Array` (optional)
Default: `undefined`

Specifies the Handlebars partials files, or paths to the directories of files to be used. 

#### `engine`
Type: `String` (optional)
Default: `handlebars`

The engine to use for processing client-side templates. Assemble ships Handlebars as the default template engine, if you are interested in using a different engine visit the documentation to see an up-to-date list of template engines.

Pull requests are welcome for additional template engines. Since we're still working to update the docs, you many also contact [@doowb](http://github.com/doowb) for more information or create an [Issue][assemble-issues].


#### `helpers`
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

#### `ext`
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

#### `flatten`
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first "." in the destination path, then append this value. In other words, when they are are generated from different source folders this "flattens" them into the same destination directory. See [building the files object dynamically][files-object] for more information on files formats.

## YAML options

Assemble makes the following options available from `js-yaml`. See [js-yaml](https://github.com/nodeca/js-yaml) for more information.

#### `filename`
Type: `String`
Default: `null`

String to be used as a file path in error/warning messages.

#### `strict`
Type: `Boolean`
Default: `false`

Makes the loader to throw errors instead of warnings.

#### `schema`
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
