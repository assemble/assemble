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
var HandlebarsEngine = function (line, options) {
	this.line = line;
	this.pluginHandler = this.line.pluginHandler;
	this.options = options || {};
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
			self.pluginHandler.run(stage, self.line, params, next);
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
				params.fn = Handlebars.precompile(params.tmpl, params.options);
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

	if (Object.toString.call(tmpl) === '[Function]') {

		// notify plugins when we're going to do something
		// passing in the current state of the params
		var notify = function (stage) {
			return function (next) {
				self.pluginHandler.run(stage, self.line, params, next);
			};
		};

		async.series(
			[
				notify(event.handlebarsBeforeRender),
				function (next) {
					params.content = params.tmpl(data, options);
					next();
				},
				notify(event.handlebarsAfterRender)
			],
			function (err) {
				done(null, params.content);
			}
		);

	} else {
		self.compile(params.tmpl, params.options, function (err, fn) {
			self.render(params.tmpl, params.data, params.options, done);
		});
	}
};

var handlebars = null;
var engine = module.exports = function (line, options) {
	return (handlebars = handlebars || new HandlebarsEngine(line, options));
};