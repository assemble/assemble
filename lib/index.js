'use strict';

var util = require('util');
var Assemble = require('./assemble');


/**
 * ## Env
 *
 * >
 *
 * **Params:**
 */

function Env() {
  Assemble.call(this);
  this.init();
}

util.inherits(Env, Assemble);


/**
 * Expose `assemble.Env`
 */

Env.prototype.Env = Env;


/**
 * Initialize `Env`
 */

module.exports = new Env();
