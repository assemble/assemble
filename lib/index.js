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

function Env(options) {
  Assemble.call(this);
  this.init(options);
}

util.inherits(Env, Assemble);


/**
 * Expose `assemble.Env`
 */

Env.prototype.Env = Env;


/**
 * Expose constructors.
 */

// exports.Route = Route;
// exports.Router = Router;


/**
 * Initialize `Env`
 */

module.exports = new Env();
