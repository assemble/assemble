## Gruntfile

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:


TODO...

```js
assemble: {
  options: {
    assets: "path/to/assets",
    data:   "path/to/config.json"
  },
  project: {
    options: {
      layout: "path/to/default-layout.mustache",
      partials: "path/to/partials/**/*.mustache"
    },
    files: {
      'dest': "path/to/pages/**/*.mustache"
      ]
    }
  }
}
```







#### layout
type: `string`, optional
default: `default`

Location of the default [layout]() to use for the specified files. By default, the path is set to `./src/templates/layouts` in `.build` configuration file.

A `layout` can be optionally specified for each `assemble` [build target](grunt-target) in your Gruntfile. Layout files can be placed in any directory, but file extension is optional if you use the default directory.


``` json
{
  "src": {
    "layout": "./src/templates/layouts"
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