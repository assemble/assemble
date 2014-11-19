/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var extension = require('./extensions');
var defaultExtensions = [
  __dirname + '/extensions/task',
  __dirname + '/extensions/template',
  __dirname + '/extensions/vinyl-fs',
  __dirname + '/extensions/defaults',
  __dirname + '/extensions/highlight'
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
