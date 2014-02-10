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
var utils = require('../utils');

var models = module.exports = {};

models.FileTypes = {
	DATA: 'data',
	PARTIAL: 'partial',
	COMPONENT: 'component',
	PAGE: 'page',
	POST: 'post',
	INDEX: 'index'
};

var exclusions = ['index'];
var files = file.withExt(__dirname, 'js');

_.filter(files, function (filepath) {
	return (_.indexOf(exclusions, file.basename(filepath)) === -1);
}).map(function (filepath) {
	var name = file.basename(filepath);
	name = name.charAt(0).toUpperCase() + name.slice(1);
	utils.require(models, path.join(__dirname, filepath), name);
});
