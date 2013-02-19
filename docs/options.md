## Defaults

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-assemble --save-dev
```



#### engine
type: `string`
default: `handlebars`


#### helpers
type: `string`
default: `<%= config.helpers %>`

``` json
{
  "config": {
    "helpers": "./src/js/helpers",
  }
}
```

#### preprocessors
type: `string`
default: `<%= config.preprocessors %>`

`config.json`

``` json
{
  "preprocessors": "./src/js/preprocessors"
}
```

#### ext
type: `string`
default: `.html`

The extension you want to apply to dest files. By default, the file extension is set to `.html`. You can change this to any extension required. Example use cases:

  * `.md` to build commonly used markdown files, such as `README.md` or `CONTRIBUTING.md` from templates
  * `.txt` to build `humans.txt` or `robots.txt` from templates
  * `.xml` to build sitemaps,
  * `.css`, `.less` etc. for building conditional stylesheets. (We use this as a simple "toggle" from the build config to include/exclude experimental styles)


#### assets
type: `string`
default: `<%= build.assets %>`

Location of **destination assets**. By default, the path is set to `./dest/assets` in `.build` configuration file.

``` json
{
  "assets": "./dest/assets"
}
```


#### data
type: `string`
default: `<%= build.data %>`

Location of **source data**. By default, the path is set to `./src/data` in `.build` configuration file.

``` json
{
  "assets": "./dest/assets"
}
```


#### layout
type: `string`, optional
default: `default`


A `layout` can be optionally specified in each `assemble` [target](grunt-target) in your Gruntfile, this specifies the layout file to use. Use the layout file name without file extension. Layout files must be placed in the _layouts directory.


#### partials
type: `string`
default: `default`




``` javascript
assemble {
  options: {
    docs         : true,
    production   : false,

    engine       : 'handlebars',
    helpers      : '<%= config.helpers %>',
    preprocessors: '<%= config.preprocessors %>',
    ext          : '.html',
    assets       : 'dist/assets',
    data         : 'src/data/*.json',
    layout       : 'src/templates/layouts/default.tpl',
    partials     : ['src/templates/partials/*.tpl']
  }
  project: {
    files: {
      'path/to/dest': ['path/to/src/*.tpl'],
    }
  }
}
```


#### Contexts

Add contexts to the options object:


``` javascript
assemble {
  options: {
    docs         : true,
    production   : false,
  }
  project: {
    files: {
      'dest': ['src/*.tpl'],
    }
  }
}
```




Following is a brief exerpt from the Grunt.js wiki, please see [Grunt.js Wiki: Configuring Tasks](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) for more information. Grunt.js offers far more functionality than what we reference here.

### Additional "Native" Grunt Options

Inside a task configuration, an `options` property may be specified to override built-in defaults.  In addition, each target may have an `options` property which is specific to that target.  Target-level options will override task-level options.

The `options` object is optional and may be omitted if not needed.

```js
grunt.initConfig({
  concat: {
    options: {
      // Task-level options may go here, overriding task defaults.
    },
    foo: {
      options: {
        // "foo" target options may go here, overriding task-level options.
      },
    },
    bar: {
      // No options specified; this target will use task-level options.
    },
  },
});
```

#### Building the Files Object Dynamically

When you want to process many individual files, a few additional properties may be used to build a files list dynamically. These properties may be specified in both "Compact" and "Files Array" mapping formats. (from [Grunt.js Wiki: Configuring Tasks](https://github.com/gruntjs/grunt/wiki/Configuring-tasks))

* `expand` Set to `true` to enable the following options:
* `cwd` All `src` matches are relative to (but don't include) this path.
* `src` Pattern(s) to match, relative to the `cwd`.
* `dest` Destination path prefix.
* `ext` Replace any existing extension with this value in generated `dest` paths.
* `flatten` Remove all path parts from generated `dest` paths.
* `rename` This function is called for each matched `src` file, (after extension renaming and flattening). The `dest` and matched `src` path are passed in, and this function must return a new `dest` value.  If the same `dest` is returned more than once, each `src` which used it will be added to an array of sources for it.








[grunt-target]: (http://github.com/gruntjs/grunt/)