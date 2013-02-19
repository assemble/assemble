# [Assemble](http://assemble.io)

> Get the rocks out of your socks.


First and foremost, this project just launched in early 2013 so expect frequent changes. If you find this project interesting, please consider watching or starring it to show your support.

**Table of Contents**

- [Assemble](#assemble)
  - [Getting Started](#getting-started)
  - [Running Assemble](#running-assemble)
    - [Task defaults](#task-defaults)
    - [Options](#options)
      - [assets](#assets)
      - [data](#data)
      - [engine](#engine)
      - [flatten](#flatten)
      - [layout](#layout)
      - [partials](#partials)
    - [Usage Examples](#usage-examples)
  - [Bug tracker](#bug-tracker)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [Related Projects](#related-projects)
  - [Copyright and license](#copyright-and-license)


**A balance of best practices, convention and configuration**

See some [examples](). todo...

Assemble helps you _quickly launch web projects_ using HTML and CSS components, scaffolds, client-side templates, mock-data, CSS pre-processors, markdown, YAML, JSON, sensible configuration defaults and a Grunt.js build system to make it work.

This project was designed to be more about flexibility and speed, and less about opinion and prescription. So we'll give you some examples, and show you _how to speed up your projects_, but we won't force you to do it our way.



## Getting Started
Assemble uses Grunt.js. If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out Grunt's [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install assemble --save-dev
```

_This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4)._


## Running Assemble
_Run assemble with the`grunt assemble` command._


Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Task defaults
The `assemble` task will build an included boilerplate by default, so you can get up and running quickly. Here are some pointers to get you started on customizing your project:

  * Use Assemble's other boilerplates as examples
  * See some [working example's] of projects using Assemble
  * Read the [wiki](https://github.com/sellside/assemble/wiki)
  * Visit [Toolkit](http://toolkit.io), a more extensive library of UI components and project scaffolds that can be used with Assemble.


### Options

#### assets
Type: `String` `false`
Default: `false`

TODO...


#### data
Type: `String` `false`
Default: `false`

TODO...


#### engine
Type: `String`
Default: `handlebars`

TODO...


#### layout
Type: `String` `false`
Default: `false`

TODO...


#### partials
Type: `String` `false`
Default: `false`

TODO...



### Usage Examples

```js
assemble: {
  project: {
    options: {
      flatten: true,
      assets: "dist/assets",
      data: "src/data/*.json",
      layout: "src/templates/layouts/layout.mustache",
      partials: ["src/templates/partials/*.handlebars"]
    },
    files: {
      "path/to/result.html": "path/to/source.mustache",
      "path/to/another.html": ["path/to/sources/*.mustache", "path/to/more/*.mustache"]
    }
  }
}
```

## Helpers

See docs for [helpers](https://github.com/sellside/assemble/blob/master/docs/helpers.md).



## Bug tracker
Have a bug? Please create an issue here on GitHub that conforms with [necolas's guidelines](https://github.com/necolas/issue-guidelines).

[https://github.com/sellside/assemble/issues](https://github.com/sellside/assemble/issues)



## Contributing

Please consider contributing! All constructive feedback and contributions are welcome.

  * Please comment your code and submit all pull requests against a development branch.
  * If your pull request contains javascript patches or features, please include relevant unit tests.
  * If you like what we're doing but you prefer using different technologies than we currently offer, we encourage you to make a feature request or submit a pull request for your plugin.


**How you can help**

  * We would like to add more template engines to those listed here https://github.com/sellside/assemble/issues/43
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
Learn about other open source projects from the folks at [Sellside](http://www.sellside.com).

+ [Toolkit](http://toolkit.io)
+ [Dry](http://dry.io)
+ [Generate](http://generate.github.com)
+ [Pre](http://pre.io)



## Copyright and license

Copyright 2012 Sellside, Inc.

[MIT License](LICENSE-MIT)