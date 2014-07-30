'use strict';

var through = require('through2');

/**
 * ## .noop
 *
 * Inspired by gulp-util
 */

module.exports = function () {
  return through.obj();
};
