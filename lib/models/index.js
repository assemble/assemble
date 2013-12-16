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
var fs = require('fs');
var _ = require('lodash');

var utils = require('../utils');

var basename = function(file) {
	return path.basename(file, path.extname(file));
};

var models = module.exports = {};

var exclusions = ['index'];
var files = fs.readdirSync(__dirname);
_.filter(files, function(file) {
	return (_.indexOf(exclusions, basename(file)) === -1);
}).map(function(file) {
	var name = basename(file);
	name = name.charAt(0).toUpperCase() + name.slice(1);
	utils.require(models, path.join(__dirname, file), name);
});
