'use strict';

var path = require('path');

/**
 * Adds Assemble's package.json data to `assemble.pkg`.
 * Called in the `init` transform.
 */

module.exports = function pkg_(assemble) {
  Object.defineProperty(assemble, 'pkg', {
    get: function () {
      return require(path.resolve(__dirname, '../..', 'package.json'));
    },
    set: function () {
      console.log('`assemble.pkg` is read-only and should not be modified.');
    }
  });
};
