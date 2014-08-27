'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');

module.exports = function noop() {
  return function () {
    return through.obj();
  };
};
