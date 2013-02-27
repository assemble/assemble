# [Assemble](http://assemble.io)

> Get the rocks out of your socks.

Assemble helps you _quickly launch static web projects_ by enabling you to rapidly produce highly reusable code. We accomplish this by emphasizing a strong separation of concerns between logic, structure, style, content and configuration.

**Example Grid**

![grid](https://github.com/assemble/assemble/blob/master/examples/advanced/dest/assets/grid.png)

For example, we may wish to build the dynamic grid in the image above using handlebars templates for the structure, like this:

``` html
{{#grid.container}}
<div class="bs-docs-grid">{{#rows}}
  <div class="row show-grid">{{#columns}}
    <div class="span{{width}}"> {{content}} </div>
    {{/columns}}</div>
  {{/rows}}</div>
{{/grid.container}}
```
and then use an external data file, `grid.json`, to configure the grid and provide the content, like this:

``` json
{
  "container": {
    "description": "Basic grid system, with container, rows and columns.",
    "rows": [
      {
        "columns": [
          { "width": 1, "content": "1"},
          { "width": 1, "content": "1"},
          { "width": 1, "content": "1"},
          { "width": 1, "content": "1"},
          { "width": 1, "content": "1"},
          { "width": 1, "content": "1"}
  ...
```

Then run `grunt assemble` to compile the grid to static HTML.



First and foremost, this project just launched so expect frequent changes, and be sure specify an exact version number in `devDependencies` instead of a range, backwards-incompatible changes will be introduced _often_.  If you find this project interesting, please consider starring it to receive updates.

However if you don't find this interesting here is another project you might like: [nodebuildr](nodebuildr).



## Getting Started

_Assemble uses Grunt.js. If you haven't used [grunt][grunt] before, be sure to check out the [Getting Started][Getting Started] guide. Also, Assemble was designed to work with Grunt 0.4.0. If you're still using grunt v0.3.x, you must [upgrade](Upgrading) for Assemble to work._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][packageJSON], install this plugin with the following command:

```shell
npm install assemble --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('assemble');
```

If Assemble has been installed correctly, running `grunt --help` at the command line should list Assemble's task or tasks. In addition, Assemble should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.



## The "assemble" task

### Overview
In your project's Gruntfile, add a section named `assemble` to the data object passed into `grunt.initConfig()`.

``` js
grunt.initConfig({
  assemble: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
});
```

## Run Assemble

_Run assemble with the`grunt assemble` command._


### Task defaults
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


### Options

See [options](assemble-options) for more information.


#### flatten
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first "." in the destination path, then append this value.

#### assets
Type: `String`
Default: `false`

TODO...

Used by the `{{assets}}` template to resolve the relative path to the dest assets folder from the dest file.

Example:

``` js
assemble: {
  options: {
    assets: 'dist/assets'
  },
  files: {
    'dest': ['src/files/*.hbs']
  }
}
```
Example usage:

``` html
<link href="{{assets}}/css/styles.css" rel="stylesheet">
```
Resulting in:

``` html
<link href="dist/assets/css/styles.css" rel="stylesheet">
```


#### data
Type: `String`
Default: `src/data`

Load data for templates and configuration from specified `JSON` and/or `YAML` files.

Example:

``` js
assemble: {
  options: {
    data: ['src/data/*.json', 'config/global.json']
  },
  files: {
    'dest': ['src/files/*.hbs']
  }
}
```
Example `widget.json` data file:

``` json
{
  "name": "Square Widget",
  "modifier": "widget-square"
}

```

Example `widget.hbs` template:

``` html
<div class="widget {{ widget.modifier }}">{{ widget.name }}</div>
```

Compiled result (after running `grunt assemble`):

``` html
<div class="widget widget-square">Square Widget</div>
```

Also see: [YAML front matter] todo...



#### ext
Type: `String`
Default: `.html`

Specify the file extension for destination files.

Example:

``` js
assemble: {
  options: {
    ext: '.xml'
  },
  files: {
    'dest': ['path/to/sitemap.tmpl']
  }
}
```

#### engine
Type: `String`
Default: `handlebars`

TODO...


#### layout
Type: `String`
Default: `false`

TODO...


#### partials
Type: `String`
Default: `false`

TODO...




## Helpers

See docs for [helpers](assemble-helpers).


## Examples

Examples are found here [https://github.com/assemble/assemble/examples](assemble-examples).

To build the examples run `grunt examples`.



## Bug tracker
Have a bug? Please create an issue here on GitHub that conforms with [necolas's guidelines](https://github.com/necolas/issue-guidelines).

[https://github.com/assemble/assemble/issues](assemble-issues)



## Contributing

Please consider contributing! All constructive feedback and contributions are welcome.

  * Please comment your code and submit all pull requests against a development branch.
  * If your pull request contains javascript patches or features, please include relevant unit tests.
  * If you like what we're doing but you prefer using different technologies than we currently offer, we encourage you to make a feature request or submit a pull request for your plugin.


**How you can help**

  * We would like to add more template engines to those listed here https://github.com/assemble/assemble/issues/43
  * Docs, we can always use help creating more documentation
  * Feedback: Use assemble, tell us how to improve, add feature requests.
  * Have an idea? Tell us about it. You can contact us via GitHub issues or preferably via email (found on author's profiles)


## Authors

**Brian Woodward**

+ http://twitter.com/doowb
+ http://github.com/doowb

**Jon Schlinkert**

+ http://twitter.com/jonschlinkert
+ http://github.com/jonschlinkert



## Related Projects

+ [Toolkit](http://toolkit.io): Library of UI components using client-side templates, mock-data, markdown and LESS. Components are also available as compiled HTML/CSS.



## Copyright and license

Copyright 2012 Assemble, Inc.

[MIT License](LICENSE-MIT)


[grunt]: http://gruntjs.com/
[Upgrading]: http://gruntjs.com/upgrading-from-0.3-to-0.4
[Getting Started]: http://gruntjs.com/getting-started
[package.json]: https://npmjs.org/doc/json.html

[assemble-examples]:  https://github.com/assemble/assemble/examples
[assemble-issues]:  https://github.com/assemble/assemble/issues
[assemble-helpers]: https://github.com/assemble/assemble/blob/master/docs/helpers.md
[assemble-options]: https://github.com/assemble/assemble/docs/options.md
[nodebuildr]: http://www.youtube.com/watch?v=NgWn7zbgxZ4
