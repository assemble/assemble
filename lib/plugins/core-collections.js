

/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var path = require('path');

// node_modules
var collections = require('assemble-collections');
var async = require('async');
var _ = require('lodash');

module.exports = function(assemble) {

  var events = assemble.config.plugins.events;

  var configureCollections = function (params, done) {
    assemble.log.debug('\t[core plugin]: ', 'core-collections-config plugin', params.event);
    assemble.log.debug('\t[params]:', params);

    assemble.options.collections = assemble.options.collections || [];
    collections.cache = [];

    // generate a collection object for each collection in the assemble.options
    for (var i = 0; i < assemble.options.collections.length; i++) {
      collections.createCollection(assemble.options.collections[i]);
    }

    assemble.collections = collections.cache;

    done();
  };

  configureCollections.options = {
    name: 'core-collections-configure',
    description: 'Configure collections.',
    events: [
      events.assembleAfterConfiguration
    ]
  };

  var buildCollectionPages = function (params, done) {
    assemble.log.debug('\t[core plugin]: ', 'core-collections-pages plugin', params.event);
    assemble.log.debug('\t[params]:', params);

    if (!assemble.options.collections) {
      return done();
    }

    async.series([
      // add the pages to the proper collections
      function (nextStep) {
        async.eachSeries(_.keys(assemble.components),
          function (key, next) {
            collections.addItemToCollection(assemble.components[key]);
            next();
          },
        nextStep);
      },

      // build a index pages for the collections
      function (nextStep) {
        async.eachSeries(assemble.options.collections, function (collectionOpts, next) {
          if (!collectionOpts.index) {
            return next();
          }

          var collection = collections.cache[collectionOpts.plural];
          // sort the collection items
          var collectionItems = collection.sort(collectionOpts.index.pagination.sort || collectionOpts.index.pagination.sortby);
          var totalCollectionItems = collectionItems.length;
          var collectionItemsPerPage = collectionOpts.index.pagination.limit || totalCollectionItems;
          var totalPages = Math.ceil(totalCollectionItems / collectionItemsPerPage);

          var pageIndexes = [];
          for (var i = 0; i < totalPages; i++) {
            pageIndexes.push(i);
          }

          async.eachSeries(pageIndexes, function (idx, nextPage) {
            // load in the template
            assemble.models.Component.readFile(collectionOpts.index.template, 'component', function(err, indexTemplate) {
              if (err) {
                console.log('Error', err);
                return nextPage();
              }

              var context = {};
              var startIdx = idx * collectionItemsPerPage;
              var endIdx = startIdx + collectionItemsPerPage;
              context[collectionOpts.plural] = collectionItems.slice(startIdx, endIdx);

              // add additional metadata to the template
              indexTemplate.metadata[collectionOpts.plural] = context[collectionOpts.plural];
              indexTemplate.metadata.dest = indexTemplate.dest = path.join(
                (collectionOpts.index.dest || '.'),
                collectionOpts.plural,
                ''+(idx+1),
                'index.html');

              // add this indexTemplate to the components list to be rendered
              assemble.components['collections-' + collectionOpts.plural + '-' + (idx+1)] = indexTemplate;
              nextPage();
            });
          },
          next);
        },
        nextStep);
      },

      // build related-pages pages for collection items
      function (nextStep) {
        async.eachSeries(assemble.options.collections, function (collectionOpts, next) {
          if (!collectionOpts['related_pages']) {
            return next();
          }

          var collection = collections.cache[collectionOpts.plural];

          async.eachSeries(collection.collectionItems.toArray(), function (collectionItem, nextCollectionItem) {

            var key = collectionItem.collectionItem;
            var items = collectionItem.items.sorted(collectionOpts['related_pages'].pagination.sort || collectionOpts['related_pages'].pagination.sortby);
            var totalItems = items.length;
            var itemsPerPage = collectionOpts['related_pages'].pagination.limit || totalItems;
            var totalPages = Math.ceil(totalItems / itemsPerPage);

            var pageIndexes = [];
            for (var i = 0; i < totalPages; i++) {
              pageIndexes.push(i);
            }

            async.eachSeries(pageIndexes, function (idx, nextPage) {
              assemble.models.Component.readFile(collectionOpts['related_pages'].template, 'component', function (err, relatedTemplate) {
                if (err) {
                  //console.log('Error', err);
                  console.log('Error building related-pages template');
                  return nextPage();
                }

                var context = {};
                var startIdx = idx * itemsPerPage;
                var endIdx = startIdx + itemsPerPage;
                context['related-pages'] = items.slice(startIdx, endIdx);

                relatedTemplate.metadata['related-pages'] = context['related-pages'];
                relatedTemplate.metadata.dest = relatedTemplate.dest = path.join(
                  (collectionOpts['related_pages'].dest || '.'),
                  collectionOpts.plural,
                  key,
                  ''+(idx+1),
                  'index.html');

                assemble.components['collections-' + collectionOpts.plural + '-' + key + '-' + (idx+1)] = relatedTemplate;
                nextPage();
              });
            },
            nextCollectionItem);
          },
          next);
        },
        nextStep);
      }
    ],
    done);

  };

  buildCollectionPages.options = {
    name: 'core-collections-pages',
    description: 'Build collection pages.',
    events: [
      events.assembleAfterBuild  // after building the pages
    ]
  };

  var rtn = {};
  rtn[configureCollections.options.name] = configureCollections;
  rtn[buildCollectionPages.options.name] = buildCollectionPages;
  return rtn;
};
