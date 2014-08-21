'use strict';

/**
 * Module dependencies.
 */

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

module.exports = function collectionsPlugin(options) {
  var assemble = this;
  var opts = _.extend({}, options);
  var collections = assemble.get('collections');
  var cols = opts.collections;
  if (!cols || !cols.length || _.isEmpty(collections.cache)) {
    return through.obj();
  }

  // Setup initial collecitions
  if (cols) {
    cols = Array.isArray(cols) ? cols : [cols];
    cols.forEach(function (collection) {
      collections.createCollection(collection);
    });
  }

  // The actual plugin
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-collections', 'Streaming not supported'));
      return cb();
    }

    // add the file to the proper collections
    collections.addItemToCollection(file);

    // push the file along
    this.push(file);
    cb();
  }, function (cb) {

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
          return cb();
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
            return cb();
          }

          if (files) {
            // push the related pages for this collection into the main stream
            files.forEach(function (file) {
              stream.push(file);
            });
          }
          cb();
        });

      });
    });
  });
};
