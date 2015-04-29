'use strict';

var middleware = require('../middleware/');

/**
 * Load default routes and middleware
 */

module.exports = function middleware_(assemble) {
  assemble.onLoad(/./, middleware.props);
  assemble.onLoad(/./, middleware.parse);
  assemble.preRender(/./, middleware.assets(assemble));
  assemble.postRender(/./, middleware.diff(assemble));
};
