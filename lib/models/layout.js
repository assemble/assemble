/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assemble = require('../assemble');
var utils = assemble.utils;

var Component = require('./component');

var properties = {
	type: 'layout',
	stack: [],
	name: ''
};

var Layout = module.exports = utils.model.inherit(Component, properties);

Layout.prototype.load = function(src, done) {
	this.src = src;
	done();
};