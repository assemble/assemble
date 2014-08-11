/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var EventEmitter2 = require('eventemitter2').EventEmitter2;


/**
 * ## Assemble events
 *
 * > The following events are used:
 *
 * **cache:**
 * - `set`
 * - `extend`
 * - `merge`
 * - `omit`
 * - `clear`
 *
 * **loader:**
 * - `loading`
 * - `loaded`
 */

function Event() {
  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: ':',
    newListener: false,
    maxListeners: 0
  });
}

util.inherits(Event, EventEmitter2);

module.exports = Event;
