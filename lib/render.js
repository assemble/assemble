/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */
var async = require('async');
var path = require('path');
var _ = require('lodash');

var utils = require('./utils');

var engineCache = {};
var engine = module.exports.engine = {};
utils.requireDir(engine, path.join(__dirname, 'engines'));

var Engine = function (assemble, type, options) {
	this.assemble = assemble;
	this.type = type;
	this.options = options || {};
	this.renderer = engine[this.type](this.assemble, this.options);
};

Engine.prototype.registerPartials = function (partials, done) {
	async.each(_.keys(partials), function (key, next) {
			var partial = partials[key];
			this.renderer.registerPartial(partial.name, partial.content, next);
		}.bind(this),
		function (err) {
			if (err) {
				console.log('Error', err);
			}
			done(err);
		});
};

Engine.prototype.renderComponents = function (components, done) {
	async.each(_.keys(components), function (key, next) {
			var component = components[key];
			this.render(component.content, component.metadata, {}, function (err, content) {
				component.rendered = content;
				next();
			});
		}.bind(this),
		done);
};

Engine.prototype.compile = function (tmpl, options, done) {
	this.renderer.compile(tmpl, options, done);
};

Engine.prototype.render = function (tmpl, data, options, done) {
	this.renderer.render(tmpl, data, options, done);
};

engine.get = function (assemble, type, options) {
	return (engineCache[type] = engineCache[type] || new Engine(assemble, type, options));
};