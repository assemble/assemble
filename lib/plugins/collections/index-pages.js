'use strict';

/**
 * Module dependencies.
 */

var inspect = require('util').inspect;
var through = require('through2');
var path = require('path');
var _ = require('lodash');


/**
 * Get a list of index pages based on the options.
 *
 * @param {Object} `collection` current collection used to generate the pages.
 * @param {Object} `options` options used to generate the pages.
 * @param {Function} `callback` callback function used when all the index pages have been generated.
 * @returns {undefined}
 */

module.exports = function indexPagesPlugin(collection, options, callback) {
  var assemble = this;

  options = options || {};
  if (!options.template) {
    return callback();
  }

  var files = [];

  var indexPages = through.obj(function (templateFile, enc, cb) {
    // paginated pages
    var pages = collection.pages();
    files = files.concat(pages.map(function (page, idx) {
      var file = templateFile.clone();
      file.data = _.extend(file.data || {}, {
        pagination: page,
        'debug-pagination': inspect(page, null, 10)
      });
      var currentPagePath = options.plural + '/' + (idx + 1);
      file.path = file.base + '/' + currentPagePath + '/index' + path.extname(file.path);
      return file;
    }));

    cb();
  }, function (cb) {
    callback(null, files);
    cb();
  });

  // read in the index template file
  assemble.src(options.template).pipe(indexPages);
};
