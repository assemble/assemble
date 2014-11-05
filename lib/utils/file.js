/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var Vinyl = require('vinyl');
var matter = require('gray-matter');

/**
 * Convert an assemble file object to a Vinyl File object.
 * 
 * @param  {Object} `file` Object with properties that assemble expects
 * @return {Object} Vinyl File Object
 */

var toVinyl = function (file) {
  var record = new Vinyl({
    cwd: file.cwd || file.locals.cwd,
    base: file.base || file.locals.base,
    path: file.path,
  });
  if (file.content) {
    record.contents = new Buffer(file.content);
  }

  var keys = Object.keys(file), len = keys.length, i = 0;
  while (len--) {
    var key = keys[i++];
    if (['options', 'locals', 'data'].indexOf(key) >= 0) {
      record[key] = file[key] || (file[key] = {});
    } else if (['path', 'cwd', 'base'].indexOf(key) === -1 && key.indexOf('content') === -1) {
      record[key] = file[key];
    }
  }
  return record;
};

/**
 * Convert a Vinyl File Object to an assemble file object.
 * 
 * @param  {Object} `record` Vinyl File Object (possibly with additional properties)
 * @return {Object} A plain object that assemble will use.
 */

var toFile = function (record) {
  var file = {};
  if (record.isNull()) {
    file.content = null;
    file.orig = null;
    file.data = {};
  } else {
    file = matter(record.contents.toString());
  }
  var keys = Object.keys(record), len = keys.length, i = 0;

  while (len--) {
    var key = keys[i++];
    if (key !== 'path' && key.indexOf('content') === -1) {
      file[key] = record[key];
    }
  }

  file.options = file.options || {};
  file.locals = file.locals || {};
  file.path = file.path || record.path;
  file.ext = file.ext || path.extname(file.path);
  file.options.engine = file.options.engine || file.ext;

  return file;
};

/**
 * Export an object with methods
 */

module.exports = {
  toVinyl: toVinyl,
  toFile: toFile
};