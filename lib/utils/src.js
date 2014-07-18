'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var es = require('event-stream');
var gutil = require('gulp-util');
var through = require('through2');
var utils = require('../utils.js');
var drafts = require('../plugins/drafts');
var paginate = require('../plugins/paginate');


/**
 * `src` plugin
 */

module.exports = function(glob, options, data) {
  options = options || {};

  var extendFile = through.obj(function (file, enc, callback) {
    // console.log('src extendFile', file.path);
    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    file.data = _.extend({}, data, file.data);
    this.push(file);
    callback();
  });

  // extendFile.setMaxListeners(0);
  return es.pipe.apply(es, utils.arrayify([
    options.noparse ? gutil.noop() : this.use('first'),
    extendFile,
    options.noparse ? gutil.noop() : this.use('parse:before'),
    this._parse(options),
    this.pages(options),
    drafts(this)(options),
    options.noparse ? gutil.noop() : this.use('parse:after'),
    paginate(this)(options)
  ]));
};
