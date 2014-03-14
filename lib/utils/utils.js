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
var matter = require('gray-matter');
var file = require('fs-utils');
var _ = require('lodash');

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

utils.expandComponent = function (component) {
  // ensure the content and metadata are populated
  if (_.isEmpty(component.metadata) || _.isEmpty(component.content)) {
    var info = matter(component.raw);
    component.content = info.content;
    component.metadata = info.context;
  }
};