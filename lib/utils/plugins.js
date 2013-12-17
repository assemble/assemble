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
var fs = require('fs');

var resolve = require('resolve-dep');
var grunt = require('grunt');
var async = require('async');
var _ = require('lodash');

var plugins = module.exports = {};


plugins.resolve = function(_plugins, options) {
	options = options || {};
	_plugins = _plugins || [];
	if(!_.isArray(_plugins)) {
		_plugins = [_plugins];
	}
	var actualPlugins = [];

	_plugins.forEach(function(plugin) {
		// if plugin is a string, attempt to resolve to module
		if(_.isString(plugin)) {
			var resolved = resolve.all(plugin);
			// if resolved to an npm module then use it, otherwise assume local file/pattern so expand
			var relPaths = resolve.length ? resolved : grunt.file.expand(plugin);
			var resolvedPlugins = relPaths.map(function(relPath) {
				// normalize the relative path given current working directory
				var fullPath = path.normalize(path.join(options.cwd || process.cwd() || '', relPath));
				try {
					var required = require(fullPath);
					return required;
				} catch (ex) {
					grunt.log.writeln('Error requiring plugin "' + plugin + '"');
					grunt.log.writeln(ex);
				}
			});
			actualPlugins = actualPlugins.concat(resolvedPlugins || []);
		}
		// otherwise, assume plugin is already a function
		else {
			actualPlugins.push(plugin);
		}
	});

	// set plugin options
	actualPlugins.forEach(function(plugin) {
		var defaults = {
			stage: 'render:pre:page'
		};
		plugin.options = _.extend({}, defaults, plugin.options);
	});
	return actualPlugins;
};

plugins.runner = function (stage, params) {
	params.stage = stage;
	var assemble = params.assemble;
	var isStageMatch = function (a, b) {
		return (a === b) || a === '*';
	};

	var pluginsOfType = _.filter(assemble.plugins, function (plugin) {
		var pluginParts = plugin.options.stage.split(':');
		var stageParts = stage.split(':');
		return isStageMatch(pluginParts[0], stageParts[0]) &&
						isStageMatch(pluginParts[1], stageParts[1]) &&
						isStageMatch(pluginParts[2], stageParts[2]);
	});

	return function (done) {
		async.forEachSeries(pluginsOfType, function(plugin, next) {
			if(_.isFunction(plugin)) {
				plugin(params, next);
			} else {
				next();
			}
		},
		function (err) {
			if (err) { grunt.log.error(err); done(err); }
			else { done(); }
		});
	};
};

plugins.stages = [
	'options:pre:configuration',
	'options:post:configuration',
	'assemble:pre:layout',
	'assemble:post:layout',
	'assemble:pre:partials',
	'assemble:post:partials',
	'assemble:pre:data',
	'assemble:post:data',
	'assemble:pre:pages',
	'assemble:pre:page',
	'assemble:post:page',
	'assemble:post:pages',
	'render:pre:pages',
	'render:pre:page',
	'render:post:page',
	'render:post:pages'
];

plugins.run = function(params, done) {
	async.forEachSeries(plugins.stages, function(stage, next) {
		plugins.runner(stage, params)(next);
	},
	function (err) {
		if (err) { grunt.log.error(err); done(); }
		else { done(); }
	});
};