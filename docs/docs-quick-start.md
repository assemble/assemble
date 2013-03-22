This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

#### with `npm`

```shell
npm install assemble --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble');
```

#### without `npm`

The following quick start alternatives are available:

* [Download the latest release](https://github.com/assemble/assemble/zipball/master).
* Clone the repo: `git clone git://github.com/assemble/assemble.git`.
* Install with Twitter's [Bower](http://twitter.github.com/bower): `bower install assemble`.


### Compile Templates and Run Tests
Before you get started you must first install [the required local dependencies](package.json):

```
$ npm install
```

When completed, you'll be able to run the various `grunt` commands provided:

#### build - `grunt assemble`
Runs the `assemble` task to rebuild the project. 

#### test - `grunt test`
Runs jshint on JavaScripts and mocha unit tests on your templates. 

#### watch - `grunt watch`
This is a convenience method for watching your templates and automatically re-building them whenever you save. Requires the [grunt-contrib-watch](http://github.com/gruntjs/grunt-contrib-watch) Grunt plugin.

Should you encounter problems with installing dependencies or running the `grunt` commands, be sure to first uninstall any previous versions (global and local) you may have installed, and then rerun `npm install`.