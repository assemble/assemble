'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');
var extend = require('xtend');
var utils = require('../utils');

/**
 * Local dependencies.
 */

var utils = require('../utils');

module.exports = function (assemble) {

  function parseFile (filepath, page) {
    var file = utils.parseFile(filepath, page.contents);
    file.locals = extend(file.locals || {}, page.matter);
    return file;
  }

  /**
   * If a pages option is passed in, use it to generate Viynl files
   *
   * @param {Object} `options` options used to generate the pages.
   * @returns {Array} list of pages
   */

  function normalizePages (options) {
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
  }


  return function (options) {
    options = options || {};

    var pages = normalizePages(options);

    // if no pages, just return a noop
    if (!pages.length) {
      return gutil.noop();
    }

    // make our actual plugin
    return through.obj(function (file, enc, callback) {

      // just pass through all the files
      this.push(file);
      callback();

    }, function (callback) {

      // add all the page to the stream
      pages.forEach(function (file) {
        this.push(file);
      }.bind(this));

      callback();

    });
  };
};