/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */
'use strict';

var utils = module.exports = {};

var toString = function (val) {
  if (val == null) {
    return '';
  } else {
    return val.toString();
  }
};
utils.toString = Object.prototype.toString;

utils.lowerCase = function (str) {
  return toString(str).toLowerCase();
};

utils.isUndefined = function (value) {
  return value === 'undefined' || Object.toString.call(value) === '[object Function]' || (value.hash != null);
};