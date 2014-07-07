'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var matter = require('gray-matter');
var delims = require('escape-delims');
var tmpl = require('template');
var _ = require('lodash');


// Normalize options for `template` lib
var template = function(str, data, options) {
  var opts = _.extend({}, {delims: ['{%', '%}']}, options);
  return tmpl(str, data, opts);
};


module.exports = function assembleTemplate(assemble) {
  return function(options) {
    options = options || {};
    var data = options.data || options;

    return through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-template', 'Streaming not supported'));
        return callback();
      }
      try {
        var str = file.contents.toString('utf8');
        if (options && !options.noescape) {
          str = delims.escape(str);
        }

        data = _.extend({}, assemble.context, data, file.data);
        var rendered = template(str, data, options);
        file.contents = new Buffer(rendered);
        file.path = gutil.replaceExtension(file.path, '.html');
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-template', err));
      }

      this.push(file);
      callback();
    });
  };
};

