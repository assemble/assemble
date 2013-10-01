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
    postprocess: function(src) {
      return require('js-prettify').html(src, {
        indent_size: 2,
        indent_inner_html: true
      }).replace(/(\r\n|\n\r|\n|\r){2,}/g, '\n');
    }
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
    // target options
    options: {
      postprocess: function(src) {
        return require('js-prettify').html(src, {
          indent_size: 2,
          indent_inner_html: true
        }).replace(/(\r\n|\n\r|\n|\r){2,}/g, '\n');
      }
    },
    files: {
      'site/': ['templates/site/*.hbs']
    }
  }
  docs: {
    // these files won't be prettified
    files: {
      'docs/': ['templates/docs/*.hbs']
    }
  }
}
```

### More flexibility

If you want to make the function more reusable, try putting the function outside of `grunt.initConfig`:

```js
module.exports = function(grunt) {

  var prettify = function(src) {
    return require('js-prettify').html(src, {
      indent_size: 2,
      indent_inner_html: true
    }).replace(/(\r\n|\n\r|\n|\r){2,}/g, '\n');
  };

  // Project configuration.
  grunt.initConfig({

    assemble: {
      site: {
        options: {postprocess: prettify},
        files: {
          'site/': ['templates/site/*.hbs']
        }
      },
      docs: {
        files: {
          'docs/': ['templates/docs/*.hbs']
        }
      },
      blog: {
        options: {postprocess: prettify},
        files: {
          'blog/': ['templates/blog/*.hbs']
        }
      }
    }
  });
  ...
};
```
