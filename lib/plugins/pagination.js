/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var _ = require('lodash');

module.exports = function(assemble) {

  var events = assemble.config.plugins.events;

  var plugin = function (params, done) {
    assemble.log.debug('Core Pagination Plugin: ', params.event);
    assemble.log.debug('Params: ', params);

    var buildPaginationInfo = function() {

      var i = 0;
      var prevComponent = null;

      var keys = _.keys(assemble.components);
      var j = keys.length;

      async.eachSeries(keys,
        function (key, next) {
          var component = assemble.components[key];

          // Index and actual page number
          component.index = i;
          component.number = i + 1;

          // First component
          component.first = (i === 0);

          // Previous component
          if (prevComponent !== null) {
            component.prev = prevComponent;
          }

          // Middle components
          component.middle = i > 0 && i < (j - 1);

          // Next component
          if (i < j - 1) {
            component.next = i + 1;
          }

          // Last component
          component.last = i === (j - 1);
          prevComponent = i;

          next();
        },
      done);
    };


    var addPaginationInfoToContext = function() {
      var components  = assemble.components;
      var currentPage = params.component;

      var keys = _.keys(components);

      params.context.pagination = {
        first      : components[keys[currentPage.first  || 0]],
        prev       : components[keys[currentPage.prev   || 0]],
        middle     : components[keys[currentPage.middle]],
        next       : components[keys[currentPage.next   || (keys.length - 1)]],
        last       : components[keys[currentPage.last   || (keys.length - 1)]],

        index      : components[keys[currentPage.index]],
        number     : currentPage.index + 1,
        currentPage: currentPage.index + 1,
        totalPages : keys.length
      };

      done();
    };

    if (params.event === events.assembleAfterBuild) {
      buildPaginationInfo();
    } else if (params.event === events.componentBeforeRender) {
      addPaginationInfoToContext();
    } else {
      done();
    }

  };


  plugin.options = {
    name: 'core-pagination',
    description: 'Create pagination information for page components.',
    events: [
      events.assembleAfterBuild,    // after building all components
      events.componentBeforeRender  // before rendering each component
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};