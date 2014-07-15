'use strict';

/**
 * Module dependencies.
 */

var utils = require('../utils');
var _ = require('lodash');

module.exports = function pathParser(options) {
  options = _.extend({}, options);
  var fn = options.replace || utils.noop;

  return function (file, encoding, opts) {
    var parsed = utils.parsePath(file.path);

    if (file && parsed) {
      for (var key in parsed) {
        if (parsed.hasOwnProperty(key)) {
          file[key] = parsed[key];
        }
      }
      var src = file.path;
      var dest = fn(file.path);
      file.src = src;
      file.dest = dest;
    }
    return file;
  };
};