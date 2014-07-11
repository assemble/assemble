'use strict';

/**
 * Module dependencies.
 */

var collections = require('assemble-collections');
var through = require('through2');
var gutil = require('gulp-util');
var extend = require('xtend');
var path = require('path');

module.exports = function (assemble) {

  /**
   * Get a list of index pages based on the options.
   *
   * @param {Object} `collection` current collection used to generate the pages.
   * @param {Object} `options` options used to generate the pages.
   * @param {Function} `callback` callback function used when all the index pages have been generated.
   * @returns {undefined}
   */

  function makeIndexPages (collection, options, callback) {
    options = options || {};
    if (!options.template) {
      return callback();
    }

    var files = [];
    // read in the index template file
    assemble.src(options.template)
      .pipe(through.obj(function (templateFile, enc, cb) {

        // paginated pages
        var pages = collection.pages();

        files = files.concat(pages.map(function (page, idx) {
          var file = templateFile.clone();
          file.locals = extend(file.locals || {}, {pagination: page});
          var currentPagePath = options.plural + '/' + (idx + 1);
          file.path = file.base + '/' + currentPagePath + '/index' + path.extname(file.path);
          return file;
        }));

        cb();
      }, function () {
        callback(null, files);
      }));
  }


  /**
   * Get a list of related pages based on the options.
   *
   * @param {Object} `collection` current collection used to generate the pages.
   * @param {Object} `options` options used to generate the pages.
   * @param {Function} `callback` callback function used when all the related pages have been generated.
   * @returns {undefined}
   */

  function makeRelatedPages (collection, options, callback) {
    options = options || {};
    if (!options.template) {
      return callback();
    }

    var files = [];

    // read in the related pages template
    assemble.src(options.template)
      .pipe(through.obj(function (templateFile, enc, cb) {

        collection.forEach(function (item) {
          var pages = item.pages();
          files = files.concat(pages.map(function (page, idx) {
            var file = templateFile.clone();
            file.locals = extend(file.locals || {}, {pagination: page});
            // generate a page path like 'tags/football/2/index.hbs'
            var currentPagePath = options.plural + '/' + item.collectionItem + '/' + (idx + 1);
            file.path = file.base + '/' + currentPagePath + '/index' + path.extname(file.path);
            return file;
          }));
        });

        cb();
      }, function () {
        callback(null, files);
      }));
  }

  return function (options) {
    options = options || {};

    // clear out the collections to ensure pages not go across tasks
    collections.cache = [];

    // setup initial collecitions
    if (options.collections) {
      options.collections = Array.isArray(options.collections) ? options.collections : [options.collections];
      options.collections.forEach(function (collection) {
        collections.createCollection(collection);
      });
    }

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

      // add the file to the proper collections
      collections.addItemToCollection(file);

      // push the file along
      this.push(file);
      callback();

    }, function (callback) {

      // keep a reference to the parent stream
      // so we can push more new files through
      var stream = this;

      // build the index and related pages for each collection
      // and collection item
      collections.forEach(function (collection) {
        var options = collection.options;
        var plural = options.plural;

        var indexOpts = options.index || {};
        indexOpts.plural = plural;

        var relatedOpts = options['related_pages'] || {};
        relatedOpts.plural = plural;

        makeIndexPages(collection, indexOpts, function (err, indexFiles) {
          if (err) {
            stream.emit('error', new gutil.PluginError('assemble-collections', err));
            return callback();
          }

          // push the index pages for this collection into the main stream
          indexFiles.forEach(function (file) {
            stream.push(file);
          });

          makeRelatedPages(collection, relatedOpts, function (err, files) {
            if (err) {
              stream.emit('error', new gutil.PluginError('assemble-collections', err));
              return callback();
            }

            // push the related pages for this collection into the main stream
            files.forEach(function (file) {
              stream.push(file);
            });
            callback();
          });

        });
      });
    });
  };
};