/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');

var utils = module.exports = {};


utils.generateFilename = function(name) {
  return path.join(process.cwd(), '.assemble', 'data', name);
};

utils.arrayify = function(arr) {
  return !Array.isArray(arr) ? [arr] : arr;
};