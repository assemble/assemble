'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var path = require('path');
var utils = require('../utils');

module.exports = function pathParser(options) {
  options = _.extend({}, options);
  var fn = options.replace || utils.noop;

  return function (file) {
    var parsed = utils.parsePath(file.path);

    if (file && parsed) {
      for (var key in parsed) {
        if (parsed.hasOwnProperty(key)) {
          file[key] = parsed[key];
        }
      }

      file.src = file.path;
      file.dest = fn(file.path);
      file.ext = options.ext || path.extname(file.src);
      file.cwd = options.cwd || file.cwd;
    }
    return file;
  };
};