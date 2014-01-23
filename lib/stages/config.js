/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

module.exports = function(assemble) {
	return function(next) {
		// do some stuff
		assemble.log.info('Running config steps');
		next();
	};
};