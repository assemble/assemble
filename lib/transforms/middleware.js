'use strict';

var middleware = require('../middleware/');
var utils = require('middleware-utils')

/**
 * Load default routes and middleware
 */

module.exports = function middleware_(assemble) {
  assemble.onLoad(/./, middleware.data, utils.error('onLoad data'));
  assemble.onLoad(/./, middleware.src, utils.error('onLoad src'));
  assemble.onLoad(/./, middleware.parse, utils.error('onLoad parse'));
  assemble.onLoad(/./, middleware.ext, utils.error('onLoad ext'));
  assemble.onLoad(/./, middleware.page, utils.error('onLoad page'));

  assemble.preRender(/./, middleware.assets(assemble), utils.error('preRender'));
  assemble.postRender(/./, middleware.diff(assemble), utils.error('postRender'));
};
