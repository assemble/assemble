'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var es = require('event-stream');
var through = require('through2');
var gutil = require('gulp-util');
var utils = require('../utils.js');


module.exports = function(dest, options) {
  options = _.extend({}, this.options, options);
  var locals = _.extend({}, options, options.locals);
  var isExtended = false;

  var extendFile = through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    // `file.locals` is created in src
    if (!isExtended && file.locals) {
      isExtended = true;
      _.extend(locals, file.locals || {});
    }

    if (file.dest) {
      dest = file.dest;
    }

    this.push(file);
    callback();
  });

  return es.pipe.apply(es, utils.arrayify([
    extendFile,
    this.collection(options),
    // options.noassets ? gutil.noop() : this.destPath(dest, options),
    // options.nodest   ? gutil.noop() : this.assetsPath(dest, options),
    // options.noroutes ? gutil.noop() : this.routes(options),
    options.norender ? gutil.noop() : this.render(options, locals)
  ]));
};