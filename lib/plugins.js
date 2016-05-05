'use strict';

var path = require('path');
var plugins = require('lazy-cache')(require);
var fn = require;
require = plugins;

/**
 * Lazily required module dependencies
 */

require('assemble-loader', 'loader');
require('base-argv', 'argv');
require('base-cli', 'cli');
require('base-config', 'config');
require('base-runtimes', 'runtimes');

/**
 * Expose `plugins`
 */

module.exports = plugins;
