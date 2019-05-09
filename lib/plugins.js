'use strict';

var utils = require('./utils');
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
 * Add logging methods
 */

plugins.logger = function(options) {
  return function() {
    if (!utils.isValid(this, 'assemble-logger')) return;
    function logger(prop, color) {
      color = color || 'dim';
      return function(msg) {
        var rest = [].slice.call(arguments, 1);
        return console.log
          .bind(console, utils.log.timestamp + (prop ? (' ' + utils.log[prop]) : ''))
          .apply(console, [utils.log[color](msg)].concat(rest));
      };
    };

    Object.defineProperty(this, 'log', {
      configurable: true,
      get: function() {
        function log() {
          return console.log.apply(console, arguments);
        }
        log.path = function(msg) {
          return logger().apply(null, arguments);
        };
        log.time = function(msg) {
          return logger().apply(null, arguments);
        };
        log.warn = function(msg) {
          return logger('warning', 'yellow').apply(null, arguments);
        };
        log.success = function() {
          return logger('success', 'green').apply(null, arguments);
        };

        log.info = function() {
          return logger('info', 'cyan').apply(null, arguments);
        };

        log.error = function() {
          return logger('error', 'red').apply(null, arguments);
        };
        log.__proto__ = utils.log;
        return log;
      }
    });
  };
};

/**
 * Expose `plugins`
 */

module.exports = plugins;
