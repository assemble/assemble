'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var utils = require('../utils');

module.exports = function inspect(/*assemble*/) {
  return function (options) {
    options = options || {};

    return through.obj(function (file, encoding, cb) {
      if (file.isNull()) {
        this.push(file);
        return cb();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-inspect', 'Streaming not supported'));
        return cb();
      }

      // console.log(utils.debug(file));

      this.push(file);
      cb();
    });
  };
};
