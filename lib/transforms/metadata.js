'use strict';

var path = require('path');

/**
 * Adds Assemble's package.json data to `assemble.metadata`.
 * Called in the `init` transform.
 */

module.exports = function metadata_(assemble) {
  Object.defineProperty(assemble, 'metadata', {
    get: function () {
      return require(path.resolve(__dirname, '../..', 'package.json'));
    },
    set: function () {
      console.log('`assemble.metadata` is read-only and should not be modified.');
    }
  });
};
