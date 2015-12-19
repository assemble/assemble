'use strict';

var defaults = require('object.defaults');

/**
 * Load Assemble's default template types.
 */

module.exports = function templates_(assemble) {
  var opts = assemble.option('defaults');
  assemble.create('page', defaults({ isRenderable: true, isPartial: false }, opts));
  assemble.create('layout', defaults({ isLayout: true }, opts));
  assemble.create('partial', defaults({ isPartial: true }, opts));
};
