### Usage Examples

#### Default Options

This example shows the default options ()

``` js
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