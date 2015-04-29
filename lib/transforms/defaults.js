'use strict';

var path = require('path');

/**
 * Set Assemble's default options.
 *
 * Initialized in the `init` transform.
 */

module.exports = function defaults_(assemble) {
  assemble.option('env', process.env.NODE_ENV || 'dev');
  assemble.option('assets', 'assets');
  assemble.option('viewEngine', '.hbs');
  assemble.option('defaults', {
    isRenderable: true,
    isPartial: true
  });

  // file extensions
  assemble.option('engineExts', ['hbs', 'md']);
  assemble.option('destExt', '.html');
  assemble.option('ext', '.hbs');

  // view defaults
  assemble.option('delims', ['{{', '}}']);
  assemble.disable('default engines');
  assemble.disable('default routes');

  // routes
  assemble.enable('case sensitive routing');
  assemble.enable('strict routing');

  assemble.option('renameKey', function(filepath) {
    return path.basename(filepath, path.extname(filepath));
  });
};
