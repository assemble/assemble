'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('parser-front-matter', 'matter');
require('fs-exists-sync', 'exists');
require('global-modules', 'gm');
require('isobject', 'isObject');
require('mixin-deep', 'merge');
require('resolve-dir');
require('tableize-object', 'tableize');
require('log-utils', 'log');
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
  var root = path.resolve(utils.resolveDir('~/'));
  fp = path.relative(root, dir);
  if (fp.charAt(0) === '/') {
    fp = fp.slice(1);
  }
  return fp;
};

/**
 * Get formatted cwd path
 */

utils.formatDir = function(cwd) {
  var fp = utils.homeRelative(cwd);
  if (cwd.charAt(0) === '/') {
    cwd = cwd.slice(1);
  }
  return utils.colors.yellow('~/' + fp);
};

/**
 * Green checkmark
 *
 * @return {String}
 */

utils.success = function() {
  return utils.colors.green(utils.successSymbol);
};

/**
 * Create a formatted timestamp
 *
 * @param {String} msg
 * @return {String}
 */

utils.timestamp = function(msg, stamp) {
  var args = [].slice.call(arguments);
  args.unshift(utils.log.timestamp);
  console.log.apply(console, args);
};

/**
 * Log out a custom, time-stamped message to indicate that a task is starting.
 */

utils.logTask = function(appname, taskname) {
  utils.timestamp('starting ' + utils.colors.cyan(appname + taskname));
};

/**
 * Try to require a file
 */

utils.tryRequire = function(name) {
  try {
    return require(name);
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
  }
  try {
    return require(path.resolve(name));
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
  }
};

/**
 * Try to call `require.resolve` on a filepath
 */

utils.tryResolve = function(name) {
  try {
    return require.resolve(name);
  } catch (err) {}

  try {
    return require.resolve(path.resolve(name));
  } catch (err) {}

  try {
    return require.resolve(path.resolve(process.cwd(), name));
  } catch (err) {}

  try {
    return require.resolve(path.resolve(utils.gm, name));
  } catch (err) {}
};

/**
 * Expose `utils`
 */

module.exports = utils;
