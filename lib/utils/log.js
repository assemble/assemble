/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var Logme = require('logme').Logme;
var _ = require('lodash');

var logger = module.exports = function(options) {
  options = _.extend({
    stream: process.stdout,
    theme: 'default',
    level: 'error'
  }, options);

  return new Logme(options);
};

logger.levels = {
  verbose: 'verbose',
  debug : 'debug',
  info : 'info',
  warning : 'warning',
  error : 'error',
  critical : 'critical'
};