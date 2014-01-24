/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var stages = module.exports = {};

stages.config = require('./config');
stages.buildLayout = require('./buildLayout');
stages.partials = require('./partials');
stages.data = require('./data');
stages.buildPages = require('./buildPages');
stages.renderPages = require('./renderPages');


stages.done = require('./done');