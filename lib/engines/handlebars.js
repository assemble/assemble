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
var _ = require('lodash');

// events that handlebars might emit
var events = {
	handlebarsBeforeParse: 'handlebars:before:parse',
	handlebarsAfterParse: 'handlebars:after:parse',
	handlebarsBeforeCompile: 'handlebars:before:compile',
	handlebarsAfterCompile: 'handlebars:after:compile',
	handlebarsBeforeRender: 'handlebars:before:render',
	handlebarsAfterRender: 'handlebars:after:render'
};

var Handlebars = require('handlebars');
var helpers = require('handlebars-helpers');

var HandlebarsEngine = function (assemble, options) {
	this.assemble = assemble;
	this.dovetail = assemble.dovetail;
	this.options = options || {};

	helpers.register(Handlebars, this.options);
};

HandlebarsEngine.prototype.registerPartial = function (name, partial, done) {
	Handlebars.registerPartial(name, partial);
	done();
};

HandlebarsEngine.prototype.compile = function (tmpl, options, done) {

	var self = this;
	var params = {
		tmpl: tmpl,
		options: options,
		ast: null,
		fn: null
	};

	// notify plugins when we're going to do something
	// passing in the current state of the params
	var notify = function (stage) {
		return function (next) {
			self.dovetail.runStage(stage, params, next);
		};
	};

	async.series(
		[
			notify(events.handlebarsBeforeParse),
			function (next) {
				params.ast = Handlebars.parse(params.tmpl);
				next();
			},
			notify(events.handlebarsAfterParse),
			notify(events.handlebarsBeforeCompile),
			function (next) {
				params.fn = Handlebars.compile(params.tmpl, params.options);
				next();
			},
			notify(events.handlebarsAfterCompile)
		],
		function (err) {
			done(null, params.fn);
		});

};

HandlebarsEngine.prototype.render = function (tmpl, data, options, done) {

	var self = this;
	var params = {
		tmpl: tmpl,
		data: data,
		options: options,
		content: null
	};

	if (_.isFunction(tmpl)) {

		// notify plugins when we're going to do something
		// passing in the current state of the params
		var notify = function (stage) {
			return function (next) {
				self.dovetail.runStage(stage, params, next);
			};
		};

		async.series(
			[
				notify(events.handlebarsBeforeRender),
				function (next) {
					params.content = params.tmpl(data, options);
					next();
				},
				notify(events.handlebarsAfterRender)
			],
			function (err) {
				done(null, params.content);
			}
		);

	} else {
		self.compile(params.tmpl, params.options, function (err, fn) {
			self.render(fn, params.data, params.options, done);
		});
	}
};

var handlebars = null;
var engine = module.exports = function (assemble, options) {
	return (handlebars = handlebars || new HandlebarsEngine(assemble, options));
};