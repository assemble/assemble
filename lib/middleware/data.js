'use strict';

/**
 * Prime the `file.data` object.
 */

module.exports = function(file, next) {
  file.data = file.data || {};
  next();
};
