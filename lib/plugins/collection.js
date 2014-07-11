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
        var relatedOpts = options['related_pages'] || {};

        var indexPages = collection.pages();

        assemble.src(indexOpts.template)
          .pipe(through.obj(function (indexFile, enc, cb) {

            indexPages.forEach(function (page, idx) {
              var file = indexFile.clone();
              file.locals = extend(file.locals || {}, {pagination: require('util').inspect(page)});
              file.path = file.base + '/' + plural + '/' + (idx + 1) + '/index' + path.extname(file.path);
              stream.push(file);
            });

            cb();
          }, function () {

            assemble.src(relatedOpts.template)
              .pipe(through.obj(function (relatedFile, enc, cb) {

                collection.forEach(function (item) {
                  var relatedPages = item.pages();
                  relatedPages.forEach(function (page, idx) {
                    var file = relatedFile.clone();
                    file.locals = extend(file.locals || {}, {pagination: require('util').inspect(page)});
                    file.path = file.base + '/' + plural + '/' + item.collectionItem + '/' + (idx + 1) + '/index' + path.extname(file.path);
                    stream.push(file);
                  });
                });

                cb();
              }));

          }));
      });
    });
  };
};