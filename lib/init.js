'use strict';

var init = require('./transforms/');

/**
 * Load initialization transforms
 *  | config
 *  | metadata
 *  | defaults
 *  | engines
 *  | plugins
 *  | templates
 *  | middleware
 */

module.exports = function init_(assemble) {
  assemble.transform('argv', init.argv);
  assemble.transform('config', init.config);
  assemble.transform('metadata', init.metadata);
  assemble.transform('defaults', init.defaults);
  assemble.transform('runner', init.runner);

  assemble.transform('templates', init.templates);
  assemble.transform('plugins', init.plugins);
  assemble.transform('middleware', init.middleware);
  assemble.transform('engines', init.engines);
};
