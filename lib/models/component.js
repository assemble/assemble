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
  var c = _.extend({}, config);
  this.type = c.type || 'component';
  this._id = c._id || c.name || c.src || utils.component.generateName(this.type);
  this.data = c.data || c.metadata || {};
  this.content = c.content || '';
  this.orig = c.orig || c.content || '';
};


