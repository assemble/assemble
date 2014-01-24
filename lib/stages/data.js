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


module.exports = function (assemble) {

	return function(next) {
		assemble.log.info('Running data steps');

		var params = {};
		var notify = notifier(assemble, params);

		async.series([
				notify(stages.assembleBeforeData),
				function (done) {
					assemble.log.info('Doing some data work here.');
					done();
				},
				notify(stages.assembleAfterData)
			],
			next
		);
	};
};