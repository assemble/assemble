/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var middleware = module.exports = {};

middleware.config = require('./config');
middleware.data = require('./data');
middleware.build = require('./build');
middleware.render = require('./render');
middleware.done = require('./done');