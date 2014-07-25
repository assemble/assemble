'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var Layout = require('../view/layout');
var partial = require('../view/partial');

module.exports = function rendererPlugin(assemble) {

  var layouts = new Layout(assemble);

  return function renderer(options, locals) {
    options = options || {};
    options.engines = options.engines || assemble.engines;
    options.defaultEngine = options.defaultEngine || assemble.get('view engine');

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
      var layout = layouts.get(options.ext || file.ext || assemble.get('ext'));
      var helpers = options.helpers;
      file.layout = layout && layout.flatten(file);
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

      var opts = _.extend({}, options, data, {
        // ext: assemble.get('ext'),
        helpers: assemble.helpers(helpers),
        partials: partial(assemble.partials)
      });

      try {
        file.render(opts, render);
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-renderer', err));
        return callback();
      }
    });
  };
};