'use strict';

var util = require('util');
var Config = require('./config');


/**
 * ## Assemble
 *
 * >
 *
 * **Params:**
 */

function Assemble() {
  Config.call(this);
}

util.inherits(Assemble, Config);


/**
 * Expose `assemble.Assemble`
 */

Assemble.prototype.Assemble = Assemble;


/**
 * Initialize `Assemble`
 */

module.exports = new Assemble();
