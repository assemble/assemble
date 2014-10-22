/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

// var util = require('util');
// var glob = require('globby');
// var fs = require('vinyl-fs');
// var chalk = require('chalk');
// var arrayify = require('arrayify-compact');
// var debug = require('debug')('assemble');
// var Template = require('template');
// var gutil = require('gulp-util');
// var Router = require('en-route');
// var Layouts = require('layouts');
// var _ = require('lodash');
// var extend = _.extend;

/**
 * Just about all the deps below this line
 * will be externalized into modules.
 */

// Local modules.

// var session = require('./session');
// var Files = require('./view/file');


// Plugins and middleware
// var matter = require('./parsers/front-matter');
// var markdown = require('./parsers/markdown');
// var noopParser = require('./parsers/noop');
// var parsers = require('./plugins/parser');
// var middleware = require('./middleware');
// var buffer = require('./plugins/buffer');
// var routes = require('./plugins/routes');

var extension = require('./extensions');

var defaultExtensions = [
  __dirname + '/extensions/task',
  __dirname + '/extensions/engine',
  __dirname + '/extensions/vinyl-fs',
  __dirname + '/extensions/defaults'
];


/**
 * Create an `assemble` task.
 *
 * ```js
 * var assemble = require('assemble');
 *
 * assemble.task('site', function() {
 *   assemble.src('templates/*.hbs')
 *     .pipe(assemble.dest('_gh_pages'));
 * });
 * ```
 *
 * Optionally initialize a new `Assemble` with the given `context`.
 *
 * ```js
 * var config = new Assemble({foo: 'bar'});
 * ```
 *
 * @class `Assemble`
 * @param {Object} `context`
 * @constructor
 * @api public
 */

var Assemble = function () {
  var args = [].slice.call(arguments);
  Assemble.constructorStack.forEach(function (constructor) {
    constructor.apply(this, args);
  }, this);
};

extension.extend(Assemble);
extension.init(Assemble, defaultExtensions);


/**
 * Expose `Assemble`
 */

module.exports = Assemble;
