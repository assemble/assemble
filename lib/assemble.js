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

/**
 * Main Class for Assemble. Also assigning this to a property
 * on the assemble object so it can be used to new up
 * an instance of Assemble directly if wanted.
 *
 * WARNING - directly calling new assemble.Assemble() with
 * overwrite existing metadata stored if given a name that exists
 * and will not affect/use the Assemble object with the given name
 * from the instance cache
 * 
 * @param {[type]} name    optional name of the instance - defaults to default
 * @param {[type]} options options
 */
var Assemble = assemble.Assemble = function(name, options) {

  if(typeof name === 'object') {
    options = name;
    name = 'default';
  }

  this.name = name || 'default';
  this.metadatastore = utils.data.loadDatastore(name + '-metadata');
  this.options = options || {};
  this.components = [];
  this.pages = [];

};


assemble.utils = require('./utils');
assemble.models = require('./models');

assemble.instanceCache = {};

assemble.byName = function(name, options) {
  if(typeof name === 'object') {
    options = name;
    name = 'default';
  }
  name = name || 'default';
  return this.instanceCache[name] = this.instanceCache[name] || new Assemble(name, options);
};


Assemble.prototype.build = function(callback) {
  callback();
};
