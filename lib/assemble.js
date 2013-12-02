/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

var assemble = module.exports = {};

assemble.utils = require('./utils');
assemble.models = require('./models');

assemble.options = {};

assemble.components = [];
assemble.pages = [];

assemble.init = function(options) {

  this.metadatastore = utils.data.loadDatastore('metadata');

  this.options = options || {};
  this.components = [];
  this.pages = [];

  return this;
};

assemble.build = function(callback) {

  callback();

};

