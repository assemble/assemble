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
		assemble.log.info('Running build pages steps');

		var params = {};
		var notify = notifier(assemble, params);

		async.series([
				notify(stages.assembleBeforePages),
				function (done) {
					assemble.log.info('Doing some pages work here.');
					async.eachSeries(
						assemble.options.files,
						function (page, nextPage) {
							async.series([
								notify(stages.assembleBeforePage),
								function (donePage) {
									assemble.log.info('Doing some page work here.');
									donePage();
								},
								notify(stages.assembleAfterPage)
								],
								nextPage
							);
						},
						done
					);
				},
				notify(stages.assembleAfterPages)
			],
			next
		);
	};
};