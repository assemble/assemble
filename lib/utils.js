'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;
require('assemble-loader', 'loader');
require('parser-front-matter', 'matter');
require = fn;

/**
 * Utils
 */

utils.arrayify = function(val) {
  return Array.isArray(val) ? val : [val];
};

utils.extRegex = function(exts) {
  return new RegExp('\\.(' + utils.arrayify(exts).join('|') + ')$');
};

/**
 * Expose `utils`
 */

module.exports = utils;
