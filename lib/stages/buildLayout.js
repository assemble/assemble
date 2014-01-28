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

var events = config.plugins.events;

module.exports = function(assemble) {

	return function(next) {
		assemble.log.info('Running build layout steps');

		var params = {};
		var notify = notifier(assemble, params);

		async.series([
				notify(events.assembleBeforeLayout),
				function (done) {
					assemble.log.info('Doing some layout work here.');
					done();
				},
				notify(events.assembleAfterLayout)
			],
			next
		);
	};
};