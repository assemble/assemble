/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';
var parsePath = require('parse-filepath');
var matter = require('gray-matter');
var Vinyl = require('vinyl');
var path = require('path');
var _ = require('lodash');
var utils = require('./');

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

  // setup default properties on the file
  file.data = file.data || {};
  file.options = file.options || {};
  file.locals = file.locals || {};

  file.path = file.path || record.path;
  file.ext = file.ext || path.extname(file.path);

  file.options.engine = file.options.engine || file.ext;
  file.data.src = file.data.src || {};
  file.data.dest = file.data.dest || {};

  // add default src and dest properties to the file.data object  
  var parsed = parsePath(file.path);
  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      file.data.src[key] = file.data.src[key] || parsed[key];
      file.data.dest[key] = file.data.dest[key] || parsed[key];
    }
  }

  file.data.src.path = file.data.src.path || file.path;
  file.data.dest = _.extend(file.data.dest, {
    path: file.data.src.path,
    ext: parsed.extname
  });


  return file;
};

/**
 * Export an object with methods
 */

module.exports = {
  toVinyl: toVinyl,
  toFile: toFile
};