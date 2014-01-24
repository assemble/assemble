/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var events = require('events');
var utils = require('../utils');

module.exports = utils.model.inherit(events.EventEmitter);