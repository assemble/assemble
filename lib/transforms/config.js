'use strict';

var Config = require('data-store');
var config = require('./config');

/**
 * Initialize a global config store, for persisting data
 * that may be reused across projects.
 *
 * Initialized in the `init` transform.
 */

module.exports = function config_(assemble) {
  assemble.config = new Config('assemble');

  assemble.transform('set', config.set);
  assemble.transform('get', config.get);
  assemble.transform('del', config.del);
  assemble.transform('union', config.union);
};
