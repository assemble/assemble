'use strict';

/**
 * Module dependencies.
 */

var path = require('path');


/**
 * Resolve the absolute filepath.
 *
 * @param  {String} `filepath`
 * @return {String}
 */

module.exports = function(filepath) {
  filepath = path.join(process.cwd(), filepath);
  return filepath.replace(/[\\\/]+/g, '/');
};
