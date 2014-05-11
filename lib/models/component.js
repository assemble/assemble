/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node modules
var _ = require('lodash');

// local modules
var utils = require('../utils');
var Base = require('./base');
var Component = module.exports = utils.model.inherit(Base);

Component.prototype.initialize = function (config) {
  var _config = _.extend({}, config);
  this.type = _config.type || 'component';
  this._id = _config._id || _config.name || _config.src || utils.component.generateName(this.type);
  this.data = _config.data || _config.metadata || {};
  this.content = _config.content || '';
  this.orig = _config.orig || _config.content || '';
};


