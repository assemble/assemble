/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var expand = require('expand');
var _ = require('lodash');

// The module to be exported.
var data = module.exports = {};

data.process = function(obj, ctx) {
  ctx = ctx || _.cloneDeep(obj);
  var processed = expand.process(ctx);
  return _.omit(processed, function (value, key) {
    return !obj.hasOwnProperty(key);
  });
};

data.get = function(obj, path) {
  return expand.get(obj, path);
};

data.set = function(obj, path, value) {
  return expand.set(obj, path, value);
};
