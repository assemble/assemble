'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var es = require('event-stream');
var utils = require('../utils.js');
var fs = require('vinyl-fs');
var template = require('template');
var _ = require('lodash');


/**
 * `src` plugin
 */

module.exports = function(dest, options, data) {
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
    fs.src(glob, options),
    this.use('first'),
    extendFile,
    this.use('parse:before'),
    this._parse(options),
    drafts(this)(options),
    this.use('parse:after'),
  ]));
};
