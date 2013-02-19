# Options

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-assemble --save-dev
```



options: {
  flatten: true,
  docs: true,
  production: false,
  assets:    'dist/assets',
  data:      'src/data/*.json',
  layout:    'src/templates/layouts/layout.mustache',
  partials: ['src/templates/partials/*.handlebars']
}





# Layout

Layouts are commonly used with client-side templates as a quick way to "wrap" a number of [pages]() with the same head and footer.




Layouts are optional.


## Configuration

A page can optionally be associated with a layout.

Layouts can be specified in YAML front-matter

Underscore templates can be used in YAML front-matter ayout. Path, file name and extension can be determined
