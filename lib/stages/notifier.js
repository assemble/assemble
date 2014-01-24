/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

module.exports = function(assemble, params) {
	return function (stage) {
		return function (next) {
			assemble.dovetail.runStage(stage, params, next);
		};
	};
};