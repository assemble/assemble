'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var parsePath = require('parse-filepath');
var _ = require('lodash');


/**
 * ## Dest path plugin
 *
 * Assemble plugin to calcuate the destination for each file.
 */

module.exports = function destPathPlugin(dest, options) {
  var assemble = this;
  var opts = _.extend({}, options);

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-dest-path', 'Streaming not supported'));
      return callback();
    }

    try {
      // get the new dest extension based on the engine extension
      var engines = assemble.engines;
      var ext = file.ext || file.src.ext || assemble.get('view engine');
      if (ext && ext[0] !== '.') {
        ext = '.' + ext;
      }
      var engine = engines[ext];
      var destExt = file.ext || file.src.ext || assemble.get('destExt');
      if (engine) {
        destExt = engine.options.destExt || assemble.get('destExt');
      }

      // calculate the new destination path and parse the path
      var newDest = path.join(dest, file.relative);
      newDest = gutil.replaceExtension(newDest, destExt);
      var parsed = parsePath(newDest);

      // update file.dest with the new properties
      file.dest = file.dest || {};
      for (var key in parsed) {
        if (parsed.hasOwnProperty(key)) {
          file.dest[key] = parsed[key];
        }
      }

      file.dest = _.extend(file.dest, {
        path: newDest,
        ext: parsed.extname
      });

      // push the file along
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-dest-path', err));
    }

    return callback();
  });
};