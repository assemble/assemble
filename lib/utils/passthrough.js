'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');

module.exports = function passthrough() {
  var stream = through.obj();
  stream.setMaxListeners(0);
  return stream;
};