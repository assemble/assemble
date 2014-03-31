/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node modules
var matter = require('gray-matter');
var file = require('fs-utils');
var _ = require('lodash');

// local modules
var utils = require('../utils');
var Base = require('./base');
var Component = module.exports = utils.model.inherit(Base);

Component.prototype.initialize = function (options) {
  this.options = options || {};
  this.metadata = {};
  this.content = this.options.content || '';
  this.raw = this.options.raw || '';
};


// static methods
Component.readFile = function (source, type, callback) {

  if (typeof type === 'function') {
    callback = type;
    type = 'component';
  }

  type = type || 'component';

  if (typeof callback === 'undefined') {
    callback = function (err, component) {
      if (err) {
        throw new Error(err);
      }
      return component;
    };
  }

  // load the actual component
  var options = {};
  options.stats = file.getStatsSync(source);
  options.src = source;
  options.type = type;

  // if this is a data file, load it with file.readData
  if (type === 'data') {
    options.raw = file.readDataSync(source);
  } else {
    options.raw = file.readFileSync(source);
    // extract any front matter
    var extracted = matter(options.raw);
    options.metadata = extracted.context;
    options.content = extracted.content;
  }
  var component = new Component(options);
  component.metadata = _.merge(component.metadata, _.omit(component.options, ['metadata']));

  return callback(null, component);
};


