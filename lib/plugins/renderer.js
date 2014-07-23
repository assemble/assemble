'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function rendererPlugin(assemble) {
  var View = assemble.get('view');

  return function renderer(options, locals) {
    return through.obj(function (file, encoding, callback) {
      assemble.set('encoding', encoding || 'utf8');

      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-renderer', 'Streaming is not supported with engines.'));
        return callback();
      }

      var data = _.extend({}, assemble.get(), locals, file.data, file.locals);
      var view = new View(file, assemble, options);
      var stream = this;

      function render(err, file, ext) {
        if (err) {
          callback(err);
        } else {
          file.ext = options.ext || ext || assemble.get('ext');
          file.path = gutil.replaceExtension(file.path, file.ext);
          stream.push(file);
          callback();
        }
      }

      var opts = _.extend({}, options, {
        ext: assemble.get('ext'),
        helpers: assemble.config.get('helpers'),
        partials: assemble.config.get('partials'),
      }, data);

      try {
        view.render(opts, render);
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-renderer', err));
        return callback();
      }
    });
  };
};