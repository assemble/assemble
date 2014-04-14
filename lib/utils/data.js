/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var expand = require('expander');

// The module to be exported.
var data = module.exports = {};

data.process = function(obj, ctx, options) {
  return expand.process(ctx, obj, options);
};

data.get = function(obj, path, options) {
  return expand.get(obj, path, options);
};

data.set = function(obj, path, value) {
  return expand.setRaw(obj, path, value);
};
