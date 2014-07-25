'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

/**
 * `parser` plugin
 *
 * Traverse the `parser` stack, passing the `file` object to each
 * parser and returning the accumlated result.
 *
 * @param  {Object} `options`
 */

module.exports = function parserPlugin(options) {
  var assemble = this;

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble.parse()', 'Streaming not supported'));
      return callback();
    }

    // Clone the options
    var opts = _.extend({}, options);
    var ext = file.ext || path.extname(file.path) || assemble.get('ext');
    if (ext[0] === '.') {
      ext = ext.replace(/^\./, '');
    }

    var parsers = assemble.get('parsers.' + ext);

    if (parsers && parsers.length) {
      parsers.forEach(function (parser) {
        try {
          file = parser(file, encoding, opts);
        } catch (err) {
          this.emit('error', new gutil.PluginError('assemble.parse() parsing error.', err));
        }
      });
    }

    this.push(file);
    callback();
  });
};