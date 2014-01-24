/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

var async = require('async');

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
						assemble.pages,
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