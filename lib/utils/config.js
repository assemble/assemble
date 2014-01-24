/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var path = require('path');
var fs = require('fs');

// node_modules
var grunt = require('grunt');


// The module to be exported.
var config = module.exports = {};



/**
 * Get data from config property. Will normalize
 * and get data from Objects, Arrays and Strings
 */

config.getData = function(data) {
  //
};


/**
 * Process Context
 * @param  {[type]} context [description]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */

config.processContext = function(context, data) {
  grunt.config.data = _.extend({}, grunt.config.data, context, data);
  return grunt.config.process(data || context);
};


