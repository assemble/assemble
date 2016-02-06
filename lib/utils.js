'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

// plugins, middleware or helpers
require('assemble-loader', 'loader');
require('base-argv', 'argv');
require('base-cli', 'cli');
require('base-config', 'config');
require('composer-runtimes', 'runtimes');
require('parser-front-matter', 'matter');

// other
require('global-modules', 'gm');
require('isobject', 'isObject');
require('mixin-deep', 'merge');
require('opn');
require('resolve-dir');
require('try-open');

// CLI
require('ansi-colors', 'colors');
require('success-symbol');
require('time-stamp', 'stamp');
require = fn;

/**
 * Green checkmark
 *
 * @return {String}
 */

utils.processArgv = function(app, argv) {
  app.option(app.argv(argv));
  return app.options;
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
  var time = '[' + utils.colors.gray(utils.stamp('HH:mm:ss', new Date())) + ']';
  console.log(time, msg);
};

/**
 * Log out a custom, time-stamped message to indicate that a task is starting.
 */

utils.logTask = function(appname, taskname) {
  utils.timestamp('starting ' + utils.colors.cyan(appname + taskname));
};

/**
 * Utils
 */

utils.exists = function(fp) {
  return fp && (typeof utils.tryOpen(fp, 'r') === 'number');
};

utils.arrayify = function(val) {
  if (!val) return val;
  return Array.isArray(val) ? val : [val];
};

utils.extRegex = function(exts) {
  return new RegExp('\\.(' + utils.arrayify(exts).join('|') + ')$');
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
 * Modified from the `tableize` lib, which replaces
 * dashes with underscores, and we don't want that behavior.
 * Tableize `obj` by flattening and normalizing the keys.
 *
 * @param {Object} obj
 * @return {Object}
 * @api public
 */

utils.tableize = function tableize(obj, opts) {
  var ret = {};
  opts = opts || {};
  type(ret, obj, '', opts);
  return ret;
};

/**
 * Type `obj` recursively.
 *
 * @param {Object} schema
 * @param {Object} obj
 * @param {String} prefix
 * @api private
 */

function type(schema, obj, prefix, opts) {
  Object.keys(obj).forEach(function(key) {
    var val = obj[key];

    key = prefix + key;
    if (opts.lowercase) key = key.toLowerCase();

    if (utils.isObject(val)) {
      type(schema, val, key + '.', opts);
    } else {
      schema[key] = val;
    }
  });
}

/**
 * Expose `utils`
 */

module.exports = utils;
