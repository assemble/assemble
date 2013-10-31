# Examples

> Gruntfile configuration examples for the "assemble" task


## Prettify HTML

> Use js-prettify with Assemble's `postprocess` option to format generated HTML

To get started, in the command line run `npm i js-prettify --save-dev` to add js-prettify to your project.

### Prettify all generated HTML

Use the `postprocess` option to prettify output HTML for all targets in the task:

```js
assemble: {
  options: {
    postprocess: require('pretty')
  },
  site: {
    files: {
      'site/': ['templates/site/*.hbs']
    }
  }
}
```

### Prettify a single target

If you only want to format the generated HTML for a specific target, just put use the `postprocess` function in the options for that target:

```js
assemble: {
  options: {
    // task-level options
  },
  site: {
    options: {postprocess: require('pretty')},
    files: {
      'site/': ['templates/site/*.hbs']
    }
  }
}
```

