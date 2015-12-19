'use strict';

var path = require('path');
var utils = require('../utils');

/**
 * Ensure that `ext` is on the file object.
 */

module.exports = function(file, next) {
  if (!file.hasOwnProperty('data') || !file.data.hasOwnProperty('src')) {
    throw new Error('ext middleware: file object should have `data.src` property.');
  }

  file.ext = file.ext || file.data.src.ext || path.extname(file.path);

  if (typeof file.ext === 'string') {
    file.ext = utils.formatExt(file.ext);
  }
  next();
};
