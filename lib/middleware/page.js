'use strict';

/**
 * Extend the `file` object with Assemble's default
 * template properties.
 */

module.exports = function(file, next) {
  file.data.page = file.data.page || {};
  next();
};
