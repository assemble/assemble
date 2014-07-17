/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var calculate = require('calculate-assets');
var _ = require('lodash');


/**
 * ## .assets (assemble)
 *
 * Calculate the path from each `dest` file to `options.assets`.
 *
 * **Example**
 *
 * ```js
 * var assets = require('assemble-middleware-assets');
 *
 * assemble.build('site', function () {
 *   assemble.src('templates/*.hbs')
 *     .use(assets()) // calculate assets path
 *     .dest('dist/');
 * });
 * ```
 *
 * @param {Object} `assemble` the current assemble instance
 * @return undefined
 * @api public
 */

module.exports = function (opts) {
  opts = _.extend({}, {type: 'page'}, opts);

  return function assets () {
    var files = this[opts.type].list;
    var options = this.options();
    var dest = this.dest();

    files.forEach(function (file) {
      options.assets = calculate(dest.filepath, options.assets);
    });
  };
};
