'use strict';

/**
 * Module dependencies.
 */

var File = require('vinyl');
var through = require('through2');
var parse = require('../utils/parse').parse;
var _ = require('lodash');

module.exports = function initPlugin(options) {
  var opts = _.extend({}, options);

  return through.obj(function (file, encoding, next) {
    var obj = parse(file, opts);
    if (!(obj.contents instanceof Buffer)) {
      obj.contents = new Buffer(obj.contents);
    }
    file = new File(obj);
    this.push(file);
    next();
  });
};