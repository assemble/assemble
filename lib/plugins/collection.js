'use strict';

/**
 * Module dependencies.
 */

var collections = require('assemble-collections');
var through = require('through2');
var gutil = require('gulp-util');

var relatedPages = require('./collections/related-pages');
var indexPages = require('./collections/index-pages');

module.exports = function collectionsPlugin (cols, options) {
  var assemble = this;

  if (!cols || !cols.length) {
    return through.obj();
  }

  options = options || {};

  // Clear out the collections cache to ensure pages don't go across tasks
  collections.cache = [];

  // Setup initial collecitions
  if (cols) {
    cols = Array.isArray(cols) ? cols : [cols];
    cols.forEach(function (collection) {
      collections.createCollection(collection);
    });
  }

  // The actual plugin
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

    // keep a reference to the parent stream so we can push more new files through
    var stream = this;

    collections.forEach(function (collection) {
      var options = collection.options;
      var plural = options.plural;

      var indexOpts = options.index || {};
      indexOpts.plural = plural;

      var relatedOpts = options.relatedPages || {};
      relatedOpts.plural = plural;

      // Build the index pages
      indexPages(assemble)(collection, indexOpts, function (err, indexFiles) {
        if (err) {
          stream.emit('error', new gutil.PluginError('assemble-collections', err));
          return callback();
        }

        if (indexFiles) {
          // push the index pages for this collection into the main stream
          indexFiles.forEach(function (file) {
            stream.push(file);
          });
        }

        // Build the related pages for each collection and collection item
        relatedPages(assemble)(collection, relatedOpts, function (err, files) {
          if (err) {
            stream.emit('error', new gutil.PluginError('assemble-collections', err));
            return callback();
          }

          if (files) {
            // push the related pages for this collection into the main stream
            files.forEach(function (file) {
              stream.push(file);
            });
          }
          callback();
        });

      });
    });
  });
};