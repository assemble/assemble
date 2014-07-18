'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function rendererPlugin(assemble) {
  var View = assemble.get('view');

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

      var view = new View(file, assemble, options);
      var stream = this;

      function render(err, file, ext) {
        if (err) {
          next(err);
        } else {
          file.ext = options.ext || ext || assemble.get('ext');
          file.path = gutil.replaceExtension(file.path, file.ext);
          stream.push(file);
          next();
        }
      }

      var context = _.extend({}, options, data);
      try {
        view.render(context, render);
      } catch (err) {
        this.emit('error', new gutil.PluginError('Assemble renderer', err));
        return next();
      }
    });
  };
};
