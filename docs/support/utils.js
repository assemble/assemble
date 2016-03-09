'use strict';

var placeholders = require('placeholders');
var utils = require('../../lib/utils');

var support = module.exports;

support.exists = utils.exists;

support.versionPath = function(structure, data, opts) {
  return placeholders(opts)(structure, data);
};
