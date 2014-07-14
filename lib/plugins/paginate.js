'use strict';

/**
 * Module dependencies.
 */

var Paginate = require('assemble-collections').Paginate;
var through = require('through2');
var gutil = require('gulp-util');
var extend = require('xtend');
var path = require('path');

module.exports = function (assemble) {

  return function (options) {
    options = options || {};

    // keep a list of the pages to be able to generate
    // pagination data around
    var pages = [];

    // ensure there is only one item per page
    var paginateOpts = extend(options.paginate || {}, {
      limit: 1
    });

    // make our actual plugin
    return through.obj(function (file, enc, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-collections', 'Streaming not supported'));
        return callback();
      }

      // keep the file
      pages.push(file);
      callback();

    }, function (callback) {

      // create a new Paginate object used to generate the
      // pagination data and add it to the files' locals
      var paginate = new Paginate(pages, paginateOpts);

      pages.forEach(function (page, idx) {
        var pagination = paginate.page(idx + 1);
        page.locals = extend(page.locals || {}, {
          pagination: pagination,
          'debug-pagination': require('util').inspect(pagination, null, 10)
        });
        this.push(page);
      }.bind(this));

      callback();

    });
  };
};