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
  Env.call(this, options);
}

util.inherits(Assemble, Env);


/**
 * Expose `assemble.create()`
 */

Assemble.prototype.createInst = function (options) {
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
