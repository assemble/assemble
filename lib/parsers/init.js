'use strict';

/**
 * Module dependencies.
 */

var matter = require('gray-matter');
var extendFile = require('../utils/extend-file-obj')
var _ = require('lodash');

module.exports = function init(options) {
  options = _.extend({}, options);
  return function (file, encoding) {
    var obj = matter(file.contents.toString(encoding || 'utf8'), options);
    file.data = _.extend(file.data, obj.data);
    file.contents = new Buffer(obj.content);
    file.original = obj.original;

    var extended = extendFile(file);

    for (var key in extended) {
      if (extended.hasOwnProperty(key)) {
        file[key] = extended[key];
      }
    }

    return file;
  };
};