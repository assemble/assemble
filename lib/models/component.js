/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var utils = require('../utils');
var render = require('../render');

var Component = module.exports = utils.model.inherit(require('./base'));

Component.prototype.initialize = function(options) {
	options = options || {};
	this.engine = render.engine.get(options.type || 'handlebars', options);
	this.metadata = {};
	this.template = '';
	this.raw = '';
};

Component.prototype.render = function(options) {
	return this.engine.render(this.template, this.metadata, options);
};


