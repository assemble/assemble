/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var path = require('path');

// node_modules
var file = require('fs-utils');

var utils = module.exports = {};

utils.generateFilename = function(name) {
  return path.join(process.cwd(), '.assemble', 'data', name);
};

utils.arrayify = function(arr) {
  return file.arrayify(arr);
};

utils.generateDestination = function (src, dest, expanded, options) {
  if ((file.lastChar(dest) === '/' ||
        file.lastChar(dest) === '\\') &&
      expanded === false) {
    if (options.flatten) {
      src = file.basename(src);
    }
    dest = path.join(dest, src);
  }

  var destDirname = file.dirname(dest);
  var destBasename = file.basename(dest);
  dest = file.normalizeSlash(path.join(destDirname, destBasename)) + options.ext;

  return dest;

};

