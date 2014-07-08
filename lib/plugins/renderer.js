'use strict';

var gutil = require('gulp-util');
var through = require('through2');


module.exports = function rendererPlugin(engine, data, options) {
  options = options || {};
  data = data || {};

  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('Assemble renderer', 'Streaming is not supported with engines.'));
      return cb();
    }

    function render(err, html) {
      if (err) {
        cb(err);
      } else {
        file.contents = new Buffer(html);
        cb(null, file);
      }
    }

    try {
      if (options.filepath) {
        engine(file.path, data, render);
      } else {
        engine(String(file.contents), data, render);
      }
    } catch (err) {
      this.emit('error', new PluginError('Assemble renderer', err));
    }

    this.push(file);
    callback();
  });
};
