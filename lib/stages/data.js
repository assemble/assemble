/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var file = require('fs-utils');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function (assemble) {

	var fileInfo = assemble.utils.file;
	var models = assemble.models;
	var metadata = assemble.metadata;

	var loader = function (dataFile, src, done) {
		file.getStats(src, function (err, stats) {
			if (err) { return done(err); }

			if (dataFile.mtime >= stats.mtime) {
				// if the record is newer than the file system
				// file, use the stored record
				return done(null, dataFile);
			} else {

				// load the file from the file system
				//dataFile = defaults.loadFile(dataFile, src);
				dataFile.src = src;
				dataFile.stats = file.getStatsSync(src);
				dataFile.content = file.readDataSync(src);

				// store the file
				metadata.setFile(src, dataFile, function () {
					return done(null, dataFile);
				});

			}
		});
	};

	return function(next) {
		assemble.log.debug('Running data steps');

		var params = {};
		var notify = notifier(assemble, params);


		params.data = assemble.options.data;

		async.series([
				notify(events.assembleBeforeData),
				function (done) {
					assemble.log.debug('Doing some data work here.');

					assemble.data = assemble.data || [];

					async.each(
						params.data,
						function (src, next) {
							assemble.log.debug('Loading Data File', src);

							var options = {
								type: models.FileTypes.DATA,
								loader: loader
							};

							fileInfo.load(assemble, src, options, function (err, dataFile) {
								assemble.data.push(dataFile);
								next();
							});

						},
						done
					);
				},
				notify(events.assembleAfterData)
			],
			next
		);
	};
};