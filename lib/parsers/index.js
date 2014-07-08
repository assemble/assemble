/*!
 * assemble-gray-matter <https://github.com/assemble/assemble-gray-matter>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License
 */

'use strict';

var matter = require('gray-matter');
var extend = require('xtend');

module.exports = function grayMatter (assemble) {
  return function (file, encoding, options) {
    options = extend({}, options);

    var obj = matter(file.contents.toString(encoding || 'utf8'), options);
    file.data = obj.data;
    file.contents = new Buffer(obj.content);
    file.original = obj.original;
    return file;
  };
};