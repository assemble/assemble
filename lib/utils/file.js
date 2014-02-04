/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var file = require('fs-utils');
var _ = require('lodash');
var matter = require('gray-matter');

// Local
var File = require('../models/file');

var fileUtil = module.exports = {};

var defaults = {

	loader: function (metadata) {

		return function (fileObj, key, done) {

			file.getStats(key, function (err, stats) {
				if (err) { return done(err); }

				if (fileObj.mtime >= stats.mtime) {
					// if the record is newer than the file system
					// file, use the stored record
					return done(null, fileObj);
				} else {

					// load the file from the file system
					fileObj = defaults.loadFile(fileObj, key);

					// extract any front matter
					var extracted = matter(fileObj.raw);
					fileObj.metadata = extracted.context;
					fileObj.content = extracted.content;

					// store the file
					metadata.setFile(key, fileObj, function () {
						return done(null, fileObj);
					});

				}
			});

		};

	},

	// default way to load file from the file system.
	loadFile: function(fileObj, src) {
		fileObj.src = src;
		fileObj.stats = file.getStatsSync(src);
		fileObj.raw = file.readFileSync(src);
		return fileObj;
	}

};

fileUtil.load = function (assemble, key, options, done) {
	
	var metadata = assemble.metadata;
	var opts = _.extend({}, options, {
		type: 'page'
	});

	opts.loader = opts.loader || defaults.loader(metadata);

	var fileInfo = new File();
	fileInfo.type = opts.type;

	metadata.getFile(key, function (err, record) {
		if (err) { return done(err); }
		if (record) {
			// if there's a saved record of the file,
			// pass it along to the loader to handle it
			return opts.loader(record.file, key, done);
		}

		// if there isn't a saved record
		// pass the empty object to the loader
		return opts.loader(fileInfo, key, done);
	});

};