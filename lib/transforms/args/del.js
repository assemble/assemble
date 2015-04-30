'use strict';

var chalk = require('chalk');

/**
 * Delete a value from the config store.
 *
 * ```sh
 * $ --del foo
 * ```
 */

module.exports = function del_(assemble) {
  var config = assemble.config;
  var del = assemble.get('argv.del');
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
