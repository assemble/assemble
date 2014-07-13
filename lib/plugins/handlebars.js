'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var Handlebars = require('handlebars');
var _ = require('lodash');

module.exports = function assembleHandlebars(assemble) {
  return function(options) {
    options = options || {};
    var data = options.data || options;
    delete options.data;

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
        data = _.extend({}, assemble.cache, data, file.locals);
        var template = Handlebars.compile(file.contents.toString('utf8'));
        var rendered = template(data);

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
