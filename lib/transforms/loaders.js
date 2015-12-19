'use strict';

var loader = require('init-file-loader');

/**
 * Load built-in loaders
 */

module.exports = function(assemble) {
  assemble.loader('task', [loader]);
};
