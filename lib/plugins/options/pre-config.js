/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var options = {
	stage: 'options:pre:configuration'
};

var plugin = module.exports = function (params, next) {
	console.log('Options Plugin', params.stage);
	next();
};

plugin.options = options;