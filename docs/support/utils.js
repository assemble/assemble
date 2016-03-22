'use strict';

var placeholders = require('placeholders');

var utils = module.exports = require('../../lib/utils');

utils.versionPath = function(structure, data, opts) {
  return placeholders(opts)(structure, data);
};
