'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');


module.exports = function rendererPlugin(options, locals) {
  var assemble = this;
  // var context = assemble.context;
  var opts = _.extend({}, assemble.options, options);

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-renderer', 'Streaming is not supported with engines.'));
      return callback();
    }

    // context.extend(name, _.extend({}, file, file.data, locals));
    // var ctx = context.calculate(['global', 'options.data', name]);

    try {
      var stream = this;
      opts.locals = locals;
      assemble.render(file, opts, function (err, file, ext) {
        if (err) {
          stream.emit('error', new gutil.PluginError('assemble-renderer', err));
          callback(err);
        } else {
          file.ext = opts.ext || ext || assemble.get('ext');
          file.path = gutil.replaceExtension(file.path, file.ext);
          stream.push(file);
          callback();
        }
      });
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-renderer', err));
      return callback();
    }
  });
};
