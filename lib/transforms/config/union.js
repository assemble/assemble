'use strict';

var union = require('arr-union');

/**
 * Get a value from the config store.
 *
 * ```sh
 * $ --union one=a,b,c
 * #=> {one: ['a', 'b', 'c']}
 *
 * $ --union one=d
 * #=> {one: ['a', 'b', 'c', 'd']}
 * ```
 */

module.exports = function config_(assemble) {
  var config = assemble.config;
  var args;

  var arr = assemble.get('argv.union');
  if (arr) {
    args = arr.split('=');
    if (args.length > 1) {
      var val = config.get(args[1]);
      args[2] = args[2].split(',');
      config.set(args[1], union(val, args[2]));
    }
  }
};
