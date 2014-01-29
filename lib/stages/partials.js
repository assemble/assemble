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
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function(assemble) {

	var fileInfo = assemble.utils.file;
	var models = assemble.models;

	return function(next) {
		assemble.log.info('Running partials steps');

		var params = {};
		var notify = notifier(assemble, params);

		params.partials = assemble.options.partials;

		async.series([
				notify(events.assembleBeforePartials),
				function (done) {
					assemble.log.info('Doing some partials work here.');

					assemble.partials = assemble.partials || {};

					async.each(
						params.partials,
						function (src, next) {
							assemble.log.debug('Loading Partial File', src);

							var options = {
								type: models.FileTypes.PARTIAL,
								newer: true
							};

							fileInfo.load(assemble, src, options, function (err, partialFile) {
								assemble.partials[partialFile.src] = partialFile;
								next();
							});

						},
						done
					);
				},
				notify(events.assembleAfterPartials)
			],
			next
		);
	};
};