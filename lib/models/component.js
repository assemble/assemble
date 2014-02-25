/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var utils = require('../utils');
var Base = require('./base');
var Component = module.exports = utils.model.inherit(Base);

Component.prototype.initialize = function (options) {
  this.options = options || {};
  this.metadata = {};
  this.content = this.options.content || '';
  this.raw = this.options.raw || '';
};