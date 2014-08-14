'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');


/**
 * ## .extendFile
 *
 * Extends default assemble properties onto the `file` object.
 *
 *   - `data`: {Object}
 *   - `assets`: {String} User-defined `assets` directory.
 *   - `layout`: {String} User-defined layout to use for the current file.
 *
 * @param {Object} Initial `file` object
 * @param {Object} `options`
 * @return {Object} Extended `file` object
 */

module.exports = function extendFile(file, encoding, options) {
  var opts = _.extend({}, options);
  file.data = file.data || {};

  file.layout = file.layout || file.data.layout;
  return file;
};
