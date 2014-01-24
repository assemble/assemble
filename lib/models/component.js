/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assemble = require('../assemble');
var utils = assemble.utils;
var render = assemble.render;

var File = require('./file');
var Component = module.exports = utils.model.inherit(File);

Component.prototype.initialize = function (options) {
	options = options || {};
	this.engine = render.engine.get(assemble(), options.type || assemble.defaults.engine, options);
	this.metadata = {};
	this.template = '';
	this.raw = '';
};

Component.prototype.render = function (options) {
	return this.engine.render(this.template, this.metadata, options);
};