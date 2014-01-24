/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');

// Local libs
var config = require('../config');
var notifier = require('./notifier');

var stages = config.plugins.stages;

module.exports = function(assemble) {

	return function(next) {
		assemble.log.debug('Running config steps');

		var params = {};
		var notify = notifier(assemble, params);

		async.series([
				notify(stages.optionsBeforeConfiguration),
				function (done) {
					assemble.log.debug('Doing some configuration work here.');

					// setup the engine
					assemble.engine = assemble.render.engine.get(
						assemble, 
						assemble.options.engine || assemble.defaults.engine, 
						assemble.options
					);

					// setup register functions
					var registerHelpers = function (engine, helpers, done) { engine.registerHelpers(helpers, done); };
					assemble.options.registerFunctions = assemble.options.registerFunctions || registerHelpers;
					assemble.options.registerHelpers = assemble.options.registerFunctions;

					var registerPartials = function (engine, partials, done) { engine.registerPartials(partials, done); };
					assemble.options.registerPartials = assemble.options.registerPartials || registerPartials;

					// normalize file paths
					assemble.options.helpers = assemble.utils.resolve(assemble.options.helpers);
					assemble.options.partials = assemble.utils.resolve(assemble.options.partials);
					assemble.options.data = assemble.utils.resolve(assemble.options.data);

					// load any helper functions
					assemble.options.registerFunctions(
						assemble.engine, 
						assemble.options.helpers, 
						done
					);

				},
				notify(stages.optionsAfterConfiguration)
			],
			next
		);
	};
};