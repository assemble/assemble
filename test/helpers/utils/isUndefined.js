/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */


var utils = require('./utils');

/**
 * isUndefined
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
module.exports = function (value) {
  'use strict';
  /*jshint eqnull: true */
  return value === 'undefined' || utils.toString.call(value) === '[object Function]' || (value.hash != null);
};