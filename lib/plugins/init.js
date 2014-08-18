'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var _ = require('lodash');

var parseMatter = require('../utils/parse-matter');
var parsePath = require('../utils/parse-path');
var extendFile = require('../utils/extend-file');


module.exports = function initPlugin(options) {
  var opts = _.extend({}, this.options, options);

  return through.obj(function (file, encoding, next) {
    if (file.isNull()) {
      this.push(file);
      return next();
    }

    file = parseMatter(file, encoding, opts);
    file = parsePath(file, encoding, opts);
    file = extendFile(file, encoding, opts);

    this.push(file);
    next();
  });
};
