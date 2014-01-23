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
	return function(err) {
		if (err) {
			return assemble.log.error(err);
		}
		assemble.log.info('Finished running assemble.');
	};
};