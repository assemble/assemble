/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var stages = module.exports = {};

stages.config = require('./config');
stages.data = require('./data');
stages.partials = require('./partials');
stages.build = require('./build');
stages.render = require('./render');

stages.done = require('./done');