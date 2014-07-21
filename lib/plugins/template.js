'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var delims = require('escape-delims');
var template = require('template');
var extend = require('xtend');


module.exports = function assembleTemplate(assemble) {
  return function(options) {
    options = extend({}, {delims: ['{%', '%}']}, options);
    var data = options.data || options;

    return through.obj(function (file, encoding, next) {
      if (file.isNull()) {
        this.push(file);
        return next();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-template', 'Streaming not supported'));
        return next();
      }

      try {
        var str = file.contents.toString('utf8');
        if (options && !options.noescape) {
          str = delims.escape(str);
        }

        data = extend({}, assemble.cache, data, file.data);
        var rendered = template(str, data, options);
        file.contents = new Buffer(rendered);
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-template', err));
      }

      this.push(file);
      next();
    });
  };
};

