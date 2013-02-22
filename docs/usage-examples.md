### Usage Examples


#### Default Options

This example shows the default options ()

``` js
// Project configuration.
grunt.initConfig({
  assemble: {
    options: {
        assets:   'test/dist/assets',
        data:     'test/src/data/*.json',
        layout:   'test/src/templates/layouts/default.hbs',
        partials: [
          'test/src/templates/partials/*.hbs',
          'test/src/templates/snippets/*.hbs'
        ]
    },
    files: {
      'test/dist': ['test/src/templates/pages/*.hbs']
    }
  }
});
```

#### Custom Options

This example shows how to customize options.

``` js
// Project configuration.
grunt.initConfig({
  assemble: {
    project: {
      options: {
        assets:   '<%= dest.assets %>',
        data:     '<%= src.data %>/*.json',
        layout:   '<%= src.layouts %>/layout.hbs',
        partials: '<%= src.partials %>/*.hbs'
      },
      files: {
        'dest': '<%= src.pages %>/*.hbs',
      }
    }
  }
});
```

#### Wildcards

In this example, `grunt nodeunit:all` (or `grunt nodeunit` because `nodeunit` is a [multi task][]) will test all files ending with `_test.js` in the `test` directory.

```js
// Project configuration.
grunt.initConfig({
  nodeunit: {
    all: ['test/*_test.js']
  }
});
```

With a slight modification, `grunt nodeunit:all` will test files matching the same pattern in the `test` directory _and all subdirectories_.

```js
// Project configuration.
grunt.initConfig({
  nodeunit: {
    all: ['test/**/*_test.js']
  }
});
```