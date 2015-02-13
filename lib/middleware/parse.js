'use strict';

var parser = require('parser-front-matter');

/**
 * Register a middleware for parsing front-matter
 * from the `file.contents` of each file.
 *
 * The parser returns an object with `data` and
 * `content` properties. The `content` property is
 * used to update `file.contents` and the `data`
 * property is added to the `file` object and can
 * be accessed on `file.data`.
 */

module.exports = function (file, next) {
  if (file.data.src.ext === '.hbs' || !file.data.src.ext) {
    parser.parse(file, function(err) {
      if (err) return next(err);
      next();
    });
  }
};
