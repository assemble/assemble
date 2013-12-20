/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var assemble = require('../../assemble');

var options = {
	stages: [
		assemble.utils.plugins.stages.optionsPreConfiguration,
		assemble.utils.plugins.stages.optionsPostConfiguration,
		'assemble:*:pages'
	]
};

var plugin = module.exports = function (params, next) {
	console.log('Options Plugin', params.stage);
	next();
};

plugin.options = options;