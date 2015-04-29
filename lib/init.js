'use strict';

var init = require('./transforms/');

/**
 * Load initialization transforms
 *  | config
 *  | engines
 */

module.exports = function init_(assemble) {
  assemble.transform('pkg', init.pkg);
  assemble.transform('runner', init.runner);

  assemble.transform('argv', init.argv);
  assemble.transform('config', init.config);
  assemble.transform('engines', init.engines);
  console.log(assemble)
};
