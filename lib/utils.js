'use strict';

var path = require('path');
var utils = module.exports = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('base-questions', 'questions');
require('cross-spawn', 'spawn');
require('fs-exists-sync', 'exists');
require('global-modules', 'gm');
require('log-utils', 'log');
require('parser-front-matter', 'matter');
require('resolve-dir');
require = fn;

/**
 * Expose methods from log-utils
 */

utils.colors = utils.log.colors;

/**
 * Cast `val` to an array
 */

utils.arrayify = function(val) {
  return [].concat(val || []);
};

/**
 * Create a regex for matching file extensions
 */

utils.extRegex = function(exts) {
  return new RegExp('\\.(' + utils.arrayify(exts).join('|') + ')$');
};

/**
 * Get a home-relative filepath
 */

utils.homeRelative = function(fp) {
  var dir = path.resolve(utils.resolveDir(fp));
  var home = path.resolve(utils.resolveDir('~/'));
  fp = path.relative(home, dir);
  if (fp.charAt(0) === '/') {
    fp = fp.slice(1);
  }
  return fp;
};

/**
 * Get formatted cwd path
 */

utils.formatDir = function(cwd) {
  return utils.colors.yellow('~/' + utils.homeRelative(cwd));
};
