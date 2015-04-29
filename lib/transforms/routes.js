'use strict';

var middleware = require('../middleware/');

/**
 * Load default routes and middleware
 */

module.exports = function routes_(assemble) {
  assemble.onLoad(/./, middleware.props);
  assemble.onLoad(/./, middleware.parse);
  assemble.preRender(/./, middleware.assets(assemble));
};
