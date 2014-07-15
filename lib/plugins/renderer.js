'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');


module.exports = function rendererPlugin(assemble) {

  return function renderer(options, data) {
    return through.obj(function (file, encoding, next) {
      assemble.set('encoding', encoding || 'utf8');

      if (file.isNull()) {
        this.push(file);
        return next();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('Assemble renderer', 'Streaming is not supported with engines.'));
        return next();
      }

      data = _.extend({}, assemble.cache, data, file.locals);
      var ext = path.extname(file.path);
      var engine = assemble.engines[ext];

      if (!engine) {
        this.push(file);
        return next();
      }

      var stream = this;

      function render(err, str, ext) {
        if (err) {
          next(err);
        } else {
          file.ext = options.ext || ext || '.html';
          file.path = gutil.replaceExtension(file.path, file.ext);
          file.contents = new Buffer(str);
          stream.push(file);
          next();
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
        return next();
      }
    });
  };
};
