'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Lazily required module dependencies
 * (we temporarily re-assign require to trick
 * browersify into recognizing lazy deps)
 */

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
