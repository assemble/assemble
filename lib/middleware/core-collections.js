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

  var events = assemble.utils.middleware.events;

  var configureCollections = function (params, done) {
    assemble.log.debug('\t[core middleware]: ', 'core-collections-config middleware', params.event);
    assemble.log.debug('\t[params]:', params);

    assemble.config.collections = assemble.config.collections || [];
    collections.cache = [];

    // generate a collection object for each collection in the assemble.config
    for (var i = 0; i < assemble.config.collections.length; i++) {
      collections.createCollection(assemble.config.collections[i]);
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
    assemble.log.debug('\t[core middleware]: ', 'core-collections-pages middleware', params.event);
    assemble.log.debug('\t[params]:', params);

    if (!assemble.config.collections) {
      return done();
    }

    async.series([
      // add the pages to the proper collections
      function (nextStep) {
        async.eachSeries(_.keys(assemble.pages),
          function (key, next) {
            collections.addItemToCollection(assemble.pages[key]);
            next();
          },
        nextStep);
      },

      // build a index pages for the collections
      function (nextStep) {
        async.eachSeries(assemble.config.collections, function (collectionOpts, next) {
          if (!collectionOpts.index) {
            return next();
          }

          var collection = collections.cache[collectionOpts.plural];
          var opts = collectionOpts.index || {};
          opts.pagination = opts.pagination || {};

          // sort the collection items
          var collectionItems = collection.sort(opts.pagination.sort || opts.pagination.sortby);
          var totalCollectionItems = collectionItems.length;
          var collectionItemsPerPage = opts.pagination.limit || totalCollectionItems;
          var totalPages = Math.ceil(totalCollectionItems / collectionItemsPerPage);

          var pageIndexes = [];
          for (var i = 0; i < totalPages; i++) {
            pageIndexes.push(i);
          }

          var pages = [];

          async.eachSeries(pageIndexes, function (idx, nextPage) {
            if(!opts.template || opts.template.length === 0) {
              return nextPage();
            }
            // load in the template
            var _id = 'collections-' + collectionOpts.plural + '-' + (idx+1);
            var indexTemplate = assemble.utils.component.fromFile(opts.template, 'component');
            indexTemplate._id = indexTemplate.data._id = _id;
            var indexDest = path.join((opts.dest || '.'), collectionOpts.plural);
            indexDest += (idx===0?'':'-'+(idx+1)) + (assemble.config.ext || '.html');
            indexTemplate.dest = indexTemplate.data.dest = indexDest;

            var context = {};
            var startIdx = idx * collectionItemsPerPage;
            var endIdx = startIdx + collectionItemsPerPage;
            context[collectionOpts.plural] = collectionItems.slice(startIdx, endIdx);

            // add additional data to the template
            indexTemplate.data[collectionOpts.plural] = context[collectionOpts.plural];

            // add permalinks options to control the dest
            var indexPermalinks = opts.permalinks || {};
            if (_.isEmpty(indexPermalinks)) {
              indexPermalinks.structure = indexDest;
            }

            if (!_.isEmpty(opts.pagination.prop)) {
              indexTemplate.data[opts.pagination.prop] = (idx+1);
            }

            indexTemplate.data.permalinks = indexPermalinks;

            // add this indexTemplate to the pages list to be rendered
            //assemble.pages[_id] = indexTemplate;
            pages.push(indexTemplate);
            nextPage();
          },
          function () {
            var i = 0;
            async.eachSeries(pages, function (page, nextPage) {
              page.data.pagination = {
                first: pages[0],
                prev: pages[(i === 0 ? pages.length - 1 : i-1)],
                next: pages[(i+1 === pages.length ? 0 : i+1)],
                last: pages[pages.length-1]
              };
              assemble.pages[page._id] = page;
              i++;
              // if the engine handles layouts, let it handle the page layout
              if (assemble.engine.handlesLayouts) {
                assemble.engine.loadComponentLayout(page, nextPage);
              } else {
                nextPage();
            }
            },
            next);
          });
        },
        nextStep);
      },

      // build related-pages pages for collection items
      function (nextStep) {
        async.eachSeries(assemble.config.collections, function (collectionOpts, next) {
          if (!collectionOpts['related_pages']) {
            return next();
          }

          var collection = collections.cache[collectionOpts.plural];
          var opts = collectionOpts['related_pages'] || {};
          opts.pagination = opts.pagination || {};

          async.eachSeries(collection.collectionItems.toArray(), function (collectionItem, nextCollectionItem) {

            collectionItem.pagination = collectionItem.pagination || {};

            var key = collectionItem.collectionItem;
            var items = collectionItem.items.sorted(opts.pagination.sort || opts.pagination.sortby);
            var totalItems = items.length;
            var itemsPerPage = opts.pagination.limit || totalItems;
            var totalPages = Math.ceil(totalItems / itemsPerPage);

            var pageIndexes = [];
            for (var i = 0; i < totalPages; i++) {
              pageIndexes.push(i);
            }

            var pages = [];

            async.eachSeries(pageIndexes, function (idx, nextPage) {
              if(!opts.template || opts.template.length === 0) {
                return nextPage();
              }
              var _id = 'collections-' + collectionOpts.plural + '-' + key + '-' + (idx+1);
              var relatedTemplate = assemble.utils.component.fromFile(opts.template, 'component');
              relatedTemplate._id = relatedTemplate.data._id = _id;
              var relatedDest = path.join((opts.dest || '.'), collectionOpts.plural);
              relatedDest += '-' + key + (idx===0?'':'-'+(idx+1)) + (assemble.config.ext || '.html');
              relatedTemplate.dest = relatedTemplate.data.dest = relatedDest;


              var context = {};
              var startIdx = idx * itemsPerPage;
              var endIdx = startIdx + itemsPerPage;
              context['related-pages'] = items.slice(startIdx, endIdx);

              relatedTemplate.data['related-pages'] = context['related-pages'];

              // add permalinks options to control the dest
              var relatedPermalinks = opts.permalinks || {};
              if (_.isEmpty(relatedPermalinks)) {
                relatedPermalinks.structure = relatedDest;
              }

              if (!_.isEmpty(opts.pagination.prop)) {
                relatedTemplate.data[opts.pagination.prop] = (idx+1);
              }

              relatedTemplate.data.permalinks = relatedPermalinks;
              relatedTemplate.data[collectionOpts.name] = key;
              relatedTemplate.data.paginate = false;


              pages.push(relatedTemplate);
              nextPage();
            },
            function () {
              var i = 0;
              async.eachSeries(pages, function (page, nextPage) {
                page.data.pagination = {
                  first: pages[0],
                  prev: pages[(i === 0 ? pages.length - 1 : i-1)],
                  next: pages[(i+1 === pages.length ? 0 : i+1)],
                  last: pages[pages.length-1]
                };
                assemble.pages[page._id] = page;
                if (i === 0) {
                  collectionItem.pagination.first = assemble.pages[page._id];
                }
                i++;

                // if the engine handles layouts, let it handle the page layout
                if (assemble.engine.handlesLayouts) {
                  assemble.engine.loadComponentLayout(page, nextPage);
                } else {
                  nextPage();
                }

              },
              nextCollectionItem);
            });
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

  var normalizeCollections = function (params, done) {
    if (!assemble.config.collections || assemble.config.collections.length === 0) {
      return done();
    }

    async.eachSeries(assemble.config.collections, function (collectionOpts, next) {

      var collection = collections.cache[collectionOpts.plural];
      var opts = collectionOpts['related_pages'] || {};
      opts.pagination = opts.pagination || {};

      // add this collection to the params context
      params.context.collections = params.context.collections || {};
      params.context.collections[collectionOpts.plural] = [];

      async.eachSeries(collection.collectionItems.toArray(), function (collectionItem, nextCollectionItem) {

        var key = collectionItem.collectionItem;
        var items = collectionItem.items.sorted(opts.pagination.sort || opts.pagination.sortby);

        var newItem = {};
        newItem[collectionOpts.name] = key;
        newItem.pagination = collectionItem.pagination;
        newItem.pages = [];

        async.eachSeries(items, function (item, nextItem) {
          newItem.pages.push(item);
          nextItem();
        },
        function () {
          params.context.collections[collectionOpts.plural].push(newItem);
          nextCollectionItem();
        });
      },
      next);
    },
    done);

  };

  normalizeCollections.options = {
    name: 'core-collections-normalize',
    description: 'Normalize the collections for the current page context.',
    events: [
      events.pageBeforeRender // just before rendering the page
    ]
  };

  var rtn = {};
  rtn[configureCollections.options.name] = configureCollections;
  rtn[buildCollectionPages.options.name] = buildCollectionPages;
  rtn[normalizeCollections.options.name] = normalizeCollections;
  return rtn;
};
