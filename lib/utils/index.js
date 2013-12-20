/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var utils = module.exports = {};
utils.isWin = !!process.platform.match(/^win/);

utils.plugins = require('./plugins');

var basename = function(file) {
	return path.basename(file, path.extname(file));
};

utils.require = function(obj, module, name) {
	if(!name || name.length <= 0) {
		name = module;
	}
	obj[basename(name)] = require(module);
};

utils.requireDir = function(obj, dir, exclusions) {

	exclusions = exclusions || [];
	if(!_.isArray(exclusions)) {
		exclusions = [exclusions];
	}
	exclusions = _.map(exclusions, function(exclusion) {
		return basename(exclusion);
	});

	var files = fs.readdirSync(dir);
	_.filter(files, function(file) {
		if(fs.statSync(path.join(dir, file)).isDirectory()) {
			return false;
		}
		return (_.indexOf(exclusions, basename(file)) === -1);
	}).map(function(file) {
		utils.require(obj, path.join(dir, file), basename(file));
	});
};

utils.requireDir(utils, __dirname, 'index');