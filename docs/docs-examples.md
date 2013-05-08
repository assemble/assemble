
#### Compile Handlebars templates

Simple example of using data files in both `.json` and `.yml` format to build Handlebars templates.

```javascript
assemble: {
  docs: {
    options: {
      data: 'src/data/**/*.{json,yml}'
    },
    files: {
      'dist/': ['src/templates/**/*.hbs']
    }
  }
}
```

#### Generate a markdown README

The example shows how you can use Assemble to generate a markdown formatted readme from Handlebars templates. 

```javascript
assemble: {
  readme: {
    options: {
      flatten: true,
      partials: 'src/content/*.hbs',
      data: 'package.json',
      ext: ''
    },
    src:  'src/templates/README.md.hbs',
    dest: './'
  }
}
```
Visit the [assemble-examples-readme](http://github.com/assemble/assemble-examples-readme) repo to see a working example.


#### Generate `.xml` sitemap

You can generate a sitemap from a static data source, such as `sitemap.json`, or use Assemble's built-in `pages` and `page` variables to automatically generate a sitemap from all pages in a target.

```javascript
assemble: {
  options: {
    flatten: true,
    data: 'src/sitemap.json',
    ext: '.xml'
  },
  component: {
    files: {
      'Sitemap.xml': ['src/sitemap.hbs']
    }
  }
}
```
