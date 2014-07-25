'use strict';

/**
 * Module dependencies.
 */

var inspect = require('util').inspect;
var through = require('through2');
var extend = require('xtend');
var path = require('path');

/**
 * Get a list of related pages based on the options.
 *
 * @param {Object} `collection` current collection used to generate the pages.
 * @param {Object} `options` options used to generate the pages.
 * @param {Function} `callback` callback function used when all the related pages have been generated.
 * @returns {undefined}
 */

module.exports = function (assemble) {
  return function makeRelatedPages (collection, options, callback) {
    options = options || {};
    if (!options.template) {
      return callback();
    }

    var files = [];

    var relatedPages = through.obj(function (templateFile, enc, cb) {
      collection.forEach(function (item) {
        var pages = item.pages();
        files = files.concat(pages.map(function (page, idx) {
          var file = templateFile.clone();

          file.data = extend(file.data || {}, {
            pagination: inspect(page, null, 10)
          });

          // generate a page path like 'tags/football/2/index.hbs'
          var currentPagePath = options.plural + '/' + item.collectionItem + '/' + (idx + 1);
          file.path = file.base + '/' + currentPagePath + '/index' + path.extname(file.path);
          return file;
        }));
      });

      cb();
    }, function (cb) {
      callback(null, files);
      cb();
    });

    // read in the related pages template
    assemble.src(options.template).pipe(relatedPages);
  };
};