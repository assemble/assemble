'use strict';

/**
 * Module dependencies.
 */

var Route = require('rte');
var extend = require('xtend');

module.exports = function routes(dest, opts) {
  opts = extend({}, opts);
  var rte = new Route(opts);
  rte.set('dest', dest);

  var options = extend({}, {assets: opts.assets}, opts);
  return rte.dest(dest, 'dest', options);
};