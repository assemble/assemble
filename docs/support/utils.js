'use strict';

var placeholders = require('placeholders');
var utils = require('../../lib/utils');

exports.exists = utils.exists;

exports.versionPath = function(structure, data, opts) {
  return placeholders(opts)(structure, data);
};
