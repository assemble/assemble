'use strict';

/**
 * Persist a value on the config store.
 *
 * ```sh
 * $ --set one=abc
 * #=> {one: 'abc'}
 *
 * $ --set one
 * #=> {one: true}
 * ```
 */

module.exports = function config_(assemble) {
  var config = assemble.config;
  var args;

  var set = assemble.get('argv.set');
  if (set) {
    args = set.split('=');
    if (args.length === 2) {
      config.set(args[0], args[1]);
    } else {
      config.set(args[0], true);
    }
  }
};
