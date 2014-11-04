'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var utils = require('../utils');
var _ = require('lodash');
var session = require('../session');
var path = require('path');

module.exports = function rendererPlugin(options, locals) {
  var assemble = this;
  var opts = _.extend({}, assemble.options, options);
  
  var fileType = session.get('file type');

  return through.obj(function(vinyl, encoding, cb) {
    if (vinyl.isNull()) {
      this.push(vinyl);
      return cb();
    }

    if (vinyl.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-plugin:render', 'Streaming is not supported.'));
      return cb();
    }

    try {
      var stream = this;
      var key = path.basename(vinyl.path, path.extname(vinyl.path));
      var file = assemble['get' + fileType](key);
      file.content = vinyl.contents.toString();

      assemble.render(file, locals, function(err, content) {
        if (err) {
          stream.emit('error', new gutil.PluginError('assemble-plugin:render', err));
          cb(err);
          return;
        }

        vinyl.contents = new Buffer(content);
        stream.push(vinyl);
        cb();
      });

    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-plugin:render', err));
      return cb();
    }
  });
};
