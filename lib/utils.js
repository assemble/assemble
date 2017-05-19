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
require('expand-front-matter', 'expand');
require('global-modules', 'gm');
require('is-valid-app', 'isValid');
require('log-utils', 'log');
require('minimist', 'parse');
require('parser-front-matter', 'matter');
require('resolve-dir');
require = fn;

/**
 * Expose methods from log-utils
 */

utils.colors = utils.log.colors;

/**
 * argv options
 */

utils.opts = {
  alias: {
    add: 'a',
    config: 'c',
    configfile: 'f',
    global: 'g',
    help: 'h',
    init: 'i',
    silent: 'S',
    verbose: 'v',
    version: 'V',
    remove: 'r'
  }
};

/**
 * Parse args with `yargs-parser`
 */

utils.parseArgs = function(argv) {
  var obj = utils.parse(argv, utils.opts);
  if (obj.init) {
    obj._.push('init');
    delete obj.init;
  }
  if (obj.help) {
    obj._.push('help');
    delete obj.help;
  }
  return obj;
};

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
