/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';
var es = require('event-stream');
var fs = require('vinyl-fs');
var _ = require('lodash');

var props = require('../utils/props');
var stack = require('../stack');
var utils = require('../utils');


module.exports = function (Assemble) {

  /**
   * Glob patterns or filepaths to source files.
   *
   * ```js
   * assemble.src([patterns], [options])
   * ```
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
   * @param {String} `filepath`
   * @api public
   */

  Assemble.prototype.src = function (glob, options) {
    var opts = props.omitGlobProps(this.options);
    options = _.extend({}, opts, options);

    if(this.enabled('minimal config') || options.minimal) {
      return fs.src(glob, options);
    }

    return es.pipe.apply(es, utils.arrayify([
      fs.src(glob, options),
      stack.src.call(this, glob, options)
    ]));
  };


  /**
   * Specify a destination for processed files.
   *
   * ```js
   * assemble.dest([patterns], [opts])
   * ```
   *
   * **Example**
   *
   * ```js
   * assemble.task('sitemap', function() {
   *   assemble.src('src/*.txt')
   *     assemble.dest('dist', {ext: '.xml'})
   * });
   * ```
   * @param {String|Array|Function} `patterns` Glob patterns, file paths, or renaming function.
   * @param {Object} `opts` Options to be passed to `dest` plugins.
   * @api public
   */

  Assemble.prototype.dest = function (dest, options) {
    var opts = _.extend({}, options);

    if (this.enabled('minimal config') || opts.minimal) {
      return fs.dest(dest, opts);
    }

    return es.pipe.apply(es, utils.arrayify([
      stack.dest.call(this, dest, opts),
      fs.dest(dest, opts)
    ]));
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
   * **Params:**
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

};
