'use strict';

var chalk = require('chalk');

/**
 * Get a value from the config store.
 *
 * ```sh
 * $ --get one
 * # or
 * $ --get one,two,three
 * ```
 */

module.exports = function get_(assemble) {
  var config = assemble.config;
  var get = assemble.get('argv.get');

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
};
