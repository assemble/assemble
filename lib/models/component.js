/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var assemble = require('../assemble');
var utils = assemble.utils;
var render = assemble.render;

var Component = module.exports = utils.model.inherit(require('./file'));

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