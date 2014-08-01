'use strict';

/**
 * Module dependencies.
 */

var matter = require('gray-matter');
var _ = require('lodash');

module.exports = function grayMatter (options) {
  options = _.extend({}, options);
  return function (file, encoding) {
    var obj = matter(file.contents.toString(encoding || 'utf8'), options);
    file.data = _.extend(file.data, obj.data);
    file.contents = new Buffer(obj.content);
    file.original = obj.original;
    return file;
  };
};