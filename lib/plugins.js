'use strict';

var plugins = require('lazy-cache')(require);
var fn = require;
require = plugins;

/**
 * Lazily required module dependencies
 */

require('assemble-loader', 'loader');
require('base-argv', 'argv');
require('base-cli-process', 'cli');
require('base-config', 'config');
require('base-runtimes', 'runtimes');
require = fn;

/**
 * Expose `plugins`
 */

module.exports = plugins;
