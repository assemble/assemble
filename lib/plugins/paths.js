'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var parsePath = require('parse-filepath');
var rewrite = require('rewrite-ext');
var _ = require('lodash');
var utils = require('../utils');

/**
 * Plugin for calcuating destination paths.
 */

module.exports = function destPath(dest, options) {
  var assemble = this;

  return through.obj(function (file, encoding, cb) {
    var opts = _.extend({}, options);

    try {
      // get the new dest extension based on the engine extension
      var destExt = opts.ext || utils.getDestExt(file, assemble);

      // calculate the new destination path and parse the path
      var actualDest = path.join(dest, file.relative);
      actualDest = rewrite(actualDest, destExt);
      var parsed = parsePath(actualDest);

      // update file.data.dest with the new properties
      file.data.dest = file.data.dest || {};

      for (var key in parsed) {
        if (parsed.hasOwnProperty(key)) {
          file.data.dest[key] = parsed[key];
        }
      }

      file.data.dest = _.extend(file.data.dest, {
        path: actualDest,
        ext: parsed.extname
      });

      file.data.dest.dest = dest;

      // push the file along
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-dest-path', err));
    }

    return cb();
  });
};
