## Defaults

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-assemble --save-dev
```



### Options


#### layout
type: `string`, optional
default: `default`


A `layout` can be optionally specified in each `assemble` [target](grunt-target) in your Gruntfile, this specifies the layout file to use. Use the layout file name without file extension. Layout files must be placed in the _layouts directory.

#### date
type: `string`
default:


#### published
type: `boolean`
default: false




``` javascript
assemble {
  options: {
    docs      : true,
    production: false,
    flatten   : true,

    ext       : '.html',
    assets    : 'dist/assets',
    data      : 'src/data/*.json',
    layout    : 'src/templates/layouts/default.mustache',
    partials  : ['src/templates/partials/*.handlebars']
  }
  project: {
    files: {
      'path/to/dest': ['path/to/src/*.mustache'],
    }
  }
}
```




# Layout

Layouts are commonly used with client-side templates as a quick way to "wrap" a number of [pages]() with the same head and footer.




Layouts are optional.


## Configuration

A page can optionally be associated with a layout.

Layouts can be specified in YAML front-matter

Underscore templates can be used in YAML front-matter ayout. Path, file name and extension can be determined



[grunt-target]: (http://github.com/gruntjs/grunt/)