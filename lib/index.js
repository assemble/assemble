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
 * Expose `assemble.create()`
 */

Env.prototype.create = function (options) {
  return new Env(options);
};


/**
 * Expose routes.
 */

// exports.Route = Route;
// exports.Router = Router;


/**
 * Initialize `Env`
 */

module.exports = new Env();
