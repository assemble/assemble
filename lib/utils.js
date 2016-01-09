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
require('parser-front-matter', 'matter');
require('base-config', 'config');
require('base-argv', 'argv');
require('base-cli', 'cli');

// other
require('find-pkg');
require('global-modules', 'gm');
require('mixin-deep', 'merge');
require('isobject', 'isObject');
require('word-wrap', 'wrap');
require('matched', 'glob');
require('resolve-dir');
require('try-open');
require('opn');

// CLI
require('success-symbol');
require('ansi-colors', 'colors');
require('time-stamp', 'stamp');
require('expand-args');
require = fn;

/**
 * Green checkmark
 *
 * @return {String}
 */

utils.processArgv = function(app, argv) {
  var args = app.processArgv(argv);
  var opts = utils.merge({}, args, args.options, args.commands);
  app.option(opts);
  return opts;
};

/**
 * Get a home-relative filepath
 */

utils.homeRelative = function(root, fp) {
  var dir = path.resolve(utils.resolveDir(fp));
  var fp = path.relative(root, dir);
  return utils.colors.green('~/' + fp);
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

utils.exists = function exists(fp) {
  return utils.tryOpen(fp, 'r');
};

utils.arrayify = function arrayify(val) {
  if (!val) return val;
  return Array.isArray(val) ? val : [val];
};

utils.extRegex = function extRegex(exts) {
  return new RegExp('\\.(' + utils.arrayify(exts).join('|') + ')$');
};

/**
 * Try to require a file
 */

utils.tryRequire = function tryRequire(name) {
  try {
    return require(name);
  } catch (err) {}

  try {
    return require(path.resolve(name));
  } catch (err) {}
  return {};
};

utils.tryResolve = function tryResolve(name) {
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
