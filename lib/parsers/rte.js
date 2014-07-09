'use strict';

var through = require('through2');
var Route = require('rte');
var extend = require('xtend');
var noop = function(dest) { return dest; };

module.exports = function routes(dest, opts) {
  opts = extend({}, opts);
  var rte = new Route(opts);
  rte.set('dest', dest);

  var options = extend({}, {assets: opts.assets}, opts);
  return rte.dest(dest, 'dest', options);
};