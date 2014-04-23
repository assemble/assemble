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
  this.options = _.cloneDeep(options || {});
  this.metadata = this.options.metadata || this.options.data || {};
  this.content = this.options.content || '';
  this.raw = this.options.raw || this.options.content || '';
  this.name = this.options.name || this.options.filename || '';
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

  var options = {};
  try {
    // load the actual component
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
  } catch (err) {
    console.log('error loading the component from source', source);
    return callback(err);
  }

  var component = new Component(options);
  component.metadata = _.merge(component.metadata, _.omit(component.options, ['metadata']));

  return callback(null, component);
};


