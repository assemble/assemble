/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Parse the file to put front-matter on `file.data`
 *
 * @param {Object} `assemble` the current assemble instance
 * @api public
 * @name  parse
 */

module.exports = function (assemble) {
  /**
   * Path regex:
   *
   *   0 => full path
   *   1 => dirname
   *   2 => basename (with ext)
   *   3 => name (no ext)
   *   4 => extname
   *   5 => ext (no .)
   */
  return function parse (file, next) {
    var parser = require('parser-front-matter');
    var basename = file.options.params[2];
    var ext = file.options.params[6];

    if (basename && (ext == null || ext == 'hbs')) {
      parser.parse(file, function(err) {
        if (err) return next(err);
        next();
      });
    }
  };
};