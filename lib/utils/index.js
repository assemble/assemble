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
var _ = require('lodash');

// Local libs
var utils = require('./utils');
var Model = require('./model');

var exports = module.exports = {};
exports.isWin = !!process.platform.match(/^win/);

exports.require = function(obj, module, name) {
  if(!name || name.length <= 0) {
    name = module;
  }
  obj[file.basename(name)] = require(module);
};

exports.requireDir = function(obj, dir, exclusions) {

  exclusions = exclusions || [];
  exclusions = utils.arrayify(exclusions);

  exclusions = _.map(exclusions, function(exclusion) {
    return file.basename(exclusion);
  });

  var files = file.withExt(dir, 'js');
  _.filter(files, function(filepath) {
    return (_.indexOf(exclusions, file.basename(filepath)) === -1);
  }).map(function(filepath) {
    exports.require(obj, path.join(dir, filepath), file.basename(filepath));
  });
};

exports.model = Model;
exports.utils = utils;
exports.requireDir(exports, __dirname, ['index', 'model', 'utils']);
