'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var Handlebars = require('handlebars');
var _ = require('lodash');

module.exports = function handlebarsPlugin(options) {
  var assemble = this;
  var opts = _.extend({}, assemble.options, options);

  var data = opts.data || opts;
  delete opts.data;

  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-template', 'Streaming not supported'));
      return cb();
    }
    try {
      data = _.extend({}, assemble.cache, data, file.data);
      var template = Handlebars.compile(file.contents.toString('utf8'));
      var rendered = template(data);

      file.contents = new Buffer(rendered);
      file.path = gutil.replaceExtension(file.path, '.html');
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-template', err));
    }

    this.push(file);
    cb();
  });
};
