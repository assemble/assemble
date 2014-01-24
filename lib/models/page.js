/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var utils = require('../utils');

var properties = {
  src: ''
};

var Component = require('./component');
module.exports = utils.model.inherit(Component, properties);

