'use strict';

var loaders = require('../loaders');

/**
 * Load built-in loaders
 */

module.exports = function base_(assemble) {
  assemble.loader('task', [loaders.task]);
};
