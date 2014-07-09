'use strict';

var matter = require('gray-matter');
var extend = require('xtend');


module.exports = function frontMatter(assemble) {
  return function (options) {
    options = extend({}, options);

    return function (file, encoding) {
      var obj = matter(file.contents.toString(encoding || 'utf8'), options);
      file.data = obj.data;
      file.contents = new Buffer(obj.content);
      file.orig = new Buffer(obj.original);
      return file;
    };
  };
};