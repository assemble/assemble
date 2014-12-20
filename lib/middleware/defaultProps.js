'use strict';

/**
 * Extend the `file` object with Assemble's default
 * template properties.
 *
 * @name  defaultProps
 * @param {Object} `assemble` the current instance of assemble
 * @api public
 */

module.exports = function (/*assemble*/) {
  return function parse (file) {
    var tutils = require('template-utils');
    tutils.defaultProps(file);
  };
};
