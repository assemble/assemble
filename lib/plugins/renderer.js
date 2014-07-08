'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function rendererPlugin(engine, data, options) {
  options = _.extend({}, options);
  data = _.extend({}, data);

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('Assemble renderer', 'Streaming is not supported with engines.'));
      return callback();
    }

    try {
      file.contents = new Buffer(engine.render(file.contents.toString(encoding || 'utf8'), data, options));
    } catch (err) {
      this.emit('error', new gutil.PluginError('Assemble renderer', err));
    }

    this.push(file);
    callback();
  });
};
