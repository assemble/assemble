/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

var notifier = module.exports = function(assemble, params) {
	return function (stage) {
		return function (next) {
			assemble.dovetail.runStage(stage, params, next);
		};
	};
};