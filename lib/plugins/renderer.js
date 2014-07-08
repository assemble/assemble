'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function rendererPlugin(assemble) {
  var engine = assemble._engines;

  return function renderer(data, options) {
    options = _.extend({}, assemble._options, options);

    return through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('Assemble renderer', 'Streaming is not supported with engines.'));
        return callback();
      }

      var ext = assemble.set('srcExt', path.extname(file.path));
      data = _.extend({}, assemble.context, data, file.data);
      file.ext = assemble.get('destExt');

      function render(err, str, ext) {
        if (err) {
          callback(err);
        } else {
          file.ext = assemble.set('destExt', ext);
          file.contents = new Buffer(str);
          return file;
        }
      }

      var opts = engine[ext].options;
      console.log(opts);

      try {
        if (options.renderFile) {
          engine[ext].renderFile(file.path, data, options, render);
        } else {
          var str = file.contents.toString(encoding || assemble.get('encoding'));
          engine[ext].render(str, data, options, render);
        }
      } catch (err) {
        this.emit('error', new gutil.PluginError('Assemble renderer', err));
      }

      file.path = gutil.replaceExtension(file.path, file.ext);

      this.push(file);
      callback();
    });
  };
};
