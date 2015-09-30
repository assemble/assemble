'use strict';

var utils = require('../utils');

/**
 * Extend the Assemble prototype with vinyl-fs methods
 */

module.exports = function () {
  return function (app) {
    app.visit('mixin', utils.vfs);
  };
};
