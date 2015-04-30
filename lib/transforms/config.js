'use strict';

var Store = require('data-store');
var args = require('./args');

/**
 * Initialize Assemble's global config store. The config store is best used
 * for persisting data that is reusable across projects.
 *
 * Initialized in the `init` transform.
 */

module.exports = function config_(assemble) {
  assemble.config = new Store('assemble');

  assemble.transform('set', args.set);
  assemble.transform('get', args.get);
  assemble.transform('del', args.del);
  assemble.transform('union', args.union);
};
