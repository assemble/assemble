/**
 * assemble <http://assemble.io>
 *
 * copyright (c) 2014 jon schlinkert, brian woodward, contributors
 * licensed under the mit license (mit).
 */

'use strict';

// node modules
var matter = require('gray-matter');
var file = require('fs-utils');
var _ = require('lodash');

// locals
var Component = require('../models').Component;
var component = module.exports = {};

/*
 * Based on the given type, generate a unique
 * name (based on indices for that type
 */
component.generateName = function (type) {
  this.typeIndices = this.typeIndices || {};
  this.typeIndices[type] = this.typeIndices[type] || [];
  this.typeIndices[type] = +(this.typeIndices[type] || 0) + 1;
  return type + '_' + this.typeIndices[type];
};

component.expand = function (component) {
  // ensure the content and data are populated
  if (_.isEmpty(component.data) || _.isEmpty(component.content)) {
    var info = matter(component.orig);
    component.content = info.content;
    component.data = _.merge(component.data || {}, info.context);
  }
};

component.fromFile = function (source, type) {
  type = type || 'component';
  var config = {};

    // load the actual component
  try {
    var str = file.readFileSync(source);

    // Source filepath
    config.src = source;
    config.type = type;
    config.orig = str;

    // extract any front matter
    var parseString = matter(str);
    config.data = parseString.context;
    config.content = parseString.content;

  } catch (err) {
    console.log('error loading the component from source', source);
    throw err;
  }

  var component = new Component(config);
  component.data = _.merge(component.data, _.omit(component, ['data', 'orig']));
  return component;
};

