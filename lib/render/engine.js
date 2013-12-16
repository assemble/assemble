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

var utils = require('../utils');

var engineCache = {};
var engine = module.exports = {};
utils.requireDir(engine, path.join(__dirname, 'engines'));

var Engine = function (type, options) {
	this.type = type;
	this.options = options || {};
	this.renderer = engine[this.type](this.options);
};

Engine.prototype.compile = function(tmpl, options) {
	return this.renderer.compile(tmpl, options);
};

Engine.prototype.render = function(tmpl, data, options) {
	if(Object.toString.call(tmpl) === '[Function]') {
		return tmpl(data, options);
	}
	return this.renderer.render(tmpl, data, options);
};

engine.get = function(type, options) {
	return (engineCache[type] = engineCache[type] || new Engine(type, options));
};
