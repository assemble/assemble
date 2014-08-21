'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var through = require('through2');
var gutil = require('gulp-util');
var remarked = require('../engines/remarked');


/**
 * Assemble plugin for Remarked.
 */

module.exports = function remarkedPlugin(options, data) {
  var assemble = this;
  var opts = _.extend({}, assemble.options);
  _.extend(opts, options);

  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-remarked', 'Streaming not supported'));
      return cb();
    }

    function render(err, html) {
      if (err) {
        cb(err);
      } else {
        file.contents = new Buffer(html);
        cb(null, file);
      }
    }

    // Set remarked options.
    remarked.setOptions(opts);

    try {
      if (options.filepath) {
        remarked(file.path, data, render);
      } else {
        remarked.render(String(file.contents), data, render);
      }
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-template', err));
    }

    this.push(file);
    cb();
  });
};
