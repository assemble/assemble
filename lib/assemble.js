/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

/**
 * Use the main assemble method to get an instance
 * of the assemble builder. This allows us to create
 * multiple instances with it's own data so we can
 * use in unit testing. This also allows getting an
 * instance by name so we can use in other libraries
 * 
 * @param  {String} name    name of instance to create/get - defaults to 'default'
 * @param  {Object} options options passed to the assemble instance when creating
 * @return {Object}         an instance of Assemble
 */
var assemble = module.exports = function(name, options) {
  return assemble.byName(name, options);
};

var utils = assemble.utils = require('./utils');
var models = assemble.models = require('./models');

/**
 * Store a cache of the instances by name to
 * retrieve later. This is useful in unit testing.
 * @type {Object}
 */
assemble.instanceCache = {};

/**
 * Main Class for Line. Also assigning this to a property
 * on the assemble object so it can be used to new up
 * an instance of Line directly if wanted.
 *
 * WARNING - directly calling new assemble.Line() with
 * overwrite existing metadata stored if given a name that exists
 * and will not affect/use the Line object with the given name
 * from the instance cache
 * 
 * @param {[type]} name    optional name of the instance - defaults to default
 * @param {[type]} options options
 */
var Line = assemble.Line = function(name, options) {

  if(typeof name === 'object') {
    options = name;
    name = 'default';
  }

  this.name = name || 'default';
  this.metadata = new models.Metadata({ name: this.name });
  this.options = options || {};
  this.components = [];

};

/**
 * Retrieve an instance of Line by the given
 * name. If one doesn't exist, create a new instance
 * and store it for later use.
 * 
 * @param  {String} name    name of the instance to get or create
 * @param  {Object} options options passed into the Line constructor
 * @return {Object}         an instance of Line
 */
assemble.byName = function(name, options) {
  if(typeof name === 'object') {
    options = name;
    name = 'default';
  }
  name = name || 'default';
  return this.instanceCache[name] = this.instanceCache[name] || new Line(name, options);
};


Line.prototype.build = function(callback) {
  callback();
};
