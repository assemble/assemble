'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var es = require('event-stream');
var gutil = require('gulp-util');
var through = require('through2');
var utils = require('../utils.js');
var init = require('../plugins/init');
var drafts = require('../plugins/drafts');
var paginate = require('../plugins/paginate');


/**
 * `src` plugin
 */

module.exports = function(glob, options) {
  options = _.extend({}, this.options, options);
  var locals = _.extend({}, options, options.locals);

  var extendFile = through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    // add a `locals` property to the file object to pass
    // locals to the `dest`
    file.locals = _.extend({}, locals, file.locals);
    this.push(file);
    callback();
  });

  return es.pipe.apply(es, utils.arrayify([
    init(this)(options),
    // routes(this)('src'),
    this.disabled('buffer files') ? gutil.noop() : this.buffer(options),
    extendFile,
    this.parse(options),
    drafts(this)(options),
    paginate(this)(options)
  ]));
};
