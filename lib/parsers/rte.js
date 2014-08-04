'use strict';

/**
 * Module dependencies.
 */

var Route = require('rte');
var _ = require('lodash');

module.exports = function routes(dest, opts) {
  opts = _.extend({}, opts);
  var rte = new Route(opts);
  rte.set('dest', dest);

  var options = _.extend({}, {assets: opts.assets}, opts);
  return rte.dest(dest, 'dest', options);
};