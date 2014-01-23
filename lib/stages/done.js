/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

module.exports = function(assemble, callback) {
	return function(err, results) {
		if (err) {
			assemble.log.error(err);
			return callback(err);
		}
		assemble.log.info('Finished running assemble.');
		return callback();
	};
};