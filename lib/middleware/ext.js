'use strict';

var path = require('path');

/**
 * Ensure that `ext` is on the file object.
 */

module.exports = function(file, next) {
  file.ext = file.ext || file.data.src.ext || path.extname(file.path);
  next();
};
