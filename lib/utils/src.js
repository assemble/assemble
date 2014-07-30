'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var defaults = require('../defaults/plugins');
var initPlugins = require('./init-plugins');


/**
 * `src` plugin
 */

module.exports = function(glob, options) {
  options = _.extend({}, this.options, options);
  // options = _.extend(this.options, options);
  var plugins = defaults.src(this, options);
  return initPlugins.call(this, plugins);
};