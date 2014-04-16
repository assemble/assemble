

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

    async.each(_.keys(assemble.components),
      function (key, next) {
        collections.addItemToCollection(assemble.components[key]);
        next();
      },

    done);
  };

  buildCollectionPages.options = {
    name: 'core-collection-pages',
    description: 'Build collection index pages.',
    events: [
      events.assembleBeforeBuild  // before building the pages
    ]
  };

  var rtn = {};
  rtn[configureCollections.options.name] = configureCollections;
  rtn[buildCollectionPages.options.name] = buildCollectionPages;
  return rtn;
};
