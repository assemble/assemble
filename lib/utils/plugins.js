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
		plugin.options = plugin.options || {};
		plugin.options.stage = plugin.options.stage || (plugin.options.stage = plugin.options.stages || plugins.stages.renderPrePage);
	});
	return actualPlugins;
};

plugins.runner = function (stage, params) {
	params.stage = stage;
	var line = params.line;
	var isStageMatch = function (a, b) {
		return (a === b) || a === '*';
	};

	var pluginsOfType = _.filter(line.plugins, function (plugin) {
		var pluginStages = plugin.options.stage || plugin.options.stages || [];
		if (!_.isArray(pluginStages)) {
			pluginStages = [pluginStages];
		}

		var stageParts = stage.split(':');
		var isMatch = false;
		_.map(pluginStages, function(pluginStage) {
			var pluginParts = pluginStage.split(':');
			isMatch = isMatch || (isStageMatch(pluginParts[0], stageParts[0]) &&
														isStageMatch(pluginParts[1], stageParts[1]) &&
														isStageMatch(pluginParts[2], stageParts[2]));
		});
		return isMatch;
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

plugins.stages = {
	optionsPreConfiguration: 'options:pre:configuration',
	optionsPostConfiguration: 'options:post:configuration',
	assemblePreLayout: 'assemble:pre:layout',
	assemblePostLayout: 'assemble:post:layout',
	assemblePrePartials: 'assemble:pre:partials',
	assemblePostPartials: 'assemble:post:partials',
	assemblePreData: 'assemble:pre:data',
	assemblePostData: 'assemble:post:data',
	assemblePrePages: 'assemble:pre:pages',
	assemblePrePage: 'assemble:pre:page',
	assemblePostPage: 'assemble:post:page',
	assemblePostPages: 'assemble:post:pages',
	renderPrePages: 'render:pre:pages',
	renderPrePage: 'render:pre:page',
	renderPostPage: 'render:post:page',
	renderPostPages: 'render:post:pages'
};

plugins.run = function(params, done) {
	async.forEachSeries(_.keys(plugins.stages), function(stage, next) {
		plugins.runner(plugins.stages[stage], params)(next);
	},
	function (err) {
		if (err) { grunt.log.error(err); done(); }
		else { done(); }
	});
};