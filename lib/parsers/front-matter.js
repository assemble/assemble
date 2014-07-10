/*!
 * assemble-gray-matter <https://github.com/assemble/assemble-gray-matter>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License
 */

'use strict';

var matter = require('gray-matter');
var extend = require('xtend');

module.exports = function grayMatter (options) {
  options = extend({}, options);

  return function (file, encoding, opts) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError('assemble-gray-matter', 'Streaming not supported'));
      return callback();
    }

    opts = extend({}, options, opts);
    var obj = matter(file.contents.toString(encoding || 'utf8'), opts);
    file.locals = obj.data;
    file.contents = new Buffer(obj.content);
    file.original = obj.original;
    return file;
  };
};