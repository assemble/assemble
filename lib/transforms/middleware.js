'use strict';

var middleware = require('../middleware/');

/**
 * Load default routes and middleware
 */

module.exports = function middleware_(assemble) {
  assemble.onLoad(/./, middleware.data);
  assemble.onLoad(/./, middleware.src);
  assemble.onLoad(/./, middleware.parse);
  assemble.onLoad(/./, middleware.ext);
  assemble.onLoad(/./, middleware.page);

  assemble.preRender(/./, middleware.assets(assemble));
  assemble.postRender(/./, middleware.diff(assemble));
};
