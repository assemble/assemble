/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js

// node_modules
var grunt = require('grunt');
var _ = require('lodash');

// The module to be exported.
var config = module.exports = {};


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


