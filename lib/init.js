'use strict';

var init = require('./transforms/');

/**
 * Load initialization transforms
 *  | config
 *  | engines
 */

module.exports = function init_(assemble) {
  assemble.transform('argv', init.argv);
  assemble.transform('runner', init.runner);
  assemble.transform('config', init.config);
  assemble.transform('engines', init.engines);
};
