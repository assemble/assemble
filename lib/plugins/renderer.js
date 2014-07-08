'use strict';

var ms = require('map-stream');
var gutil = require('gulp-util');


module.exports = function rendererPlugin(assemble) {

  return function (engine, data, options) {
    options = options || {};
    data = data || {};

    return ms(function (file, cb) {
      if (file.isNull()) {
        this.push(file);
        return cb();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('Assemble', 'Streaming is not supported with engines.'));
        return cb();
      }

      if (typeof data === 'function') {
        data = data(file);
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
          engine.render(String(file.contents), data, render);
        }
      } catch (err) {
        cb(err);
      }
    });
  };
};
