'use strict';

var utils = require('../utils');

/**
 * Extend the Assemble prototype with vinyl-fs methods
 */

module.exports = function () {
  return function (app) {
    app.visit('mixin', utils.vfs);
    var dest = this.dest;

    this.mixin('dest', function (dir) {
      if (!dir) {
        throw new TypeError('expected dest to be a string or function.');
      }
      return dest.apply(this, arguments);
    });
  };
};
