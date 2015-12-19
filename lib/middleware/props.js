'use strict';

/**
 * Extend the `file` object with Assemble's default
 * template properties.
 */

module.exports = function(file, next) {
  require('template-utils').defaultProps(file);
  next();
};
