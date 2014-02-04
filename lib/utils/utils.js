/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');

var paths = require('path-utils');

var utils = module.exports = {};

utils.generateFilename = function(name) {
  return path.join(process.cwd(), '.assemble', 'data', name);
};

utils.arrayify = function(arr) {
  return !Array.isArray(arr) ? [arr] : arr;
};

utils.generateDestination = function (src, dest, expanded, options) {
  if ((paths.lastChar(dest) === '/' || 
        paths.lastChar(dest) === '\\') &&
      expanded === false) {
    if (options.flatten) {
      src = paths.basename(src);
    }
    dest = path.join(dest, src);
  }

  var destDirname = paths.dirname(dest);
  var destBasename = paths.basename(dest);
  dest = paths.normalizeSlash(path.join(destDirname, destBasename)) + options.ext;

  return dest;

};

