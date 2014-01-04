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

var Engine = function (line, type, options) {
	this.line = line;
	this.type = type;
	this.options = options || {};
	this.renderer = engine[this.type](this.line, this.options);
};

Engine.prototype.compile = function (tmpl, options, done) {
	this.renderer.compile(tmpl, options, done);
};

Engine.prototype.render = function (tmpl, data, options, done) {
	this.renderer.render(tmpl, data, options, done);
};

engine.get = function (line, type, options) {
	return (engineCache[type] = engineCache[type] || new Engine(line, type, options));
};