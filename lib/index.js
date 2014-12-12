'use strict';

var util = require('util');
var Env = require('./assemble');

/**
 * Create an Assemble instance
 */

function Assemble(options) {
  Env.call(this, options);
}

util.inherits(Assemble, Env);

/**
 * Expose `assemble.init()`
 */

Assemble.prototype.init = function (options) {
  return new Assemble(options);
};

/**
 * Initialize `Assemble`
 */

module.exports = new Assemble();
