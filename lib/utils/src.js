'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var defaults = require('../defaults/default-plugins');
var createStack = require('./create-stack');


/**
 * `src` plugin
 */

module.exports = function(glob, options) {
  options = _.extend(this.options, options);
  var plugins = defaults.src(this, options);
  return createStack.call(this, plugins);
};