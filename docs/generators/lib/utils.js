'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('base-fs-conflicts', 'conflicts');
require('extend-shallow', 'extend');
require('kind-of', 'typeOf');
require('match-file', 'match');
require('minimist');
require('mixin-deep', 'merge');
require('through2', 'through');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
