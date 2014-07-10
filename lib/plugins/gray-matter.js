'use strict';

var matter = require('gray-matter');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;


module.exports = function (assemble) {
  return function (options) {
    options = options || {};

    return through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new PluginError('assemble-gray-matter', 'Streaming not supported'));
        return callback();
      }
      try {
        var obj = matter(file.contents.toString(), options);
        file.context = obj.data;
        file.contents = new Buffer(obj.content.replace(/^\s*/, ''));
        if (!file.contents.length) {
          this.emit('error', new PluginError('assemble-gray-matter', 'File is empty:', file.path));
          return callback();
        }
        file.original = new Buffer(obj.original);
      } catch (err) {
        this.emit('error', new PluginError('assemble-gray-matter', err));
      }

      this.push(file);
      callback();
    });
  };
};

