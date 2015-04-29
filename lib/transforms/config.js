'use strict';

var Store = require('data-store');
var chalk = require('chalk');
var _ = require('lodash');

/**
 * Initialize global config store, which is used for persisting globally
 * stored config values that may be used with any assemble project.
 *
 * **Commands**
 *
 *   - `set`: set a value
 *   - `get`: get a value
 *   - `del`: delete a value
 *   - `union`: push a value into an array
 *
 * **Examples**
 *
 * Set:
 *
 * ```sh
 * $ --set one=abc
 * #=> {one: 'abc'}
 *
 * $ --set one
 * #=> {one: true}
 * ```
 * Get:
 *
 * ```sh
 * $ --get one
 * # or
 * $ --get one,two,three
 * ```
 *
 * Initialized in the `init` transform.
 */

module.exports = function config_(assemble) {
  var config = assemble.config = new Store('assemble');
  var args;

  var del = assemble.get('argv.del');
  var set = assemble.get('argv.set');
  var union = assemble.get('argv.union');
  var get = assemble.get('argv.get');

  if (set) {
    args = set.split('=');
    if (args.length === 2) {
      config.set(args[0], args[1]);
    } else {
      config.set(args[0], true);
    }
  }

  if (union) {
    args = union.split('=');
    if (args.length > 1) {
      var val = config.get(args[1]);
      args[2] = args[2].split(',');
      config.set(args[1], _.union(val, args[2]));
    }
  }

  if (get) {
    if (get === true || get === 'true') {
      console.log(chalk.cyan('config config:'), chalk.bold(JSON.stringify(config.data)));
    } else if (get.indexOf(',') !== -1) {
      get.split(',').forEach(function (val) {
        console.log(val, '=', chalk.bold(JSON.stringify(config.get(val))));
      });
    } else {
      console.log(get, '=', chalk.bold(JSON.stringify(config.get(get))));
    }
  }

  if (del) {
    if (del.indexOf(',') !== -1) {
      del.split(',').forEach(function (val) {
        config.omit(val);
      });
    } else {
      config.omit(del);
    }
    console.log('deleted:', chalk.bold(del));
  }
};
