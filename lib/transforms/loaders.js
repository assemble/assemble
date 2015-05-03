'use strict';

var task = require('init-file-loader');

/**
 * Load built-in loaders
 */

module.exports = function(assemble) {
  assemble.loader('task', [task]);
};
