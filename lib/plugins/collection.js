'use strict';

/**
 * Module dependencies.
 */

var collections = require('assemble-collections');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

/**
 * Lodal dependencies
 */

var relatedPages = require('./collections/related-pages');
var indexPages = require('./collections/index-pages');


/**
 * Collections plugin
 */

module.exports = function collectionsPlugin(cols, options) {
  var assemble = this;
  var opts = _.extend({}, options);

  if (!cols || !cols.length) {
    return through.obj();
  }

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
      var collOpts = _.extend({}, opts, collection.options);
      var plural = collOpts.plural;

      var indexOpts = collOpts.index || {};
      indexOpts.plural = plural;

      var relatedOpts = collOpts.relatedPages || {};
      relatedOpts.plural = plural;

      // Build the index pages
      indexPages.call(assemble, collection, indexOpts, function (err, indexFiles) {
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
        relatedPages.call(assemble, collection, relatedOpts, function (err, files) {
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