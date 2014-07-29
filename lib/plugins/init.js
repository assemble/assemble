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
    if (typeof obj.contents === 'string' && !(obj.contents instanceof Buffer)) {
      obj.contents = new Buffer(obj.contents);
    }
    file = new File(obj);

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && !file.hasOwnProperty(key)) {
        file[key] = obj[key];
      }
    }
    this.push(file);
    next();
  });
};