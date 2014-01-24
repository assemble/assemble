/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

var stages = module.exports = {};

stages.config = require('./config');
stages.buildLayout = require('./buildLayout');
stages.partials = require('./partials');
stages.data = require('./data');
stages.buildPages = require('./buildPages');
stages.renderPages = require('./renderPages');


stages.done = require('./done');