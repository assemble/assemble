'use strict';

/**
 * Prime the `assemble.cache.argv` object, which allows
 * using command line arguments as options.
 *
 * Initialized in the `init` transform.
 */

module.exports = function argv_(assemble) {
  assemble.cache.argv = assemble.cache.argv || {};
};
