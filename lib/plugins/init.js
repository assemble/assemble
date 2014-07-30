'use strict';

/**
 * Module dependencies.
 */

var File = require('vinyl');
var through = require('through2');
var extendFile = require('../utils/extend-file-obj');
var _ = require('lodash');

module.exports = function initPlugin(options) {
  var opts = _.extend({}, options);

  return through.obj(function (file, encoding, next) {
    var fileObj = extendFile(file, opts);

    if (typeof fileObj.contents === 'string' && !(fileObj.contents instanceof Buffer)) {
      fileObj.contents = new Buffer(fileObj.contents);
    }
    file = new File(fileObj);

    for (var key in fileObj) {
      if (fileObj.hasOwnProperty(key) && !file.hasOwnProperty(key)) {
        file[key] = fileObj[key];
      }
    }
    this.push(file);
    next();
  });
};