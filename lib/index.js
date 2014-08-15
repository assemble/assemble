'use strict';

var util = require('util');
var Env = require('./assemble');


/**
 * ## Assemble
 *
 * >
 *
 * **Params:**
 */

function Assemble(options) {
  Env.call(this);
  this.init(options);
}

util.inherits(Assemble, Env);


/**
 * Expose `assemble.create()`
 */

Assemble.prototype.create = function (options) {
  return new Assemble(options);
};


/**
 * Expose routes.
 */

// exports.Route = Route;
// exports.Router = Router;


/**
 * Initialize `Assemble`
 */

module.exports = new Assemble();
