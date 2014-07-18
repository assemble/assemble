'use strict';

/**
 * Module dependencies.
 */

var extend = require('xtend');


/**
 * Local dependencies.
 */

var utils = require('../utils');


/**
 * ## `options.pages`
 *
 * If a `pages` option is passed in, use it to generate Viynl files
 *
 */

function parseFile (filepath, page) {
  var file = utils.parseFile(filepath, page.contents);
  file.locals = extend(file.locals || {}, page.matter);
  return file;
}


/**
 * Normalize the data structure to
 *
 * @param {Object} `options` options used to generate the pages.
 * @returns {Array} List of generated pages.
 */

module.exports = function normalizePages (options) {
  options = options || {};

  var files = [];
  if (options.pages) {
    switch (utils.typeOf(options.pages)) {
      case 'array':
        files = options.pages.map(function (page) {
          return parseFile(page.filepath, page);
        });
        break;

      case 'object':
        files = Object.keys(options.pages).map(function (key) {
          return parseFile(key, options.pages[key]);
        });
        break;
    }
  }
  return files;
};
