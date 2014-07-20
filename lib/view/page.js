'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');


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
  file.locals = _.extend(file.locals || {}, page.data);
  return file;
}


/**
 * Normalize the data structure to
 *
 * @param {Object} `options` options used to generate the pages.
 * @returns {Array} List of generated pages.
 */

function Page(options) {
  this.options = options || {};
}

Page.prototype.normalizePages = function(pages, options) {
  options = _.extend({}, this.options, options);

  var files = [];
  console.log('pages', pages);
  if (pages) {
    switch (utils.typeOf(pages)) {
      case 'array':
        pages.forEach(function (page) {
          files.push(parseFile(page.filepath, page, options));
        });
        break;

      case 'object':
        Object.keys(pages).forEach(function (page) {
          files.push(parseFile(page, pages[page], options));
        });
        break;
    }
  }
  return files;
};


module.exports = Page;
