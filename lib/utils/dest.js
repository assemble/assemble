'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var through = require('through2');
var gutil = require('gulp-util');
var es = require('event-stream');
var utils = require('../utils.js');

/**
 * `dest` plugin
 */

module.exports = function(dest, options, data) {
  data = _.extend({}, data);
  options = options || {};

  var extendFile = through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    _.extend(data, file.data);
    this.push(file);
    callback();
  });

  return es.pipe.apply(es, utils.arrayify([
    extendFile,
    this.collection(options),
    options.norender ? gutil.noop() : this.use('render:before'),
    this.render(options, data),
    options.norender ? gutil.noop() : this.use('render:after'),
    this.use('last')
  ]));
};