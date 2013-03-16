
#### Compile

```javascript
styles: {
  selectors_test: {
    files: {
      'selectors.css': ['selectors.less']
    }
  }
}
```

#### Concatenate and Compile

As an alternative to using `@import` to "inline" `.less` files, you can specify an array of `src` paths and they will be concatenated. 

```javascript
styles: {
  dist: {
    files: {
      'test.css': ['reset.less', 'test.less']
    }
  }
}
```

#### Compile multiple files individually

You can specify multiple `destination: [source]` items in `files`.

```javascript
styles: {
  dist: {
    files: {
      'test.css': ['test.less'],
      'mixins.css': ['mixins.less']
    }
  }
}
```

#### Custom Options

In this example, the `paths` and `requires` options are used:

```js
styles: {
  development: {
    options: {
      paths: ['test/fixtures'],
      require: [
        'globals/variables.less',
        'globals/mixins.less'
      ]
    },
    files: {
      'styles.css': ['styles.less']
    }
  },
  production: {
    options: {
      paths: ['assets/less'],
      yuicompress: true
    },
    files: {
      'styles.min.css': ['styles.less']
    }
  }
}
```

#### Concatenate and Compile

Grunt supports filename expansion (also know as globbing) via the built-in [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) libraries. So Templates may be used in filepaths or glob patterns.

```
debug: {
  options: {
    paths:   ['<%= less.debug.import %>']
  },
  src:  ['<%= less.test.imports %>', 'test/fixtures/*.less'],
  dest: 'test/result/debug'
}
```
For more on glob pattern syntax, see the [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) documentation.
