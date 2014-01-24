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
var yfm = require('yfm');

// Local
var File = require('../models/file');

var fileUtil = module.exports = {};

var loadFile = function(src) {
	var fileInfo = new File();
	fileInfo.src = src;
	fileInfo.stats = file.getStatsSync(src);
	fileInfo.raw = file.readFileSync(src);
	return fileInfo;
};

var loadFileFromRecord = function (record) {
	var fileInfo = new File();
	fileInfo.src = record.src;
	fileInfo.type = record.type;
	fileInfo.stats = record.stats;
	fileInfo.raw = record.raw;
	fileInfo.metadata = record.metadata;
	fileInfo.content = record.content;
	return fileInfo;
};

fileUtil.load = function (assemble, src, options, done) {
	
	var metadata = assemble.metadata;
	var defaults = {
		type: 'page',
		newer: true
	};

	var opts = _.extend({}, options, defaults);

	var fileInfo = null;

	if (opts.newer) {
		metadata.getFile(src, function (err, record) {
			if (err) { return done(err); }
			if (record) {
				file.getStats(src, function (err, stats) {
					if (err) { return done(err); }
					if (record.file.mtime >= stats.mtime) {
						fileInfo = loadFileFromRecord(record.file);
						return done(null, fileInfo);
					}
				});
			}
		});
	}

	fileInfo = loadFile(src);
	fileInfo.type = opts.type;

	var extracted = yfm(fileInfo.raw, {read:false});
	fileInfo.metadata = extracted.context;
	fileInfo.content = extracted.content;

	metadata.setFile(src, fileInfo, function () {
		return done(null, fileInfo);
	});

};