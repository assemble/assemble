/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var Logme = require('logme').Logme;
var _ = require('lodash');

var logger = module.exports = function(options) {
	options = _.extend({
		stream: process.stdout,
		theme: 'default',
		level: 'error'
	}, options);

	return new Logme(options);
};

logger.levels = {
 debug : 'debug',
 info : 'info',
 warning : 'warning',
 error : 'error',
 critical : 'critical'
};