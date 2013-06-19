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

