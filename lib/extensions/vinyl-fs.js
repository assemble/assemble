/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var pipeline = require('stream-splice');
var fs = require('vinyl-fs');
var _ = require('lodash');

var stack = require('../stack');
var utils = require('../utils');

module.exports = function (Assemble) {

  /**
   * Glob patterns or filepaths to source files.
   *
   * **Example**
   *
   * ```js
   * assemble.task('site', function() {
   *   assemble.src('src/*.hbs', {layout: 'default'})
   *     assemble.dest('dist')
   * });
   * ```
   *
   * @param {String|Array|Function} `patterns` Glob patterns, file paths, or renaming function.
   * @param {Object} `options` Options to pass to source plugins.
   * @api public
   */

  Assemble.prototype.src = function (glob, options) {
    options = _.extend({}, this.options, options);

    if(this.enabled('minimal config') || options.minimal) {
      return fs.src(glob, options);
    }

    return pipeline(
      fs.src(glob, options), 
      stack.src.call(this, glob, options) 
    );
  };

  /**
   * Specify a destination for processed files.
   *
   * **Example**
   *
   * ```js
   * assemble.task('sitemap', function() {
   *   assemble.src('src/*.txt')
   *     assemble.dest('dist', {ext: '.xml'})
   * });
   * ```
   * @param {String} `dest` Destination directory
   * @param {Object} `options` Options to be passed to `dest` plugins.
   * @api public
   */

  Assemble.prototype.dest = function (dest, options) {
    var opts = _.extend({}, options);

    if (this.enabled('minimal config') || opts.minimal) {
      return fs.dest(dest, opts);
    }

    return pipeline(
      stack.dest.call(this, dest, options),
      fs.dest(dest, options)
    );
  };

  /**
   * Rerun the specified task when a file changes.
   *
   * ```js
   * assemble.task('watch', function() {
   *   assemble.watch('docs/*.md', ['docs']);
   * });
   * ```
   *
   * @param  {String|Array} `glob` Filepaths or glob patterns.
   * @param  {String} `options`
   * @param  {Function} `fn` Task(s) to watch.
   * @return {String}
   */

  Assemble.prototype.watch = function(glob, options, fn) {
    if (typeof options === 'function' || Array.isArray(options)) {
      fn = options;
      options = null;
    }

    // Tasks to watch
    if (Array.isArray(fn)) {
      return fs.watch(glob, options, function() {
        this.start.apply(this, fn);
      }.bind(this));
    }
    return fs.watch(glob, options, fn);
  };

  /**
   * Copy a `glob` of files to the specified `dest`.
   *
   * **Example**
   *
   * ```js
   * assemble.task('copy-assets', function() {
   *   return assemble.copy('assets/**', 'dist/');
   * });
   * ```
   *
   * @param  {String|Array}    `filepath` Source file path and/or glob patterns.
   * @param  {String|Function} `dest` Destination folder or function for renaming.
   * @param  {Object}          `options` Additional options
   * @return {Stream}          Stream to allow doing additional work.
   */

  Assemble.prototype.copy = function(glob, dest, options) {
    var opts = _.extend({ minimal: true }, options);
    return this.src(glob, opts).pipe(this.dest(dest, opts));
  };
};
