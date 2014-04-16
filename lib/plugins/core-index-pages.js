

/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var collections = require('assemble-collections');
var async = require('async');
var _ = require('lodash');

module.exports = function(assemble) {

  var events = assemble.config.plugins.events;

  var configureCollections = function (params, done) {
    assemble.log.debug('\t[core plugin]: ', 'core-index-pages plugin', params.event);
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
    name: 'core-collection-configure',
    description: 'Configure collections.',
    events: [
      events.assembleAfterConfiguration
    ]
  };

  var buildCollectionPages = function (params, done) {
    assemble.log.debug('\t[core plugin]: ', 'core-index-pages plugin', params.event);
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
          var totalCollectionItems = collection.collectionItems.length;
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
              context[collectionOpts.plural] = collections.cache[collectionOpts.plural].collectionItems.slice(startIdx, endIdx);

              // add additional metadata to the template
              indexTemplate.metadata[collectionOpts.plural] = context[collectionOpts.plural]; //_.omit(collections.cache[collectionOpts.plural], ['options', 'collectionItems', 'name', 'plural']);

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
            var totalItems = collectionItem.items.length;
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
                context['related-pages'] = collectionItem.items.items.slice(startIdx, endIdx);

                relatedTemplate.metadata['related-pages'] = context['related-pages'];

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
    name: 'core-collection-pages',
    description: 'Build collection index pages.',
    events: [
      events.assembleAfterBuild  // after building the pages
    ]
  };

  var rtn = {};
  rtn[configureCollections.options.name] = configureCollections;
  rtn[buildCollectionPages.options.name] = buildCollectionPages;
  return rtn;
};
