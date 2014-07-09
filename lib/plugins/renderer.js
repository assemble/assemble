'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function rendererPlugin(assemble) {

  return function renderer(options, data) {
    return through.obj(function (file, encoding, callback) {
      assemble.set('encoding', encoding || 'utf8');

      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('Assemble renderer', 'Streaming is not supported with engines.'));
        return callback();
      }

      data = _.extend({}, assemble.context, data, file.data);
      var ext = assemble.set('srcExt', path.extname(file.path));
      var engine = assemble._engines[ext];

      function render(err, str, ext) {
        if (err) {
          callback(err);
        } else {
          file.ext = assemble.set('ext', ext || '.html');
          file.path = gutil.replaceExtension(file.path, assemble.get('ext'));
          file.contents = new Buffer(str);
          return file;
        }
      }

      var context = _.extend({}, options, data, engine.options);

      try {
        if (options.renderFile) {
          engine.renderFile(file.path, context, render);
        } else {
          var str = file.contents.toString(assemble.get('encoding'));
          engine.render(str, context, render);
        }
      } catch (err) {
        this.emit('error', new gutil.PluginError('Assemble renderer', err));
      }

      this.push(file);
      callback();
    });
  };
};
