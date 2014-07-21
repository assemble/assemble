'use strict';

/**
 * Module dependencies.
 */

var Paginate = require('assemble-collections').Paginate;
var through = require('through2');
var gutil = require('gulp-util');
var extend = require('xtend');


module.exports = function (assemble) {
  return function (options) {
    options = options || {};

    // ensure there is only one item per page
    var paginateOpts = extend(options.paginate || {}, {
      limit: 1
    });

    var paginate = null;
    var idx = 0;

    // make our actual plugin
    return through.obj(function (file, encoding, next) {
      if (file.isNull()) {
        this.push(file);
        return next();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-paginate', 'Streaming not supported'));
        return next();
      }

      if (!paginate) {
        // create a new Paginate object used to generate the pagination data
        paginate = new Paginate(assemble.files.toArray(), paginateOpts);
      }

      // add the pagination data to the file's data
      var pagination = paginate.page(idx + 1);
      file.data = extend(file.data || {}, {
        pagination: pagination,
        'debug-pagination': require('util').inspect(pagination, null, 10)
      });
      idx++;

      this.push(file);
      next();
    });

  };
};