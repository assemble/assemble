'use strict';

var init = require('./transforms/');

/**
 * Load initialization transforms
 *  | config
 *  | engines
 */

module.exports = function init_(assemble) {
  assemble.transform('pkg', init.pkg);
  assemble.transform('argv', init.argv);
  assemble.transform('config', init.config);
  assemble.transform('runner', init.runner);
  assemble.transform('defaults', init.defaults);
  assemble.transform('templates', init.templates);
  assemble.transform('plugins', init.plugins);
  assemble.transform('middleware', init.middleware);
  assemble.transform('engines', init.engines);
};
