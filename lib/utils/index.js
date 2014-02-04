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
var paths = require('path-utils');
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
	obj[paths.basename(name)] = require(module);
};

exports.requireDir = function(obj, dir, exclusions) {

	exclusions = exclusions || [];
  exclusions = utils.arrayify(exclusions);

	exclusions = _.map(exclusions, function(exclusion) {
		return paths.basename(exclusion);
	});

	var files = paths.withExt(dir, 'js');
	_.filter(files, function(filepath) {
		return (_.indexOf(exclusions, paths.basename(filepath)) === -1);
	}).map(function(filepath) {
		exports.require(obj, path.join(dir, filepath), paths.basename(filepath));
	});
};

exports.model = Model;
exports.requireDir(exports, __dirname, ['index', 'model']);